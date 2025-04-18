
// import { useRef, useEffect, useState } from 'react';
// import ErrorBoundary from './ErrorBoundary';
// import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiHeart, FiMessageCircle, FiShare2, FiMaximize } from 'react-icons/fi';
// import { FaHeart } from 'react-icons/fa';

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

// interface ReelProps {
//   reels: ReelItem[];
//   likedReels: Record<string, boolean>;
//   toggleLike: (id: string) => void;
//   isMuted: boolean;
//   setIsMuted: (muted: boolean) => void;
// }

// function VideoPlayer({
//   reel,
//   isMuted,
//   setIsMuted,
//   toggleLike,
//   likedReels,
//   isActive,
//   onEnded,
// }: {
//   reel: ReelItem;
//   isMuted: boolean;
//   setIsMuted: (muted: boolean) => void;
//   toggleLike: (id: string) => void;
//   likedReels: Record<string, boolean>;
//   isActive: boolean;
//   onEnded: () => void;
// }) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [showControls, setShowControls] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [likeAnim, setLikeAnim] = useState(false);

//   const togglePlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play().catch(error => {
//           throw new Error(`Video playback failed: ${error.message}`);
//         });
//       }
//     }
//   };

//   const toggleFullscreen = () => {
//     if (containerRef.current) {
//       if (!document.fullscreenElement) {
//         containerRef.current.requestFullscreen()
//           .then(() => setIsFullscreen(true))
//           .catch(console.error);
//       } else {
//         document.exitFullscreen()
//           .then(() => setIsFullscreen(false))
//           .catch(console.error);
//       }
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!videoRef.current) return;
//       switch (e.code) {
//         case 'Space':
//           e.preventDefault();
//           togglePlay();
//           break;
//         case 'KeyM':
//           setIsMuted(!isMuted);
//           break;
//         case 'KeyF':
//           toggleFullscreen();
//           break;
//       }
//     };
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [isMuted]);

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };
//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
//   }, []);

//   // Like animation
//   useEffect(() => {
//     if (likeAnim) {
//       const t = setTimeout(() => setLikeAnim(false), 500);
//       return () => clearTimeout(t);
//     }
//   }, [likeAnim]);

//   // Auto play/pause based on isActive
//   useEffect(() => {
//     if (videoRef.current) {
//       if (isActive) {
//         videoRef.current.currentTime = 0;
//         videoRef.current.play().catch(() => {});
//       } else {
//         videoRef.current.pause();
//       }
//     }
//   }, [isActive]);

//   // Unmute for active video
//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.muted = isMuted ? true : false;
//     }
//   }, [isMuted, isActive]);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         position: 'relative',
//         background: 'linear-gradient(135deg, #181818 0%, #232526 100%)',
//         borderRadius: '24px',
//         overflow: 'hidden',
//         cursor: 'pointer',
//         width: 360,
//         height: 640,
//         margin: '0 auto',
//         boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
//         transition: 'transform 0.5s, opacity 0.5s',
//         transform: isActive ? 'scale(1.03) translateY(-8px)' : 'scale(0.95) translateY(40px)',
//         opacity: isActive ? 1 : 0,
//         zIndex: isActive ? 2 : 1,
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-end',
//         pointerEvents: isActive ? 'auto' : 'none',
//       }}
//       onMouseEnter={() => setShowControls(true)}
//       onMouseLeave={() => setShowControls(false)}
//     >
//       <video
//         ref={videoRef}
//         src={reel.videoUrl}
//         muted={isMuted}
//         onPlay={() => setIsPlaying(true)}
//         onPause={() => setIsPlaying(false)}
//         onWaiting={() => setIsLoading(true)}
//         onPlaying={() => setIsLoading(false)}
//         onTimeUpdate={(e) => {
//           const video = e.target as HTMLVideoElement;
//           setProgress((video.currentTime / video.duration) * 100 || 0);
//         }}
//         onEnded={onEnded}
//         onError={() => {
//           throw new Error('Failed to load video');
//         }}
//         style={{
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           display: 'block',
//           filter: isPlaying ? 'brightness(1)' : 'brightness(0.7)',
//           transition: 'filter 0.3s'
//         }}
//         onClick={togglePlay}
//         autoPlay={isActive}
//         playsInline
//       />

//       {/* Animated Gradient Overlay */}
//       <div style={{
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         width: '100%',
//         height: '60%',
//         background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 80%, transparent 100%)',
//         pointerEvents: 'none',
//         opacity: 0.9,
//         zIndex: 2,
//         transition: 'opacity 0.5s'
//       }} />

//       {/* Info Panel (bottom left) */}
//       <div style={{
//         position: 'absolute',
//         bottom: 60,
//         left: 20,
//         zIndex: 4,
//         color: '#fff',
//         textAlign: 'left',
//         maxWidth: 200,
//         pointerEvents: 'none',
//         userSelect: 'none'
//       }}>
//         <h3 style={{
//           fontSize: '1.2rem',
//           fontWeight: 700,
//           margin: '0 0 6px 0',
//           textShadow: '0 2px 8px rgba(0,0,0,0.5)'
//         }}>{reel.title}</h3>
//         <p style={{
//           fontSize: '0.95rem',
//           margin: '0 0 6px 0',
//           color: '#e0e0e0',
//           textShadow: '0 2px 8px rgba(0,0,0,0.4)'
//         }}>{reel.description}</p>
//         <span style={{
//           fontSize: '0.95rem',
//           color: '#ff3b5c',
//           fontWeight: 600
//         }}>{reel.celebrity}</span>
//       </div>

//       {/* Action Buttons (vertical, right) */}
//       <div style={{
//         position: 'absolute',
//         bottom: 80,
//         right: 16,
//         zIndex: 5,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 18,
//         alignItems: 'center'
//       }}>
//         <button
//           onClick={() => {
//             toggleLike(reel.id);
//             setLikeAnim(true);
//           }}
//           style={{
//             background: likedReels[reel.id] ? '#ff3b5c' : 'rgba(30,30,30,0.7)',
//             border: 'none',
//             borderRadius: '50%',
//             padding: 12,
//             color: '#fff',
//             cursor: 'pointer',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             fontSize: '0.95rem',
//             transform: likeAnim ? 'scale(1.3)' : 'scale(1)',
//             transition: 'background 0.2s, transform 0.2s'
//           }}>
//           {likedReels[reel.id] ? <FaHeart size={28} color="#fff" /> : <FiHeart size={28} />}
//           <span style={{ fontSize: 13, marginTop: 2 }}>{reel.likes + (likedReels[reel.id] ? 1 : 0)}</span>
//         </button>
//         <button style={{
//           background: 'rgba(30,30,30,0.7)',
//           border: 'none',
//           borderRadius: '50%',
//           padding: 12,
//           color: '#fff',
//           cursor: 'pointer',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           fontSize: '0.95rem',
//           transition: 'background 0.2s, transform 0.2s'
//         }}>
//           <FiMessageCircle size={28} />
//           <span style={{ fontSize: 13, marginTop: 2 }}>{reel.comments}</span>
//         </button>
//         <button style={{
//           background: 'rgba(30,30,30,0.7)',
//           border: 'none',
//           borderRadius: '50%',
//           padding: 12,
//           color: '#fff',
//           cursor: 'pointer',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           fontSize: '0.95rem',
//           transition: 'background 0.2s, transform 0.2s'
//         }}>
//           <FiShare2 size={28} />
//           <span style={{ fontSize: 13, marginTop: 2 }}>{reel.shares}</span>
//         </button>
//         <button
//           onClick={() => setIsMuted(!isMuted)}
//           style={{
//             background: 'rgba(30,30,30,0.7)',
//             border: 'none',
//             borderRadius: '50%',
//             padding: 12,
//             color: '#fff',
//             cursor: 'pointer',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             fontSize: '0.95rem',
//             transition: 'background 0.2s, transform 0.2s'
//           }}>
//           {isMuted ? <FiVolumeX size={28} /> : <FiVolume2 size={28} />}
//         </button>
//         <button
//           onClick={togglePlay}
//           style={{
//             background: 'rgba(30,30,30,0.7)',
//             border: 'none',
//             borderRadius: '50%',
//             padding: 12,
//             color: '#fff',
//             cursor: 'pointer',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             fontSize: '0.95rem',
//             transition: 'background 0.2s, transform 0.2s'
//           }}>
//           {isPlaying ? <FiPause size={28} /> : <FiPlay size={28} />}
//         </button>
//         <button
//           onClick={toggleFullscreen}
//           style={{
//             background: 'rgba(30,30,30,0.7)',
//             border: 'none',
//             borderRadius: '50%',
//             padding: 10,
//             color: '#fff',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '1.2rem',
//             transition: 'background 0.2s, transform 0.2s'
//           }}>
//           <FiMaximize size={22} />
//         </button>
//       </div>

//       {/* Progress Bar (very bottom, full width) */}
//       <div
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: '6px',
//           backgroundColor: 'rgba(255,255,255,0.15)',
//           zIndex: 10,
//           cursor: 'pointer'
//         }}
//         onClick={(e) => {
//           if (videoRef.current) {
//             const rect = e.currentTarget.getBoundingClientRect();
//             const pos = (e.clientX - rect.left) / rect.width;
//             videoRef.current.currentTime = pos * videoRef.current.duration;
//           }
//         }}
//       >
//         <div
//           style={{
//             width: `${progress}%`,
//             height: '100%',
//             background: 'linear-gradient(90deg, #ff3b5c 0%, #3b82f6 100%)',
//             borderRadius: 3,
//             transition: 'width 0.2s'
//           }}
//         />
//       </div>

//       {/* Loading Spinner */}
//       {isLoading && (
//         <div style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           zIndex: 20
//         }}>
//           <div style={{
//             width: '40px',
//             height: '40px',
//             border: '4px solid rgba(255,255,255,0.3)',
//             borderRadius: '50%',
//             borderTopColor: '#fff',
//             animation: 'spin 1s ease-in-out infinite'
//           }} />
//           <style>
//             {`@keyframes spin { 0% { transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}
//           </style>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function Reel({ reels, likedReels, toggleLike, isMuted, setIsMuted }: ReelProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [activeIdx, setActiveIdx] = useState(0);

//   // Intersection Observer to detect which reel is in view
//   useEffect(() => {
//     const nodes = containerRef.current?.querySelectorAll('.reel-item');
//     if (!nodes) return;
//     const observer = new window.IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting && entry.intersectionRatio > 0.85) {
//             const idx = Number((entry.target as HTMLElement).dataset.idx);
//             setActiveIdx(idx);
//           }
//         });
//       },
//       { threshold: [0.85] }
//     );
//     nodes.forEach(node => observer.observe(node));
//     return () => observer.disconnect();
//   }, [reels.length]);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         height: '100vh',
//         overflowY: 'scroll',
//         scrollSnapType: 'y mandatory',
//         background: 'linear-gradient(135deg, #181818 0%, #232526 100%)',
//       }}
//     >
//       {reels.map((reel, idx) => (
//         <div
//           key={reel.id}
//           className="reel-item"
//           data-idx={idx}
//           style={{
//             height: '100vh',
//             scrollSnapAlign: 'start',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//         >
//           <ErrorBoundary
//             fallback={<div style={{ color: 'red' }}>Video Error</div>}
//           >
//             <VideoPlayer
//               reel={reel}
//               isMuted={isMuted}
//               setIsMuted={setIsMuted}
//               toggleLike={toggleLike}
//               likedReels={likedReels}
//               isActive={idx === activeIdx}
//               onEnded={() => {
//                 if (idx < reels.length - 1) setActiveIdx(idx + 1);
//               }}
//             />
//           </ErrorBoundary>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useRef, useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiHeart, FiMessageCircle, FiShare2, FiMaximize } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

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

interface ReelProps {
  reels: ReelItem[];
  likedReels: Record<string, boolean>;
  toggleLike: (id: string) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

function VideoPlayer({
  reel,
  isMuted,
  setIsMuted,
  toggleLike,
  likedReels,
  isActive,
  onEnded,
}: {
  reel: ReelItem;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  toggleLike: (id: string) => void;
  likedReels: Record<string, boolean>;
  isActive: boolean;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          throw new Error(`Video playback failed: ${error.message}`);
        });
      }
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(console.error);
      } else {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(console.error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          setIsMuted(!isMuted);
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMuted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Like animation
  useEffect(() => {
    if (likeAnim) {
      const t = setTimeout(() => setLikeAnim(false), 500);
      return () => clearTimeout(t);
    }
  }, [likeAnim]);

  // Auto play/pause based on isActive
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  // Unmute for active video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted ? true : false;
    }
  }, [isMuted, isActive]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #181818 0%, #232526 100%)',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        width: 360,
        height: 640,
        margin: '0 auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'transform 0.5s, opacity 0.5s',
        transform: isActive ? 'scale(1.03) translateY(-8px)' : 'scale(0.95) translateY(40px)',
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 2 : 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onTimeUpdate={(e) => {
          const video = e.target as HTMLVideoElement;
          setProgress((video.currentTime / video.duration) * 100 || 0);
        }}
        onEnded={onEnded}
        onError={() => {
          throw new Error('Failed to load video');
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: isPlaying ? 'brightness(1)' : 'brightness(0.7)',
          transition: 'filter 0.3s'
        }}
        onClick={togglePlay}
        autoPlay={isActive}
        playsInline
      />

      {/* Animated Gradient Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60%',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 80%, transparent 100%)',
        pointerEvents: 'none',
        opacity: 0.9,
        zIndex: 2,
        transition: 'opacity 0.5s'
      }} />

      {/* Info Panel (bottom left) */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 20,
        zIndex: 4,
        color: '#fff',
        textAlign: 'left',
        maxWidth: 200,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          margin: '0 0 6px 0',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)'
        }}>{reel.title}</h3>
        <p style={{
          fontSize: '0.95rem',
          margin: '0 0 6px 0',
          color: '#e0e0e0',
          textShadow: '0 2px 8px rgba(0,0,0,0.4)'
        }}>{reel.description}</p>
        <span style={{
          fontSize: '0.95rem',
          color: '#ff3b5c',
          fontWeight: 600
        }}>{reel.celebrity}</span>
      </div>

      {/* Action Buttons (vertical, right) */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        right: 16,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        alignItems: 'center'
      }}>
        <button
          onClick={() => {
            toggleLike(reel.id);
            setLikeAnim(true);
          }}
          style={{
            background: likedReels[reel.id] ? '#ff3b5c' : 'rgba(30,30,30,0.7)',
            border: 'none',
            borderRadius: '50%',
            padding: 12,
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.95rem',
            transform: likeAnim ? 'scale(1.3)' : 'scale(1)',
            transition: 'background 0.2s, transform 0.2s'
          }}>
          {likedReels[reel.id] ? <FaHeart size={28} color="#fff" /> : <FiHeart size={28} />}
          <span style={{ fontSize: 13, marginTop: 2 }}>{reel.likes + (likedReels[reel.id] ? 1 : 0)}</span>
        </button>
        <button style={{
          background: 'rgba(30,30,30,0.7)',
          border: 'none',
          borderRadius: '50%',
          padding: 12,
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '0.95rem',
          transition: 'background 0.2s, transform 0.2s'
        }}>
          <FiMessageCircle size={28} />
          <span style={{ fontSize: 13, marginTop: 2 }}>{reel.comments}</span>
        </button>
        <button style={{
          background: 'rgba(30,30,30,0.7)',
          border: 'none',
          borderRadius: '50%',
          padding: 12,
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '0.95rem',
          transition: 'background 0.2s, transform 0.2s'
        }}>
          <FiShare2 size={28} />
          <span style={{ fontSize: 13, marginTop: 2 }}>{reel.shares}</span>
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            background: 'rgba(30,30,30,0.7)',
            border: 'none',
            borderRadius: '50%',
            padding: 12,
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.95rem',
            transition: 'background 0.2s, transform 0.2s'
          }}>
          {isMuted ? <FiVolumeX size={28} /> : <FiVolume2 size={28} />}
        </button>
        <button
          onClick={togglePlay}
          style={{
            background: 'rgba(30,30,30,0.7)',
            border: 'none',
            borderRadius: '50%',
            padding: 12,
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.95rem',
            transition: 'background 0.2s, transform 0.2s'
          }}>
          {isPlaying ? <FiPause size={28} /> : <FiPlay size={28} />}
        </button>
        <button
          onClick={toggleFullscreen}
          style={{
            background: 'rgba(30,30,30,0.7)',
            border: 'none',
            borderRadius: '50%',
            padding: 10,
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'background 0.2s, transform 0.2s'
          }}>
          <FiMaximize size={22} />
        </button>
      </div>

      {/* Progress Bar (very bottom, full width) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          zIndex: 10,
          cursor: 'pointer'
        }}
        onClick={(e) => {
          if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * videoRef.current.duration;
          }
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ff3b5c 0%, #3b82f6 100%)',
            borderRadius: 3,
            transition: 'width 0.2s'
          }}
        />
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 20
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            borderTopColor: '#fff',
            animation: 'spin 1s ease-in-out infinite'
          }} />
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}
          </style>
        </div>
      )}
    </div>
  );
}

export default function Reel({ reels, likedReels, toggleLike, isMuted, setIsMuted }: ReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Intersection Observer to detect which reel is in view
  useEffect(() => {
    const nodes = containerRef.current?.querySelectorAll('.reel-item');
    if (!nodes) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.85) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            setActiveIdx(idx);
          }
        });
      },
      { threshold: [0.85] }
    );
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [reels.length]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        background: 'linear-gradient(135deg, #181818 0%, #232526 100%)',
      }}
    >
      {reels.map((reel, idx) => (
        <div
          key={reel.id}
          className="reel-item"
          data-idx={idx}
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ErrorBoundary
            fallback={<div style={{ color: 'red' }}>Video Error</div>}
          >
            <VideoPlayer
              reel={reel}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              toggleLike={toggleLike}
              likedReels={likedReels}
              isActive={idx === activeIdx}
              onEnded={() => {
                if (idx < reels.length - 1) setActiveIdx(idx + 1);
              }}
            />
          </ErrorBoundary>
        </div>
      ))}
    </div>
  );
}