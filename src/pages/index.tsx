// import { useState } from 'react';
// import Reel from './components/Reel';
// import axios from 'axios';
// import ErrorBoundary from './components/ErrorBoundary';

// interface ReelItem {
//   id: string;
//   title: string;
//   videoUrl: string;
//   description: string;
//   celebrity: string;
//   likes: number;
//   shares: number;
//   comments: number;
// }

// function ApiErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
//   return (
//     <div style={{
//       padding: '20px',
//       border: '1px solid #ff6b6b',
//       borderRadius: '4px',
//       backgroundColor: '#fff5f5',
//       textAlign: 'center',
//       margin: '20px 0'
//     }}>
//       <h3 style={{ color: '#ff6b6b' }}>Failed to load reels</h3>
//       <p style={{ color: '#ff6b6b', margin: '10px 0' }}>
//         {error.message.includes('Failed to generate') 
//           ? "Couldn't create a new reel. Please try again."
//           : "We're having trouble loading content."}
//       </p>
//       <button 
//         onClick={resetErrorBoundary}
//         style={{
//           padding: '8px 16px',
//           backgroundColor: '#ff6b6b',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         Try Again
//       </button>
//     </div>
//   );
// }

// export default function Home() {
//   const [reels, setReels] = useState<ReelItem[]>([]);
//   const [celebrity, setCelebrity] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
//   const [isMuted, setIsMuted] = useState(true);

//   const generateReel = async () => {
//     if (!celebrity.trim()) {
//       alert('Please enter a celebrity name');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // 1. Generate Script
//       const scriptResponse = await axios.post('/api/generate-script', { celebrity });
//       const script = scriptResponse.data.script;
//       if (!script) throw new Error('No script generated');

//       // 2. Generate Audio
//       const audioResponse = await axios.post('/api/generate-audio', { 
//         script,
//         celebrity 
//       });
      
//       if (!audioResponse.data.audioUrl) {
//         throw new Error('No audio URL returned');
//       }

//       // 3. Download Audio
//       const audioDownload = await axios.get(audioResponse.data.audioUrl, { 
//         responseType: 'arraybuffer'
//       });
//       const audioBuffer = new Uint8Array(audioDownload.data);

//       // 4. Generate Video
//       const videoResponse = await axios.post('/api/generate-video', {
//         audioBuffer: Array.from(audioBuffer),
//         celebrity,
//         script
//       });

//       // 5. Add to Reels
//       setReels(prev => [{
//         ...videoResponse.data,
//         id: Date.now().toString(),
//         likes: 0,
//         shares: 0,
//         comments: 0
//       }, ...prev]);

//     } catch (error) {
//       throw new Error(`Failed to generate reel: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//       setCelebrity('');
//     }
//   };

//   const toggleLike = (id: string) => {
//     setLikedReels(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
//       {/* Header Section */}
//       <header style={{
//         backgroundColor: '#1e40af',
//         color: 'white',
//         padding: '20px',
//         textAlign: 'center',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//       }}>
//         <h1 style={{ 
//           fontSize: '28px', 
//           fontWeight: 'bold',
//           marginBottom: '8px'
//         }}>
//           Sports Celebrity Reels
//         </h1>
//         <p style={{ 
//           fontSize: '16px',
//           opacity: 0.9,
//           margin: 0
//         }}>
//           Create amazing reels for your favorite sports celebrities
//         </p>
//       </header>

//       {/* Main Content */}
//       <main style={{
//         flex: 1,
//         padding: '24px',
//         maxWidth: '800px',
//         margin: '0 auto',
//         width: '100%'
//       }}>
//         {/* Input Section */}
//         <div style={{
//           display: 'flex',
//           gap: '12px',
//           marginBottom: '24px',
//           flexDirection: { xs: 'column', sm: 'row' }
//         }}>
//           <input
//             type="text"
//             value={celebrity}
//             onChange={(e) => setCelebrity(e.target.value)}
//             placeholder="Enter sports celebrity name"
//             style={{
//               flex: 1,
//               padding: '12px 16px',
//               border: '1px solid #d1d5db',
//               borderRadius: '8px',
//               fontSize: '16px',
//               outline: 'none',
//               transition: 'border-color 0.2s',
//               ':focus': {
//                 borderColor: '#3b82f6'
//               }
//             }}
//             onKeyDown={(e) => e.key === 'Enter' && generateReel()}
//             disabled={isLoading}
//           />
//           <button
//             onClick={generateReel}
//             disabled={isLoading || !celebrity.trim()}
//             style={{
//               backgroundColor: isLoading 
//                 ? '#93c5fd' 
//                 : !celebrity.trim() 
//                   ? '#d1d5db' 
//                   : '#2563eb',
//               color: 'white',
//               padding: '12px 24px',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: isLoading || !celebrity.trim() ? 'not-allowed' : 'pointer',
//               fontSize: '16px',
//               fontWeight: '500',
//               minWidth: '120px',
//               transition: 'background-color 0.2s',
//               ':hover': {
//                 backgroundColor: isLoading || !celebrity.trim() ? '' : '#1d4ed8'
//               }
//             }}
//           >
//             {isLoading ? 'Creating...' : 'Create Reel'}
//           </button>
//         </div>

//         {/* Reels Section with Error Boundary */}
//         <ErrorBoundary
//           FallbackComponent={ApiErrorFallback}
//           onReset={() => setReels([])}
//         >
//           {reels.length > 0 ? (
//             <Reel
//               reels={reels}
//               likedReels={likedReels}
//               toggleLike={toggleLike}
//               isMuted={isMuted}
//               setIsMuted={setIsMuted}
//             />
//           ) : (
//             <div style={{
//               textAlign: 'center',
//               marginTop: '40px',
//               color: '#6b7280',
//               padding: '40px 20px',
//               border: '1px dashed #d1d5db',
//               borderRadius: '8px'
//             }}>
//               <p style={{ fontSize: '18px', marginBottom: '16px' }}>
//                 No reels available yet
//               </p>
//               <p style={{ fontSize: '14px', opacity: 0.8 }}>
//                 Enter a celebrity name and click "Create Reel" to get started
//               </p>
//             </div>
//           )}
//         </ErrorBoundary>
//       </main>

//       {/* Footer */}
//       <footer style={{
//         padding: '16px',
//         textAlign: 'center',
//         color: '#6b7280',
//         fontSize: '14px',
//         borderTop: '1px solid #e5e7eb'
//       }}>
//         <p>Sports Reels App © {new Date().getFullYear()}</p>
//       </footer>
//     </div>
//   );
// }


import { useState } from 'react';
import Reel from './components/Reel';
import axios from 'axios';
import ErrorBoundary from './components/ErrorBoundary';

interface ReelItem {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
  celebrity: string;
  likes: number;
  shares: number;
  comments: number;
}

function ApiErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ff6b6b',
      borderRadius: '4px',
      backgroundColor: '#fff5f5',
      textAlign: 'center',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#ff6b6b' }}>Failed to load reels</h3>
      <p style={{ color: '#ff6b6b', margin: '10px 0' }}>
        {error.message.includes('Failed to generate') 
          ? "Couldn't create a new reel. Please try again."
          : "We're having trouble loading content."}
      </p>
      <button 
        onClick={resetErrorBoundary}
        style={{
          padding: '8px 16px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  );
}

export default function Home() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [celebrity, setCelebrity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);

  const generateReel = async () => {
    if (!celebrity.trim()) {
      alert('Please enter a celebrity name');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Generate Script
      const scriptResponse = await axios.post('/api/generate-script', { celebrity });
      const script = scriptResponse.data.script;
      if (!script) throw new Error('No script generated');

      // 2. Generate Audio
      const audioResponse = await axios.post('/api/generate-audio', { 
        script,
        celebrity 
      });
      
      if (!audioResponse.data.audioUrl) {
        throw new Error('No audio URL returned');
      }

      // 3. Download Audio
      const audioDownload = await axios.get(audioResponse.data.audioUrl, { 
        responseType: 'arraybuffer'
      });
      const audioBuffer = new Uint8Array(audioDownload.data);

      // 4. Generate Video
      const videoResponse = await axios.post('/api/generate-video', {
        audioBuffer: Array.from(audioBuffer),
        celebrity,
        script
      });

      // 5. Add to Reels
      // setReels(prev => [
      //   ...videoResponse.data.reels.map((reel: ReelItem) => ({
      //     ...reel,
      //     likes: 0,
      //     shares: 0,
      //     comments: 0
      //   }))
      //   ,
      //   ...prev
      // ]);

      setReels(
        videoResponse.data.reels.map((reel: ReelItem) => ({
          ...reel,
          likes: 0,
          shares: 0,
          comments: 0
        }))
      );

    } catch (error: any) {
      throw new Error(`Failed to generate reel: ${error.message}`);
    } finally {
      setIsLoading(false);
      setCelebrity('');
    }
  };

  const toggleLike = (id: string) => {
    setLikedReels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(120deg, #f0f4ff 0%, #e0e7ff 100%)' }}>
      {/* Header Section */}
      <header style={{
        background: 'linear-gradient(90deg, #ff3b5c 0%, #3b82f6 100%)',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          Sports Celebrity Reels
        </h1>
        <p style={{ 
          fontSize: '16px',
          opacity: 0.9,
          margin: 0
        }}>
          Create amazing reels for your favorite sports celebrities
        </p>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '32px 8px 0 8px',
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        {/* Glassmorphism Input Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            padding: '32px 24px',
            marginBottom: '32px',
            width: '100%',
            maxWidth: 480,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid rgba(209,213,219,0.25)',
            position: 'relative',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '18px',
              // color: 'linear-gradient(90deg, #ff3b5c 0%, #3b82f6 100%)',
              color: '#ff3b5c',
              letterSpacing: '0.5px',
              textShadow: '0 2px 8px rgba(30,64,175,0.08)',
            }}
          >
            Generate a Sports Reel
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={celebrity}
              onChange={(e) => setCelebrity(e.target.value)}
              placeholder="Enter sports celebrity name"
              style={{
                flex: 1,
                padding: '14px 18px',
                border: '1.5px solid #c7d2fe',
                borderRadius: '10px',
                fontSize: '17px',
                outline: 'none',
                background: 'rgba(255,255,255,0.7)',
                boxShadow: '0 2px 8px rgba(30,64,175,0.04)',
                transition: 'border-color 0.2s',
                color: '#1e293b',
                width: '100%',
                marginBottom: '12px',
              }}
              onKeyDown={(e) => e.key === 'Enter' && generateReel()}
              disabled={isLoading}
            />
            <button
              onClick={generateReel}
              disabled={isLoading || !celebrity.trim()}
              style={{
                background: isLoading
                  ? 'linear-gradient(90deg,#a5b4fc,#93c5fd)'
                  : !celebrity.trim()
                  ? '#d1d5db'
                  : 'linear-gradient(90deg, #ff3b5c 0%, #3b82f6 100%)',
                color: isLoading || !celebrity.trim() ? '#6b7280' : 'white',
                padding: '14px 28px',
                border: 'none',
                borderRadius: '10px',
                cursor: isLoading || !celebrity.trim() ? 'not-allowed' : 'pointer',
                fontSize: '17px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(30,64,175,0.08)',
                transition: 'background 0.2s, color 0.2s',
                width: '100%',
              }}
            >
              {isLoading ? 'Creating...' : 'Create Reel'}
            </button>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: -24,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg,#2563eb 60%,#60a5fa 100%)',
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(30,64,175,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              animation: isLoading ? 'pulse 1.2s infinite' : undefined,
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              🎬
            </span>
            <style>
              {`@keyframes pulse {
                0% { box-shadow: #ff3b5c 0 0 0 0 rgba(96,165,250,0.7);}
                70% { box-shadow: 0 0 0 12px rgba(96,165,250,0);}
                100% { box-shadow: 0 0 0 0 rgba(96,165,250,0);}
              }`}
            </style>
          </div>
        </div>

        {/* Reels Section with Error Boundary */}
        <ErrorBoundary
  fallback={<ApiErrorFallback error={new Error('Failed to load reels')} resetErrorBoundary={() => setReels([])} />}
/>
          {reels.length > 0 ? (
            <Reel
              reels={reels}
              likedReels={likedReels}
              toggleLike={toggleLike}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          ) : (
            <div
              style={{
                textAlign: 'center',
                marginTop: '40px',
                color: '#6b7280',
                padding: '40px 20px',
                border: '1px dashed #d1d5db',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.7)',
                boxShadow: '0 2px 8px rgba(30,64,175,0.04)',
              }}
            >
              <p style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 600 }}>
                No reels available yet
              </p>
              <p style={{ fontSize: '15px', opacity: 0.8 }}>
                Enter a celebrity name and click "Create Reel" to get started
              </p>
            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '14px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p>Sports Reels App © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}