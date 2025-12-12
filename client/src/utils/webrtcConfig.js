/**
 * WebRTC Configuration for Coffee Dates Video Calling
 * 
 * ICE Servers:
 * - STUN: Discovers public IP addresses (Server Reflexive Candidates)
 * - TURN: Relay server fallback for restrictive firewalls (Relay Candidates)
 */

// Free public STUN/TURN servers (for production, use your own)
export const iceServers = {
  iceServers: [
    // Google's public STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    
    // Free TURN server (metered.ca - consider getting your own for production)
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
  iceCandidatePoolSize: 10,
};

// Media constraints for getUserMedia
export const mediaConstraints = {
  video: {
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 30 },
    facingMode: 'user' // Front camera
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

// Offer options for creating SDP offers
export const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};
