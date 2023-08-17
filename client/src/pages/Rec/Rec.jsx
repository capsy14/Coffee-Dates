import React, { useEffect, useState } from "react";

import { Audio, Video } from "@huddle01/react/components";

import { usePeers } from "@huddle01/react/hooks";
import { useRecorder } from "@huddle01/react/app-utils";
import { useParams } from "react-router-dom";

const Rec = () => {
  const params = useParams();

  const [roomId, setRoomId] = useState(params.roomId?.toString() || "");

  const { peers } = usePeers();

  useEffect(() => {
    setRoomId(params.roomId?.toString() || "");
  }, [params.roomId?.toString()]);

  useRecorder(roomId, "");

  return (
    <div className="grid grid-cols-2">
      <div>
        Peers:
        <div className="grid grid-cols-4">
          {Object.values(peers)
            .filter((peer) => peer.cam)
            .map((peer) => (
              <Video
                key={peer.peerId}
                peerId={peer.peerId}
                track={peer.cam}
                // debug
              />
            ))}
          {Object.values(peers)
            .filter((peer) => peer.mic)
            .map((peer) => (
              <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Rec;
