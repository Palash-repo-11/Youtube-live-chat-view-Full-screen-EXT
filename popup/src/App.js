/* global chrome */
import { useEffect, useState } from "react";
import "./App.css";

const setToStorage = async (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

const getFromStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
};

function App() {
  const [chatStatus, setChatStatus] = useState(false);

  const initialLoad = async () => {
    const status = await getFromStorage("YOUTUBE_LIVE_CHAT_STATUS");
    setChatStatus(!!status); // fallback to false if undefined
  };

  const toggleChatStatus = async () => {
    const newStatus = !chatStatus;
    setChatStatus(newStatus);
    await setToStorage("YOUTUBE_LIVE_CHAT_STATUS", newStatus);
  };

  useEffect(() => {
    initialLoad();
  }, []);

  return (
    <div className="popup-container" style={{ padding: "16px", width: "300px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <img src="icon48.png" alt="Extension Icon" width="32" height="32" style={{ marginRight: "10px" }} />
        <h2 style={{ margin: 0 }}>Live Chat Toggle</h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Enable YouTube Live Chat</span>
        <label className="switch">
          <input type="checkbox" checked={chatStatus} onChange={toggleChatStatus} />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
}

export default App;
