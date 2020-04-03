/* global JitsiMeetExternalAPI  */
import React, { useState, useEffect } from "react";
import "./VideoChat.css";

const isVideoEnabled = true;

let api;

function VideoChat({ user, room, isMenuOpen }) {
  const [loading, setLoading] = useState(true);

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const jitsiContainerStyle = {
    display: loading || isMenuOpen ? "none" : "block",
    width: "100%",
    height: "100%",
  };
  const roomId = room ? room.roomId : "virtualdojo-test-room-random";

  useEffect(() => {
    function startConference() {
      try {
        const domain = "meet.jit.si";
        const options = {
          roomName: roomId,
          parentNode: document.getElementById("jitsi-container"),
          interfaceConfigOverwrite: {
            filmStripOnly: false,
            SHOW_JITSI_WATERMARK: false,
          },
          configOverwrite: {
            disableSimulcast: false,
          },
          userInfo: {
            displayName: user.userName,
            email: user.userId,
          },
        };

        api = new JitsiMeetExternalAPI(domain, options);
        api.addEventListener("videoConferenceJoined", () => {
          setLoading(false);
        });
      } catch (error) {
        console.error("Failed to load Jitsi API", error);
      }
    }
    if (isVideoEnabled && roomId) {
      if (api) {
        api.dispose();
        api = undefined;
      }
      if (window.JitsiMeetExternalAPI) startConference();
      else alert("Jitsi Meet API script not loaded");
    } else {
      setLoading(false);
    }
  }, [roomId, user.isMentor, user.userId, user.userName]);

  return (
    <div style={containerStyle}>
      <div id="jitsi-container" style={jitsiContainerStyle} />
    </div>
  );
}

export default VideoChat;
