import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Video call error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="video-call-container">
          <div className="call-header">
            <h1 className="call-title">☕ Coffee Date Video Call</h1>
            <p className="call-subtitle">Something went wrong with the video call system</p>
            <div className="connection-status">
              <div className="status-badge">
                <span>❌</span>
                <span>Error occurred</span>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#DEB887',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                marginTop: '20px',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { useEventListener, useHuddle01 } from "@huddle01/react";
import { Audio, Video } from "@huddle01/react/components";
/* Uncomment to see the Xstate Inspector */
// import { Inspect } from '@huddle01/react/components';

import {
  useAudio,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo,
  useRecording,
} from "@huddle01/react/hooks";

import { useDisplayName } from "@huddle01/react/app-utils";
import Button from "../../component-d/Button";
import "./Home-d.css";

const Home2WithErrorBoundary = () => {
  const [isHuddleReady, setIsHuddleReady] = useState(false);
  const [initError, setInitError] = useState(null);

  React.useEffect(() => {
    // Test if Huddle01 hooks are available
    const testHuddleAvailability = () => {
      try {
        // Check if window and required globals exist
        if (typeof window === 'undefined') {
          throw new Error('Window not available');
        }

        // Simple delay to allow all modules to load
        const timer = setTimeout(() => {
          try {
            setIsHuddleReady(true);
          } catch (error) {
            console.error('Error setting ready state:', error);
            setInitError(error);
          }
        }, 2000); // Increased delay

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Huddle01 initialization failed:', error);
        setInitError(error);
      }
    };

    testHuddleAvailability();
  }, []);

  if (initError) {
    return (
      <div className="video-call-container">
        <div className="call-header">
          <h1 className="call-title">☕ Coffee Date Video Call</h1>
          <p className="call-subtitle">Video call system is currently unavailable</p>
          <div className="connection-status">
            <div className="status-badge">
              <span>❌</span>
              <span>System Error</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#DEB887',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isHuddleReady) {
    return (
      <div className="video-call-container">
        <div className="call-header">
          <h1 className="call-title">☕ Coffee Date Video Call</h1>
          <p className="call-subtitle">Initializing video call system...</p>
          <div className="connection-status">
            <div className="status-badge">
              <span>⏳</span>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Home2 />
    </ErrorBoundary>
  );
};

const Home2 = () => {
  // refs
  const videoRef = useRef();

  // Safe hook usage with error handling
  let state, send;
  try {
    const meetingMachine = useMeetingMachine();
    state = meetingMachine?.state;
    send = meetingMachine?.send;
  } catch (error) {
    console.error('Error initializing meeting machine:', error);
    state = null;
    send = () => {};
  }

  const [roomId, setRoomId] = useState("");
  const [displayNameText, setDisplayNameText] = useState("Guest");
  const [projectId, setProjectId] = useState("2hHNjpYUlb9boxKto2Rw4p0RdcsA0PVl");
  const [accessToken, setAccessToken] = useState("");
  
  // UI state
  const [expandedSections, setExpandedSections] = useState({
    connection: true,
    media: true,
    advanced: false,
    technical: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Safe hook usage with error handling
  let initialize, joinLobby, fetchAudioStream, produceAudio, stopAudioStream, stopProducingAudio, micStream;
  let fetchVideoStream, produceVideo, stopVideoStream, stopProducingVideo, camStream;
  let joinRoom, leaveRoom, peers, startRecording, stopRecording, error, recordingData, setDisplayName, displayNameError;

  try {
    ({ initialize } = useHuddle01());
    ({ joinLobby } = useLobby());
    ({
      fetchAudioStream,
      produceAudio,
      stopAudioStream,
      stopProducingAudio,
      stream: micStream,
    } = useAudio());
    ({
      fetchVideoStream,
      produceVideo,
      stopVideoStream,
      stopProducingVideo,
      stream: camStream,
    } = useVideo());
    ({ joinRoom, leaveRoom } = useRoom());
    ({ peers } = usePeers());
    ({
      startRecording,
      stopRecording,
      error,
      data: recordingData,
    } = useRecording());
    ({ setDisplayName, error: displayNameError } = useDisplayName());
  } catch (error) {
    console.error('Error initializing Huddle01 hooks:', error);
    // Set safe defaults
    initialize = { isCallable: false };
    joinLobby = { isCallable: false };
    fetchAudioStream = { isCallable: false };
    produceAudio = { isCallable: false };
    stopAudioStream = { isCallable: false };
    stopProducingAudio = { isCallable: false };
    micStream = null;
    fetchVideoStream = { isCallable: false };
    produceVideo = { isCallable: false };
    stopVideoStream = { isCallable: false };
    stopProducingVideo = { isCallable: false };
    camStream = null;
    joinRoom = { isCallable: false };
    leaveRoom = { isCallable: false };
    peers = {};
    startRecording = { isCallable: false };
    stopRecording = { isCallable: false };
    error = null;
    recordingData = null;
    setDisplayName = { isCallable: false };
    displayNameError = null;
  }

  // Event Listeners
  useEventListener("lobby:cam-on", () => {
    try {
      if (camStream && videoRef.current) videoRef.current.srcObject = camStream;
    } catch (error) {
      console.error('Error in lobby:cam-on:', error);
    }
  });

  useEventListener("room:joined", () => {
    try {
      console.log("room:joined");
      toast.success("🎉 Successfully joined the call!");
    } catch (error) {
      console.error('Error in room:joined:', error);
    }
  });
  useEventListener("lobby:joined", () => {
    try {
      console.log("lobby:joined");
      toast.success("✅ Joined lobby successfully!");
    } catch (error) {
      console.error('Error in lobby:joined:', error);
    }
  });
  useEventListener("room:left", () => {
    try {
      toast.info("👋 Left the call");
    } catch (error) {
      console.error('Error in room:left:', error);
    }
  });
  useEventListener("lobby:left", () => {
    try {
      toast.info("🚪 Left the lobby");
    } catch (error) {
      console.error('Error in lobby:left:', error);
    }
  });
  useEventListener("peer:joined", (data) => {
    try {
      toast.success(`👋 ${data?.displayName || 'Someone'} joined the call`);
    } catch (error) {
      console.error('Error in peer:joined:', error);
    }
  });
  useEventListener("peer:left", (data) => {
    try {
      toast.info(`👋 ${data?.displayName || 'Someone'} left the call`);
    } catch (error) {
      console.error('Error in peer:left:', error);
    }
  });

  // Auto-initialize with default project ID
  React.useEffect(() => {
    try {
      if (projectId && initialize?.isCallable) {
        initialize(projectId);
      }
    } catch (error) {
      console.error('Error during initialization:', error);
      toast.error('Failed to initialize video call system');
    }
  }, [projectId, initialize]);

  // Error handling with toasts
  React.useEffect(() => {
    if (error) {
      toast.error(`Recording Error: ${error}`);
    }
  }, [error]);

  React.useEffect(() => {
    if (displayNameError) {
      toast.error(`Display Name Error: ${displayNameError}`);
    }
  }, [displayNameError]);

  React.useEffect(() => {
    if (state?.context?.error) {
      toast.error(`Connection Error: ${JSON.stringify(state.context.error)}`);
    }
  }, [state?.context?.error]);

  // Helper functions for user-friendly display
  const getConnectionStatus = () => {
    if (!state || typeof state.matches !== 'function') {
      return { text: "Loading...", icon: "loading", color: "#95a5a6" };
    }
    
    try {
      if (state.matches("Initialized.JoinedLobby.Room.Joined")) {
        return { text: "In Call", icon: "in-call", color: "#e74c3c" };
      } else if (state.matches("Initialized.JoinedLobby")) {
        return { text: "In Lobby", icon: "lobby", color: "#f39c12" };
      } else if (state.matches("Initialized")) {
        return { text: "Ready to Connect", icon: "connected", color: "#2ecc71" };
      } else {
        return { text: "Offline", icon: "offline", color: "#95a5a6" };
      }
    } catch (error) {
      console.error("Error checking state:", error);
      return { text: "Error", icon: "error", color: "#e74c3c" };
    }
  };

  const getPeersCount = () => peers ? Object.keys(peers).length : 0;
  
  const isInLobby = (() => {
    try {
      return state && typeof state.matches === 'function' ? state.matches("Initialized.JoinedLobby") : false;
    } catch (error) {
      console.error("Error checking lobby state:", error);
      return false;
    }
  })();
  
  const isInRoom = (() => {
    try {
      return state && typeof state.matches === 'function' ? state.matches("Initialized.JoinedLobby.Room.Joined") : false;
    } catch (error) {
      console.error("Error checking room state:", error);
      return false;
    }
  })();
  const connectionStatus = getConnectionStatus();

  // Early return if state is not initialized properly
  if (!state || typeof state !== 'object') {
    return (
      <div className="video-call-container">
        <div className="call-header">
          <h1 className="call-title">☕ Coffee Date Video Call</h1>
          <p className="call-subtitle">Initializing video call system...</p>
          <div className="connection-status">
            <div className="status-badge">
              <span>⏳</span>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-call-container">
      {/* Header Section */}
      <div className="call-header">
        <h1 className="call-title">☕ Coffee Date Video Call</h1>
        <p className="call-subtitle">Connect with your coffee companion in a cozy virtual space</p>
        
        <div className="connection-status">
          <div className="status-badge">
            <div className={`status-icon ${connectionStatus.icon}`}></div>
            <span>{connectionStatus.text}</span>
          </div>
          
          {getPeersCount() > 0 && (
            <div className="status-badge">
              <span>👥</span>
              <span>{getPeersCount()} participant{getPeersCount() !== 1 ? 's' : ''}</span>
            </div>
          )}
          
          <div className="status-badge">
            <span>🆔</span>
            <span>Room: {roomId || 'vui-jket-utx'}</span>
          </div>
        </div>
      </div>

      <div className="video-call-layout">
        {/* Video Section */}
        <div className="video-section">
          <div className="main-video-container">
            <video className="main-video" ref={videoRef} autoPlay muted />
            {!camStream && (
              <div className="video-placeholder">
                <span className="video-placeholder-icon">📹</span>
                <p>Camera not active</p>
              </div>
            )}
            
            <div className="video-overlay">
              <button
                className={`video-control-btn ${camStream ? 'active' : ''}`}
                onClick={camStream ? stopVideoStream : fetchVideoStream}
                disabled={!fetchVideoStream.isCallable && !stopVideoStream.isCallable}
                title={camStream ? 'Stop Camera' : 'Start Camera'}
              >
                📹
              </button>
              
              <button
                className={`video-control-btn ${micStream ? 'active' : ''}`}
                onClick={micStream ? stopAudioStream : fetchAudioStream}
                disabled={!fetchAudioStream.isCallable && !stopAudioStream.isCallable}
                title={micStream ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                🎤
              </button>
              
              {isInRoom && (
                <button
                  className={`video-control-btn ${recordingData ? 'recording' : ''}`}
                  onClick={recordingData ? stopRecording : () => startRecording(`${window.location.href}rec/${roomId}`)}
                  disabled={!startRecording.isCallable && !stopRecording.isCallable}
                  title={recordingData ? 'Stop Recording' : 'Start Recording'}
                >
                  {recordingData ? '⏹️' : '🔴'}
                </button>
              )}
            </div>
          </div>

          {/* Participants Section */}
          {getPeersCount() > 0 && (
            <div className="participants-section">
              <h3 className="participants-header">
                <span>👥</span>
                Participants ({getPeersCount()})
              </h3>
              <div className="participants-grid">
                {peers && Object.values(peers)
                  .filter((peer) => peer?.cam)
                  .map((peer) => (
                    <div key={peer.peerId} className="participant-card">
                      <Video
                        className="participant-video"
                        peerId={peer.peerId}
                        track={peer.cam}
                      />
                      <div className="participant-info">
                        <div className="participant-name">
                          {peer.displayName || 'Anonymous'}
                        </div>
                        <div className="participant-status">
                          {peer.cam && '📹'} {peer.mic && '🎤'} {peer.role}
                        </div>
                      </div>
                    </div>
                  ))}
                
                {/* Audio streams */}
                {peers && Object.values(peers)
                  .filter((peer) => peer?.mic)
                  .map((peer) => (
                    <Audio
                      key={`audio-${peer.peerId}`}
                      peerId={peer.peerId}
                      track={peer.mic}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          {/* Connection Card */}
          <div className="control-card">
            <div className="card-header" onClick={() => toggleSection('connection')}>
              <h3 className="card-title">
                <span>
                  <span className="card-icon">🔗</span>
                  Connection
                </span>
                <span className={`chevron ${expandedSections.connection ? 'open' : ''}`}>▼</span>
              </h3>
            </div>
            {expandedSections.connection && (
              <div className="card-content">
                {!isInLobby ? (
                  <>
                    <div className="input-group">
                      <label className="input-label">Project ID</label>
                      <input
                        type="text"
                        className="modern-input"
                        placeholder="Enter project ID"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                      />
                    </div>
                    
                    <div className="button-group">
                      <button
                        className="btn btn-primary"
                        disabled={!initialize.isCallable}
                        onClick={() => initialize(projectId)}
                      >
                        <span className="btn-icon">🚀</span>
                        Initialize
                      </button>
                    </div>

                    {state && state.matches && state.matches("Initialized") && (
                      <>
                        <div className="input-group">
                          <label className="input-label">Display Name</label>
                          <input
                            type="text"
                            className="modern-input"
                            placeholder="Your name"
                            value={displayNameText}
                            onChange={(e) => setDisplayNameText(e.target.value)}
                          />
                        </div>
                        
                        <div className="input-group">
                          <label className="input-label">Room ID</label>
                          <input
                            type="text"
                            className="modern-input"
                            placeholder="Enter room ID or use default"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                          />
                        </div>
                        
                        <div className="input-group">
                          <label className="input-label">Access Token (Optional)</label>
                          <input
                            type="text"
                            className="modern-input"
                            placeholder="Optional access token"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                          />
                        </div>
                        
                        <div className="button-group">
                          <button
                            className="btn btn-success"
                            disabled={!joinLobby.isCallable}
                            onClick={() => {
                              const finalRoomId = roomId || 'vui-jket-utx';
                              if (accessToken) joinLobby(finalRoomId, accessToken);
                              else joinLobby(finalRoomId);
                              toast.info("🔄 Joining lobby...");
                            }}
                          >
                            <span className="btn-icon">🚪</span>
                            Join Lobby
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="button-group">
                    <button
                      className="btn btn-primary"
                      disabled={!setDisplayName.isCallable}
                      onClick={() => {
                        setDisplayName(displayNameText);
                        toast.success(`✅ Display name set to: ${displayNameText}`);
                      }}
                    >
                      <span className="btn-icon">👤</span>
                      Set Display Name
                    </button>
                    
                    {!isInRoom ? (
                      <button
                        className="btn btn-success"
                        disabled={!joinRoom.isCallable}
                        onClick={() => {
                          joinRoom();
                          toast.info("🔄 Joining call...");
                        }}
                      >
                        <span className="btn-icon">📞</span>
                        Join Call
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger"
                        disabled={!leaveRoom.isCallable}
                        onClick={leaveRoom}
                      >
                        <span className="btn-icon">📵</span>
                        Leave Call
                      </button>
                    )}
                    
                    <button
                      className="btn btn-secondary"
                      disabled={!isInLobby}
                      onClick={() => {
                        try {
                          if (send && typeof send === 'function') {
                            send("LEAVE_LOBBY");
                          }
                        } catch (error) {
                          console.error('Error leaving lobby:', error);
                          toast.error('Failed to leave lobby');
                        }
                      }}
                    >
                      <span className="btn-icon">🚪</span>
                      Leave Lobby
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Media Controls Card */}
          {isInLobby && (
            <div className="control-card">
              <div className="card-header" onClick={() => toggleSection('media')}>
                <h3 className="card-title">
                  <span>
                    <span className="card-icon">🎥</span>
                    Media Controls
                  </span>
                  <span className={`chevron ${expandedSections.media ? 'open' : ''}`}>▼</span>
                </h3>
              </div>
              {expandedSections.media && (
                <div className="card-content">
                  <div className="button-group">
                    <div className="button-row">
                      <button
                        className={`btn ${camStream ? 'btn-danger' : 'btn-primary'}`}
                        onClick={camStream ? stopVideoStream : fetchVideoStream}
                        disabled={!fetchVideoStream.isCallable && !stopVideoStream.isCallable}
                      >
                        <span className="btn-icon">📹</span>
                        {camStream ? 'Stop Camera' : 'Start Camera'}
                      </button>
                      
                      <button
                        className={`btn ${micStream ? 'btn-danger' : 'btn-primary'}`}
                        onClick={micStream ? stopAudioStream : fetchAudioStream}
                        disabled={!fetchAudioStream.isCallable && !stopAudioStream.isCallable}
                      >
                        <span className="btn-icon">🎤</span>
                        {micStream ? 'Mute Mic' : 'Unmute Mic'}
                      </button>
                    </div>
                    
                    {isInRoom && (
                      <div className="button-row">
                        <button
                          className={`btn ${state?.context?.camProducer ? 'btn-danger' : 'btn-success'}`}
                          onClick={state?.context?.camProducer ? stopProducingVideo : () => produceVideo(camStream)}
                          disabled={!produceVideo.isCallable && !stopProducingVideo.isCallable}
                        >
                          <span className="btn-icon">📺</span>
                          {state?.context?.camProducer ? 'Stop Sharing Video' : 'Share Video'}
                        </button>
                        
                        <button
                          className={`btn ${state?.context?.micProducer ? 'btn-danger' : 'btn-success'}`}
                          onClick={state?.context?.micProducer ? stopProducingAudio : () => produceAudio(micStream)}
                          disabled={!produceAudio.isCallable && !stopProducingAudio.isCallable}
                        >
                          <span className="btn-icon">🔊</span>
                          {state?.context?.micProducer ? 'Stop Sharing Audio' : 'Share Audio'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Information */}
          <div className="control-card">
            <div className="card-header" onClick={() => toggleSection('advanced')}>
              <h3 className="card-title">
                <span>
                  <span className="card-icon">ℹ️</span>
                  Status & Info
                </span>
                <span className={`chevron ${expandedSections.advanced ? 'open' : ''}`}>▼</span>
              </h3>
            </div>
            {expandedSections.advanced && (
              <div className="card-content">
                <div className="status-section">
                  <div className="status-item">
                    <span className="status-label">Connection Status:</span>
                    <span className="status-value">{connectionStatus.text}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">My ID:</span>
                    <span className="status-value">{state?.context?.peerId || 'Not connected'}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Display Name:</span>
                    <span className="status-value">{state?.context?.displayName || 'Not set'}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Room ID:</span>
                    <span className="status-value">{roomId || 'vui-jket-utx'}</span>
                  </div>
                  {recordingData && (
                    <div className="status-item">
                      <span className="status-label">Recording:</span>
                      <span className="status-value">Active</span>
                    </div>
                  )}
                </div>
                
              </div>
            )}
          </div>

          {/* Technical Details (Collapsible) */}
          <div className="control-card">
            <div className="card-header" onClick={() => toggleSection('technical')}>
              <h3 className="card-title">
                <span>
                  <span className="card-icon">🔧</span>
                  Technical Details
                </span>
                <span className={`chevron ${expandedSections.technical ? 'open' : ''}`}>▼</span>
              </h3>
            </div>
            {expandedSections.technical && (
              <div className="card-content">
                <details className="technical-details">
                  <summary>State Machine Value</summary>
                  <div className="debug-info">{JSON.stringify(state?.value || {}, null, 2)}</div>
                </details>
                
                <details className="technical-details">
                  <summary>Peers Data</summary>
                  <div className="debug-info">{JSON.stringify(peers || {}, null, 2)}</div>
                </details>
                
                <details className="technical-details">
                  <summary>Consumers</summary>
                  <div className="debug-info">{JSON.stringify(state?.context?.consumers || {}, null, 2)}</div>
                </details>
                
                {recordingData && (
                  <details className="technical-details">
                    <summary>Recording Data</summary>
                    <div className="debug-info">{JSON.stringify(recordingData, null, 2)}</div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home2WithErrorBoundary;
