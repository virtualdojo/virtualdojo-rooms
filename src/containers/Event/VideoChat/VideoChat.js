/* global JitsiMeetExternalAPI  */
import React, { useEffect, useContext } from "react";

import { store } from "../../../store.js";
import "./VideoChat.css";

const isVideoEnabled = process.env.NODE_ENV === "production" ? true : false;

let api;

function VideoChat({ isMenuOpen }) {
  const { currentUser, event, isDragging } = useContext(store);
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const jitsiContainerStyle = {
    display: "block",
    width: "100%",
    height: "100%",
    pointerEvents: isMenuOpen && isDragging ? "none" : "auto",
  };
  const roomId = currentUser.room
    ? currentUser.room.roomId
    : event.defaultRoomId;

  useEffect(() => {
    function startConference() {
      try {
        const domain = event.jitsiServer;
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
            displayName: currentUser.userName,
            email: currentUser.userId,
          },
        };

        api = new JitsiMeetExternalAPI(domain, options);
        api.addEventListener("videoConferenceJoined", () => {
          api.executeCommand("displayName", currentUser.userName);
          api.executeCommand("email", currentUser.userId);
          // some server needs to grant you moderator status
          setTimeout(
            () => api.executeCommand("password", event.password),
            2000
          );
        });

        api.addEventListener("passwordRequired", () => {
          api.executeCommand("password", event.password);
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
    }
  }, [
    currentUser.userId,
    currentUser.userName,
    event.password,
    event.jitsiServer,
    roomId,
  ]);

  return (
    <div style={containerStyle}>
      <div id="jitsi-container" style={jitsiContainerStyle} />
    </div>
  );
}

export default VideoChat;
