/* global JitsiMeetExternalAPI  */
import React, { useState, useEffect } from "react";
import "./VideoChat.css";

const isVideoEnabled = false;

function VideoChat({ children }) {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(!isVideoEnabled);
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const jitsiContainerStyle = {
    display: loading ? "none" : "block",
    width: "100%",
    height: "100%",
  };

  function startConference() {
    try {
      const domain = "meet.jit.si";
      const options = {
        roomName: "virtualdojo-test-room",
        parentNode: document.getElementById("jitsi-container"),
        interfaceConfigOverwrite: {
          filmStripOnly: false,
          SHOW_JITSI_WATERMARK: false,
        },
        configOverwrite: {
          disableSimulcast: false,
        },
      };

      const api = new JitsiMeetExternalAPI(domain, options);
      api.addEventListener("videoConferenceJoined", () => {
        setLoading(false);
        setIsModalOpen(true);
        api.executeCommand("displayName", "MyName");
      });
      api.addEventListener("audioMuteStatusChanged", ({ muted }) => {
        if (muted) setIsModalOpen(true);
      });
    } catch (error) {
      console.error("Failed to load Jitsi API", error);
    }
  }

  useEffect(() => {
    if (isVideoEnabled) {
      // verify the JitsiMeetExternalAPI constructor is added to the global..
      if (window.JitsiMeetExternalAPI) startConference();
      else alert("Jitsi Meet API script not loaded");
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div style={containerStyle}>
      {loading && <div>{`Loading`}</div>}
      <div id="jitsi-container" style={jitsiContainerStyle} />
      {children && isModalOpen && (
        <div className="modal">
          <button onClick={() => setIsModalOpen(false)}>{`Close`}</button>
          {children}
        </div>
      )}
    </div>
  );
}

export default VideoChat;
