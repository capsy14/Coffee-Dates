import React, { useRef, useState } from "react";

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

const Home2 = ({ paid }) => {
  // refs
  const videoRef = useRef();

  const { state, send } = useMeetingMachine();

  const [roomId, setRoomId] = useState("");
  const [displayNameText, setDisplayNameText] = useState("Guest");
  const [projectId, setProjectId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const { initialize } = useHuddle01();
  const { joinLobby } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const { joinRoom, leaveRoom } = useRoom();

  // Event Listner
  useEventListener("lobby:cam-on", () => {
    if (camStream && videoRef.current) videoRef.current.srcObject = camStream;
  });

  const { peers } = usePeers();

  const {
    startRecording,
    stopRecording,
    error,
    data: recordingData,
  } = useRecording();

  const { setDisplayName, error: displayNameError } = useDisplayName();

  useEventListener("room:joined", () => {
    console.log("room:joined");
  });
  useEventListener("lobby:joined", () => {
    console.log("lobby:joined");
  });

  return (
    <div>
      {paid ? (
        <>
          <div className="video"></div>
          <h1 className="pls-pay">Please pay to access this content.</h1>
        </>
      ) : (
        <>
          <div className="room">
            <h3>Your Project id: 2hHNjpYUlb9boxKto2Rw4p0RdcsA0PVl </h3>
            <h3>Your Room id: vui-jket-utx </h3>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <table>
                <tr>
                  <th colspan="2" className="text-2xl">
                    Room State
                  </th>
                </tr>
                <tr>
                  <td colspan="2" className="break-words">
                    {JSON.stringify(state.value)}
                  </td>
                </tr>
                <tr>
                  <th className="text-2xl">Me Id</th>
                  <td className="break-words">
                    {JSON.stringify(state.context.peerId)}
                  </td>
                </tr>
                <tr>
                  <th className="text-2xl">DisplayName</th>
                  <td className="break-words">
                    {JSON.stringify(state.context.displayName)}
                  </td>
                </tr>
                <tr>
                  <th colspan="2" className="text-2xl">
                    Recording Data
                  </th>
                </tr>
                <tr>
                  <td colspan="2" className="break-words">
                    {JSON.stringify(recordingData)}
                  </td>
                </tr>
                <tr>
                  <th colspan="2" className="text-2xl">
                    Error
                  </th>
                </tr>
                <tr>
                  <td colspan="2" className="break-words text-red-500">
                    {JSON.stringify(state.context.error)}
                  </td>
                </tr>
                <tr>
                  <th colspan="2" className="text-2xl">
                    Peers
                  </th>
                </tr>
                <tr>
                  <td colspan="2" className="break-words">
                    {JSON.stringify(peers)}
                  </td>
                </tr>
                <tr>
                  <th colspan="2" className="text-2xl">
                    Consumers
                  </th>
                </tr>
                <tr>
                  <td colspan="2" className="break-words">
                    {JSON.stringify(state.context.consumers)}
                  </td>
                </tr>
              </table>

              <h2 className="text-3xl text-blue-500 font-extrabold">Idle</h2>
              <input
                type="text"
                placeholder="Your Project Id"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="border-2 border-gray-300 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mr-2"
              />
              <Button
                disabled={!initialize.isCallable}
                onClick={() => {
                  initialize(projectId);
                }}
              >
                INIT
              </Button>

              <br />
              <br />
              <h2 className="text-3xl text-red-500 font-extrabold">
                Initialized
              </h2>
              <input
                type="text"
                placeholder="Your Room Id"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="border-2 border-gray-300 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mr-2"
              />
              <input
                type="text"
                placeholder="Your Access Token (optional)"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="border-2 border-gray-300 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mr-2"
              />
              <Button
                disabled={!joinLobby.isCallable}
                onClick={() => {
                  if (accessToken) joinLobby(roomId, accessToken);
                  else joinLobby(roomId);
                }}
              >
                JOIN_LOBBY
              </Button>
              <br />
              <br />
              <h2 className="text-3xl text-yellow-500 font-extrabold">Lobby</h2>
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Your Room Id"
                  value={displayNameText}
                  onChange={(e) => setDisplayNameText(e.target.value)}
                  className="border-2 border-gray-300 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mr-2"
                />
                <Button
                  disabled={!setDisplayName.isCallable}
                  onClick={() => {
                    setDisplayName(displayNameText);
                  }}
                >
                  {`SET_DISPLAY_NAME error: ${displayNameError}`}
                </Button>
                <Button
                  disabled={!fetchVideoStream.isCallable}
                  onClick={fetchVideoStream}
                >
                  FETCH_VIDEO_STREAM
                </Button>

                <Button
                  disabled={!fetchAudioStream.isCallable}
                  onClick={fetchAudioStream}
                >
                  FETCH_AUDIO_STREAM
                </Button>

                <Button disabled={!joinRoom.isCallable} onClick={joinRoom}>
                  JOIN_ROOM
                </Button>

                <Button
                  disabled={!state.matches("Initialized.JoinedLobby")}
                  onClick={() => send("LEAVE_LOBBY")}
                >
                  LEAVE_LOBBY
                </Button>

                <Button
                  disabled={!stopVideoStream.isCallable}
                  onClick={stopVideoStream}
                >
                  STOP_VIDEO_STREAM
                </Button>
                <Button
                  disabled={!stopAudioStream.isCallable}
                  onClick={stopAudioStream}
                >
                  STOP_AUDIO_STREAM
                </Button>
              </div>
              <br />
              <h2 className="text-3xl text-green-600 font-extrabold">Room</h2>
              <div className="flex gap-4 flex-wrap">
                <Button
                  disabled={!produceAudio.isCallable}
                  onClick={() => produceAudio(micStream)}
                >
                  PRODUCE_MIC
                </Button>

                <Button
                  disabled={!produceVideo.isCallable}
                  onClick={() => produceVideo(camStream)}
                >
                  PRODUCE_CAM
                </Button>

                <Button
                  disabled={!stopProducingAudio.isCallable}
                  onClick={() => stopProducingAudio()}
                >
                  STOP_PRODUCING_MIC
                </Button>

                <Button
                  disabled={!stopProducingVideo.isCallable}
                  onClick={() => stopProducingVideo()}
                >
                  STOP_PRODUCING_CAM
                </Button>

                <Button
                  disabled={!startRecording.isCallable}
                  onClick={() =>
                    startRecording(`${window.location.href}rec/${roomId}`)
                  }
                >
                  {`START_RECORDING error: ${error}`}
                </Button>
                <Button
                  disabled={!stopRecording.isCallable}
                  onClick={stopRecording}
                >
                  STOP_RECORDING
                </Button>

                <Button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
                  LEAVE_ROOM
                </Button>
              </div>

              {/* Uncomment to see the Xstate Inspector */}
              {/* <Inspect /> */}
            </div>
            <div className="video-stream">
              <video
                className="video-stream"
                ref={videoRef}
                autoPlay
                muted
              ></video>
              <div className="grid grid-cols-4">
                {Object.values(peers)
                  .filter((peer) => peer.cam)
                  .map((peer) => (
                    <>
                      role: {peer.role}
                      <Video
                        key={peer.peerId}
                        peerId={peer.peerId}
                        track={peer.cam}
                        debug
                      />
                    </>
                  ))}
                {Object.values(peers)
                  .filter((peer) => peer.mic)
                  .map((peer) => (
                    <Audio
                      key={peer.peerId}
                      peerId={peer.peerId}
                      track={peer.mic}
                    />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home2;
