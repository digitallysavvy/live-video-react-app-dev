import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clsx from 'clsx'

import {
    LocalUser,
    RemoteUser,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteAudioTracks,
    useRemoteUsers,
  } from "agora-rtc-react";

// UI components to handle Mic & Camera buttons
import { SVGMicrophone, SVGMicrophoneMute, SVGCamera, SVGCameraMute } from "./icons";


export const LiveVideo = () => {

  const appId = '81190c52971d4004b7244bdcd93e2f34' // Agora Project App ID
  // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const { channelName } = useParams() //pull the channel name from the param

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // to leave the call
  const navigate = useNavigate()

  // Join the channel
  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token: null,
    },
    activeConnection,
  );

  // play the remote user audio tracks
  audioTracks.map((track) => track.play());

  return (
    <>
      <div>
        { 
          // Initialize each remote stream using RemoteUser component
          remoteUsers.map((user) => (
            <RemoteUser user={user} />    
          ))
        }
      </div>
      <div>
      <LocalUser
        audioTrack={localMicrophoneTrack}
        videoTrack={localCameraTrack}
        cameraOn={cameraOn}
        micOn={micOn}
        playAudio={micOn}
        playVideo={cameraOn}
        className=''
      />
      </div>
      <div>
        {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
        <div id="controlsToolbar">
          <div id="mediaControls">
            {setMic && (
              <button className="btn" onClick={() => setMic(a => !a)}>
                {micOn ? <SVGMicrophone /> : <SVGMicrophoneMute />}
              </button>
            )}
            {setCamera && (
              <button className="btn" onClick={() => setCamera(a => !a)}>
                {cameraOn ? <SVGCamera /> : <SVGCameraMute />}
              </button>
            )}
          </div>
        {
          <button id="endConnection"
            className={clsx("btn btn-phone", { "btn-phone-active": activeConnection })}
            onClick={() => {
              setActiveConnection(false)
              navigate('/')
            }}
          > Disconnect
          </button>
        }
      </div>
      </div>
    </>
  )
}