import React, { useEffect, useRef } from "react";
import "./Video.css";

/**
 * Video component for rendering remote peer video in WebRTC
 * This component displays a single video stream from a remote peer
 */
const Video = ({ peerId, stream, displayName = "User" }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && stream) {
      videoElement.srcObject = stream;
      
      videoElement.onloadedmetadata = async () => {
        console.log(`✅ Video metadata loaded for peer: ${peerId}`);
        try {
          await videoElement.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      };

      videoElement.onerror = (error) => {
        console.error("Video element error:", error);
      };
    }

    // Cleanup
    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [stream, peerId]);

  return (
    <div className="video-peer-container">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline
        className="peer-video-element"
      />
      <div className="peer-video-label">
        <span className="peer-name">{displayName}</span>
        <span className="peer-id">ID: {peerId?.slice(0, 8)}...</span>
      </div>
    </div>
  );
};

export default Video;
