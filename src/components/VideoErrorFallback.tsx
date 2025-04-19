export default function VideoErrorFallback({ resetError }: { resetError: () => void }) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#dc3545' }}>Video Failed to Load</h3>
        <p style={{ margin: '10px 0' }}>
          We couldn't load this reel. Please try again.
        </p>
        <button
          onClick={resetError}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }