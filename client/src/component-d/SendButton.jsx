import React from "react";
import Button from "./Button";

/**
 * SendButton - Generic button component for WebRTC actions
 * Replaced Huddle dependency with standard button implementation
 */
const SendButton = ({ event, disabled, onClick }) => {
  return (
    <div>
      <Button 
        disabled={disabled} 
        onClick={onClick || (() => console.log(`Event: ${event}`))}
      >
        {event}
      </Button>
    </div>
  );
};

export default SendButton;
