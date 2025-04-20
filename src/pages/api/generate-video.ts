import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { promisify } from 'util';
import { withErrorHandler } from './errorHandler';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketEndpoint = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

const NBA_PLAYER_IDS: Record<string, number> = {
  'LeBron James': 2544,
  'Stephen Curry': 201939,
  'Kevin Durant': 201142,
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

const IMAGE_COUNT = 2; // Images per reel
const REEL_COUNT = 1;  // Number of reels to generate
const IMAGE_DURATION = 1; // seconds per image

async function downloadImagesWithFallbacks(celebrity: string): Promise<Buffer[]> {
  const images: Buffer[] = [];
  const IMAGE_TOTAL = IMAGE_COUNT * REEL_COUNT;

  // NBA CDN
  if (NBA_PLAYER_IDS[celebrity]) {
    try {
      const nbaUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${NBA_PLAYER_IDS[celebrity]}.png`;
      const nbaImg = await axios.get(nbaUrl, { responseType: 'arraybuffer' });
      images.push(Buffer.from(nbaImg.data, 'binary'));
    } catch {}
  }

  // Wikimedia Commons
  try {
    const wikiApi = `https://en.wikipedia.org/w/api.php?action=query&generator=images&titles=${encodeURIComponent(celebrity)}&gimlimit=10&prop=imageinfo&iiprop=url&format=json`;
    const wikiResp = await axios.get(wikiApi);
    const pages = wikiResp.data?.query?.pages || {};
    for (const page of Object.values(pages)) {
      const url = (page as { imageinfo?: { url?: string }[] }).imageinfo?.[0]?.url;
      if (url && /\.(jpg|jpeg|png)$/i.test(url)) {
        try {
          const imgResp = await axios.get(url, { responseType: 'arraybuffer' });
          images.push(Buffer.from(imgResp.data, 'binary'));
          if (images.length >= IMAGE_TOTAL) break;
        } catch {}
      }
    }
  } catch {}

  // Pexels API
  if (process.env.PEXELS_API_KEY) {
    try {
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(celebrity)}&per_page=${IMAGE_TOTAL}`;
      const pexelsResp = await axios.get(pexelsUrl, {
        headers: { Authorization: process.env.PEXELS_API_KEY },
        responseType: 'json',
      });
      if (pexelsResp.data.photos?.length > 0) {
        for (const photo of pexelsResp.data.photos) {
          const imageUrl = photo.src.large2x;
          try {
            const imgResp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            images.push(Buffer.from(imgResp.data, 'binary'));
            if (images.length >= IMAGE_TOTAL) break;
          } catch {}
        }
      }
    } catch {}
  }

  // Unsplash fallback
  const fallbackUrls = [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=1400&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505843273132-bc5a993635c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];
  let i = 0;
  while (images.length < IMAGE_TOTAL) {
    try {
      const url = fallbackUrls[i % fallbackUrls.length];
      const imgResp = await axios.get(url, { responseType: 'arraybuffer' });
      images.push(Buffer.from(imgResp.data, 'binary'));
    } catch {}
    i++;
  }

  return images.slice(0, IMAGE_TOTAL);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const tempFiles: string[] = [];
  try {
    const { audioBuffer, celebrity, script } = req.body;
    if (!audioBuffer || !celebrity || !script) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Convert audio data to Buffer
    let audioData: Buffer;
    if (typeof audioBuffer === 'string' && audioBuffer.startsWith('data:')) {
      const base64Data = audioBuffer.split('base64,')[1];
      if (!base64Data) return res.status(400).json({ error: 'Invalid Base64 audioBuffer format' });
      audioData = Buffer.from(base64Data, 'base64');
    } else if (Array.isArray(audioBuffer)) {
      try {
        audioData = Buffer.from(new Uint8Array(audioBuffer));
      } catch (error) {
        return res.status(400).json({ error: 'Invalid ArrayBuffer format' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid audio format: must be Base64 or ArrayBuffer' });
    }

    const sanitizedName = celebrity.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const timestamp = Date.now();

    // Download enough images for all reels
    const allImages = await downloadImagesWithFallbacks(celebrity);

    const reels: any[] = [];
    for (let reelIdx = 0; reelIdx < REEL_COUNT; reelIdx++) {
      // Pick a different slice of images for each reel
      const images = allImages.slice(reelIdx * IMAGE_COUNT, (reelIdx + 1) * IMAGE_COUNT);
      while (images.length < IMAGE_COUNT) images.push(images[images.length - 1]);

      // Save images
      const imagePaths: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const imgPath = path.join(tempDir, `${sanitizedName}-reel${reelIdx}-img${i}-${timestamp}.jpg`);
        await writeFile(imgPath, images[i]);
        imagePaths.push(imgPath);
        tempFiles.push(imgPath);
      }

      // Save audio file
      const audioPath = path.join(tempDir, `${sanitizedName}-reel${reelIdx}-audio-${timestamp}.mp3`);
      await writeFile(audioPath, audioData);
      tempFiles.push(audioPath);

      // Prepare ffmpeg input file list for slideshow
      const ffmpegListPath = path.join(tempDir, `${sanitizedName}-reel${reelIdx}-ffmpeg-list-${timestamp}.txt`);
      const ffmpegListContent = imagePaths.map(img => `file '${img.replace(/\\/g, '/')}'\nduration ${IMAGE_DURATION}`).join('\n');
      await writeFile(ffmpegListPath, ffmpegListContent + `\nfile '${imagePaths[imagePaths.length - 1].replace(/\\/g, '/')}'\n`);
      tempFiles.push(ffmpegListPath);

      // Output video path
      const videoPath = path.join(tempDir, `${sanitizedName}-reel${reelIdx}-video-${timestamp}.mp4`);
      tempFiles.push(videoPath);

      // Generate slideshow video from images
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(ffmpegListPath)
          .inputOptions(['-f concat', '-safe 0'])
          .outputOptions([
            '-vf scale=720:1280,format=yuv420p',
            '-pix_fmt yuv420p',
            '-r 30'
          ])
          .outputOptions('-y')
          .output(videoPath)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });

      // Merge audio with slideshow video
      const finalVideoPath = path.join(tempDir, `${sanitizedName}-reel${reelIdx}-final-${timestamp}.mp4`);
      tempFiles.push(finalVideoPath);

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(videoPath)
          .input(audioPath)
          .outputOptions([
            '-c:v copy',
            '-c:a aac',
            '-shortest',
            '-movflags faststart'
          ])
          .output(finalVideoPath)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });

      // Upload to S3
      const videoData = await readFile(finalVideoPath);
      const videoKey = `reels/${sanitizedName}-reel${reelIdx}-${timestamp}.mp4`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: videoKey,
          Body: videoData,
          ContentType: 'video/mp4',
        })
      );

      reels.push({
        id: `${sanitizedName}-reel${reelIdx}-${timestamp}`,
        videoUrl: `${bucketEndpoint}/${videoKey}`,
        celebrity,
        script,
        title: `${celebrity}'s Career Highlights`,
        description: `${script.substring(0, 97)}${script.length > 97 ? '...' : ''}`,
      });
    }

    return res.status(200).json({ success: true, reels });
  } catch (error) {
    console.error('Video generation error:', error);
    return res.status(500).json({
      error: 'Video generation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    // Cleanup temporary files
    try {
      await Promise.all(
        tempFiles
          .filter((filePath) => filePath && fs.existsSync(filePath))
          .map((filePath) => unlink(filePath).catch((e) => console.error(`Error deleting ${filePath}:`, e)))
      );
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
  }
}

export default withErrorHandler(handler);