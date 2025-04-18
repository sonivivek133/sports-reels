import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';

// Initialize AWS Polly with environment variables
const polly = new AWS.Polly({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Validate request body
  const { script, celebrity } = req.body;
  if (!script || typeof script !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "script" parameter.' });
  }
  if (!celebrity || typeof celebrity !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "celebrity" parameter.' });
  }

  try {
    // Generate audio using AWS Polly
    const audioResponse = await polly
      .synthesizeSpeech({
        Text: script,
        OutputFormat: 'mp3',
        VoiceId: process.env.AWS_POLLY_VOICE_ID || 'Joanna',
      })
      .promise();

    if (!audioResponse.AudioStream) {
      throw new Error('AudioStream is empty.');
    }

    // Create unique filename
    const sanitizedName = celebrity.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const audioKey = `audio/${sanitizedName}-${Date.now()}.mp3`;

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: audioKey,
        Body: audioResponse.AudioStream as Buffer,
        ContentType: 'audio/mpeg',
      })
    );

    // Return the S3 URL
    const audioUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${audioKey}`;
    
    return res.status(200).json({ 
      success: true,
      audioUrl,
      key: audioKey // Optional: for tracking purposes
    });

  } catch (error) {
    console.error('Error generating audio:', error);
    
    // Enhanced error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isAwsError = error instanceof Error && 'code' in error;
    
    return res.status(500).json({
      error: 'Failed to generate audio',
      details: isAwsError ? `AWS Error: ${error.code}` : errorMessage,
      fallback: 'Could not generate audio. Please try again.'
    });
  }
}