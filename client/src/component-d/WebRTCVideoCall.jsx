import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { iceServers, mediaConstraints, offerOptions } from '../utils/webrtcConfig';
import './WebRTCVideoCall.css';

// Use production URL if in production, localhost for development
const SOCKET_SERVER = process.env.NODE_ENV === 'production' 
  ? 'https://coffee-dates.onrender.com' 
  : 'http://localhost:5000';

const WebRTCVideoCall = ({ currentUserId, recipientUserId, recipientName = 'User' }) => {
  // Refs for video elements and WebRTC connection
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  
  // State management
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [incomingCall, setIncomingCall] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER, {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Connected to signaling server');
      socketRef.current.emit('userConnected', currentUserId);
    });

    // Listen for incoming call offers
    socketRef.current.on('video-call:offer', handleReceiveOffer);
    
    // Listen for call answers
    socketRef.current.on('video-call:answer', handleReceiveAnswer);
    
    // Listen for ICE candidates
    socketRef.current.on('video-call:ice-candidate', handleReceiveIceCandidate);
    
    // Listen for call end
    socketRef.current.on('video-call:end', handleCallEnd);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUserId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, []);

  /**
   * Step 1: Initialize local media stream (getUserMedia)
   */
  const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      console.log('📹 Local media stream initialized');
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Cannot access camera/microphone. Please check permissions.');
      throw error;
    }
  };

  /**
   * Step 2: Create RTCPeerConnection with ICE servers
   */
  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(iceServers);
    
    // Add local stream tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log('➕ Adding local track to peer connection:', track.kind);
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }
    
    // Handle incoming remote stream
    peerConnection.ontrack = (event) => {
      console.log('🎥 Received remote track!', event.track.kind);
      console.log('Streams in event:', event.streams.length);
      
      if (event.streams && event.streams[0]) {
        console.log('📺 Setting remote video srcObject');
        const remoteStream = event.streams[0];
        console.log('Remote stream tracks:', remoteStream.getTracks().length);
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          // Force play (some browsers require this)
          remoteVideoRef.current.play().catch(e => console.log('Auto-play prevented:', e));
          console.log('✅ Remote video srcObject set successfully');
        } else {
          console.error('❌ remoteVideoRef.current is null!');
        }
      } else {
        console.error('❌ No streams in track event!');
      }
    };
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 New ICE candidate:', event.candidate.type);
        socketRef.current.emit('video-call:ice-candidate', {
          receiverId: recipientUserId,
          senderId: currentUserId,
          candidate: event.candidate,
        });
      } else {
        console.log('🧊 All ICE candidates sent');
      }
    };
    
    // Monitor connection state
    peerConnection.onconnectionstatechange = () => {
      console.log('🔗 Connection state:', peerConnection.connectionState);
      setConnectionState(peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'connected') {
        console.log('✅ WebRTC connection established!');
        toast.success('✅ Connected to call');
        setIsConnecting(false);
        setIsCallActive(true);
      } else if (peerConnection.connectionState === 'disconnected' || 
                 peerConnection.connectionState === 'failed') {
        console.log('❌ Connection failed or disconnected');
        toast.error('Call disconnected');
        cleanupCall();
      }
    };
    
    // Monitor ICE connection state
    peerConnection.oniceconnectionstatechange = () => {
      console.log('🧊 ICE connection state:', peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === 'failed') {
        console.error('❌ ICE connection failed - possible firewall/NAT issue');
      }
    };
    
    // Monitor signaling state
    peerConnection.onsignalingstatechange = () => {
      console.log('📡 Signaling state:', peerConnection.signalingState);
    };
    
    peerConnectionRef.current = peerConnection;
    return peerConnection;
  };

  /**
   * Step 3: Start call as CALLER (create offer)
   */
  const startCall = async () => {
    try {
      setIsConnecting(true);
      setIsCaller(true);
      
      // Initialize local stream
      await initializeLocalStream();
      
      // Create peer connection
      const peerConnection = createPeerConnection();
      
      // Create SDP offer
      const offer = await peerConnection.createOffer(offerOptions);
      await peerConnection.setLocalDescription(offer);
      
      console.log('📤 Sending offer to recipient');
      
      // Send offer through signaling server
      socketRef.current.emit('video-call:offer', {
        receiverId: recipientUserId,
        senderId: currentUserId,
        offer: offer,
      });
      
      toast.info(`☕ Calling ${recipientName}...`);
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
      setIsConnecting(false);
      cleanupCall();
    }
  };

  /**
   * Step 4: Handle incoming offer as CALLEE
   */
  const handleReceiveOffer = async ({ offer, senderId }) => {
    console.log('📥 Received call offer from:', senderId);
    console.log('Offer details:', offer);
    
    // Show incoming call notification
    setIncomingCall({ senderId, offer });
    toast.info(`📞 Incoming call from ${recipientName}`, {
      autoClose: false,
      closeButton: false,
    });
  };

  /**
   * Step 5: Accept call and create answer
   */
  const acceptCall = async () => {
    try {
      console.log('🎯 Starting to accept call...');
      setIsConnecting(true);
      setIsCaller(false);
      
      if (!incomingCall) {
        console.error('❌ No incoming call to accept');
        return;
      }
      
      const { offer, senderId } = incomingCall;
      console.log('📞 Accepting call from:', senderId);
      
      // Initialize local stream
      console.log('🎥 Initializing local stream...');
      await initializeLocalStream();
      
      // Create peer connection
      console.log('🔗 Creating peer connection...');
      const peerConnection = createPeerConnection();
      
      // Set remote description from offer
      console.log('📝 Setting remote description from offer...');
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('✅ Remote description set');
      
      // Create SDP answer
      console.log('💬 Creating answer...');
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log('✅ Local description set');
      
      console.log('📤 Sending answer to caller:', senderId);
      
      // Send answer through signaling server
      socketRef.current.emit('video-call:answer', {
        receiverId: senderId,
        senderId: currentUserId,
        answer: answer,
      });
      
      setIncomingCall(null);
      toast.success('Call accepted');
      console.log('✅ Call acceptance process complete');
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
      setIsConnecting(false);
      cleanupCall();
    }
  };

  /**
   * Step 6: Handle received answer (as caller)
   */
  const handleReceiveAnswer = async ({ answer, senderId }) => {
    try {
      console.log('📥 Received answer from callee:', senderId);
      console.log('Answer details:', answer);
      console.log('Current peer connection state:', peerConnectionRef.current?.connectionState);
      
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        console.log('✅ Remote description set successfully');
        console.log('✅ Remote description set');
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  /**
   * Step 7: Handle ICE candidates exchange
   */
  const handleReceiveIceCandidate = async ({ candidate, senderId }) => {
    try {
      console.log('📥 Received ICE candidate');
      
      if (peerConnectionRef.current && candidate) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  /**
   * Reject incoming call
   */
  const rejectCall = () => {
    if (incomingCall) {
      socketRef.current.emit('video-call:end', {
        receiverId: incomingCall.senderId,
        senderId: currentUserId,
      });
      setIncomingCall(null);
      toast.info('Call rejected');
    }
  };

  /**
   * End active call
   */
  const endCall = () => {
    socketRef.current.emit('video-call:end', {
      receiverId: recipientUserId,
      senderId: currentUserId,
    });
    
    cleanupCall();
    toast.info('Call ended');
  };

  /**
   * Handle call ended by remote peer
   */
  const handleCallEnd = ({ senderId }) => {
    console.log('📴 Call ended by remote peer');
    toast.info('Call ended');
    cleanupCall();
  };

  /**
   * Toggle video on/off
   */
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  /**
   * Toggle audio on/off
   */
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  /**
   * Cleanup function
   */
  const cleanupCall = () => {
    // Stop all media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setIsCallActive(false);
    setIsConnecting(false);
    setConnectionState('disconnected');
    setIncomingCall(null);
  };

  return (
    <div className="webrtc-video-call">
      <div className="video-call-header">
        <h2>☕ Coffee Date Video Call</h2>
        <div className="connection-status">
          <span className={`status-indicator ${connectionState}`}></span>
          <span className="status-text">
            {connectionState === 'connected' ? '🟢 Connected' :
             connectionState === 'connecting' ? '🟡 Connecting...' :
             isConnecting ? '🟡 Initializing...' : '⚪ Disconnected'}
          </span>
        </div>
      </div>

      <div className="video-container">
        <div className="video-wrapper">
          <div className="video-box remote-video">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline
              muted={false}
              className="video-element"
              style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
              onLoadedMetadata={() => console.log('✅ Remote video metadata loaded')}
              onPlay={() => console.log('▶️ Remote video playing')}
              onCanPlay={() => console.log('✅ Remote video can play')}
            />
            <div className="video-label">
              {isCallActive ? recipientName : 'Waiting for connection...'}
            </div>
          </div>

          <div className="video-box local-video">
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted
              className="video-element"
              style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
              onLoadedMetadata={() => console.log('✅ Local video metadata loaded')}
            />
            <div className="video-label">You</div>
          </div>
        </div>
      </div>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="incoming-call-modal">
          <div className="modal-content">
            <h3>📞 Incoming Call</h3>
            <p>{recipientName} is calling...</p>
            <div className="modal-buttons">
              <button onClick={acceptCall} className="btn-accept">
                ✅ Accept
              </button>
              <button onClick={rejectCall} className="btn-reject">
                ❌ Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="call-controls">
        {!isCallActive && !isConnecting && !incomingCall && (
          <button onClick={startCall} className="btn-start-call">
            📞 Start Video Call
          </button>
        )}

        {(isCallActive || isConnecting) && (
          <>
            <button 
              onClick={toggleVideo} 
              className={`btn-control ${!isVideoEnabled ? 'disabled' : ''}`}
            >
              {isVideoEnabled ? '📹' : '📹❌'} Video
            </button>
            
            <button 
              onClick={toggleAudio} 
              className={`btn-control ${!isAudioEnabled ? 'disabled' : ''}`}
            >
              {isAudioEnabled ? '🎤' : '🎤❌'} Audio
            </button>
            
            <button onClick={endCall} className="btn-end-call">
              📴 End Call
            </button>
          </>
        )}
      </div>

      {/* Debug Info */}
      <div className="debug-info">
        <p><strong>Your ID:</strong> {currentUserId}</p>
        <p><strong>Calling:</strong> {recipientUserId}</p>
        <p><strong>Role:</strong> {isCaller ? 'Caller' : 'Callee'}</p>
        <p><strong>State:</strong> {connectionState}</p>
      </div>
    </div>
  );
};

export default WebRTCVideoCall;
