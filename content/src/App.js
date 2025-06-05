// /* global chrome */
// import { useEffect, useState } from "react";
// import Draggable from "react-draggable";

// const setToStorage = async (key, value) => {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.set({ [key]: value }, () => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve();
//       }
//     });
//   });
// };

// const getFromStorage = async (key) => {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get([key], (result) => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve(result[key]);
//       }
//     });
//   });
// };

// const App = () => {
//   console.log('app loaded')
//   const [showPanel, setShowPanel] = useState(false);
//   const injectBtn = () => {
//     const rightControl = document
//       .querySelector('#ytd-player')
//       ?.querySelector('.ytp-right-controls');

//     if (rightControl && !document.getElementById('GS_YT_CHAT_BTN')) {
//       rightControl.style.display = 'flex'
//       const btn = document.createElement('button');
//       btn.id = 'GS_YT_CHAT_BTN';

//       const iconUrl = chrome.runtime.getURL('icons/Icon.png'); // your extension icon
//       const img = document.createElement('img');
//       img.src = iconUrl;
//       img.alt = 'Chat Panel';

//       Object.assign(img.style, {
//         width: '22px',
//         height: '22px',
//         objectFit: 'contain',
//         display: 'block',
//       });

//       btn.appendChild(img);

//       Object.assign(btn.style, {
//         marginLeft: '10px',
//         padding: '4px',
//         backgroundColor: showPanel ? '#fff' : 'transparent',
//         border: showPanel ? '2px solid #FF0000' : '2px solid transparent',
//         borderRadius: '6px',
//         cursor: 'pointer',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       });

//       btn.addEventListener('click', () => {
//         console.log('sjkdhfjkhkl')

//         setShowPanel(!showPanel);

//         // Update styling immediately
//         btn.style.border = !showPanel ? '2px solid #FF0000' : '2px solid transparent';
//         btn.style.backgroundColor = !showPanel ? '#fff' : 'transparent';
//       });

//       rightControl.prepend(btn);
//     }
//   };



//   const removeBtn = () => {
//     const existing = document.getElementById('GS_YT_CHAT_BTN');
//     if (existing) {
//       existing.remove();
//     }
//   };
//   const waitForSelector = async () => {
//     return new Promise((resolve, reject) => {
//       let interval = setInterval(() => {
//         let player = document.querySelector('#ytd-player')?.querySelector('button.ytp-fullscreen-button.ytp-button')
//         if (player) {
//           clearInterval(interval)
//           resolve(true)
//         }
//       }, 100)
//     })
//   }
//   useEffect(() => {
//     const init = async () => {
//       const chatEnabled = await getFromStorage('YOUTUBE_LIVE_CHAT_STATUS');
//       if (!chatEnabled) return;
//       // If player is already fullscreen
//       const fullScreenPlayer = document.querySelector('#full-bleed-container')?.querySelector('#player-container');
//       console.log('fullScreenPlayer', fullScreenPlayer)
//       if (fullScreenPlayer) {
//         injectBtn();
//         return;
//       }
//       // Otherwise wait for fullscreen to happen
//       await waitForSelector()

//       const fullscreenBtn = document.querySelector('#ytd-player')?.querySelector('button.ytp-fullscreen-button.ytp-button');
//       console.log(fullscreenBtn, "fullscreenBtn")
//       if (fullscreenBtn) {
//         fullscreenBtn.addEventListener('click', () => {
//           console.log('jkdgkj')
//           setTimeout(() => {
//             const fullScreenPlayerNow = document.querySelector('#full-bleed-container')?.querySelector('#player-container');
//             if (fullScreenPlayerNow) {
//               injectBtn();
//             } else {
//               removeBtn();
//               setShowPanel(false);
//             }
//           }, 500);
//         });
//       }
//     };

//     init();
//   }, []);

//   if (!showPanel) return null;

//   return (
//     <>
//       <Draggable>

//         <div
//           style={{
//             position: 'fixed',
//             top: '100px',
//             left: '100px',
//             width: '300px',
//             height: '400px',
//             backgroundColor: '#fff',
//             border: '2px solid #ccc',
//             borderRadius: '8px',
//             padding: '16px',
//             zIndex: 9999,
//             boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
//           }}
//         >
//           <div>
//             {
//               document.querySelector('iframe#chatframe') ? document.querySelector('iframe#chatframe') : <p>no chat available</p>
//             }
//           </div>
//         </div>
//       </Draggable>

//       // place btn here 
//     </>



//   );
// };

// export default App;


/* global chrome */
import { useEffect, useState } from "react";
import Draggable from "react-draggable";

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

const App = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [btnInjected, setBtnInjected] = useState(false);
  const [chatIframe, setChatIframe] = useState(null);

  const injectBtn = () => {
    const rightControl = document
      .querySelector('#ytd-player')
      ?.querySelector('.ytp-right-controls');

    if (rightControl && !document.getElementById('GS_YT_CHAT_BTN')) {
      rightControl.style.display = 'flex';
      rightControl.style.alignItems = 'center';
      const btn = document.createElement('button');
      btn.id = 'GS_YT_CHAT_BTN';

      const iconUrl = chrome.runtime.getURL('icons/Icon.png'); // your extension icon

      Object.assign(btn.style, {
        margin: '0px 10px',
        position:'relative',
        height:'30px',
        width:'30px',
        backgroundColor:'#ffffff',
        border: showPanel ? '2px solid #FF0000' : '2px solid transparent',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundImage: `url(${iconUrl})`,
        backgroundSize:'cover'
      });

      btn.addEventListener('click', () => {
        rightControl.style.display = 'flex';
        rightControl.style.alignItems = 'center';
        setShowPanel((prev) => {
          // Update button styles immediately
          if (!prev) {
            btn.style.border = '2px solid #FF0000';
            btn.style.backgroundColor = '#fff';
          } else {
            btn.style.border = '2px solid transparent';
            btn.style.backgroundColor = 'transparent';
          }
          return !prev;
        });
      });

      rightControl.prepend(btn);
      setBtnInjected(true);
    }
  };

  const removeBtn = () => {
    const existing = document.getElementById('GS_YT_CHAT_BTN');
    if (existing) {
      existing.remove();
      setBtnInjected(false);
    }
  };

  const waitForSelector = () => {
    return new Promise((resolve) => {
      let interval = setInterval(() => {
        const player = document.querySelector('#ytd-player')?.querySelector('button.ytp-fullscreen-button.ytp-button');
        if (player) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  };

  useEffect(() => {
    const init = async () => {
      const chatEnabled = await getFromStorage('YOUTUBE_LIVE_CHAT_STATUS');
      if (!chatEnabled) return;

      // If player is already fullscreen
      const fullScreenPlayer = document.querySelector('#full-bleed-container')?.querySelector('#player-container');
      if (fullScreenPlayer) {
        injectBtn();
      } else {
        await waitForSelector();
        const fullscreenBtn = document.querySelector('#ytd-player')?.querySelector('button.ytp-fullscreen-button.ytp-button');
        if (fullscreenBtn) {
          fullscreenBtn.addEventListener('click', () => {
            setTimeout(() => {
              const fullScreenPlayerNow = document.querySelector('#content')?.querySelector('ytd-watch-flexy')?.hasAttribute('fullscreen')
              if (fullScreenPlayerNow) {
                injectBtn();
              } else {
                removeBtn();
                setShowPanel(false);
              }
            }, 500);
          });
        }
      }
    };

    init();
  }, []);

  // When panel is shown, find iframe#chatframe and store it
  useEffect(() => {
    if (showPanel) {
      const iframe = document.querySelector('iframe#chatframe');
      if (iframe) {
        let iframeUrl=iframe.contentWindow.location.href
        const myIframe= document.createElement('iframe')
        myIframe.src=iframeUrl
        setChatIframe(myIframe);
      }
    }
  }, [showPanel]);

  // Move iframe into container div inside React panel
  useEffect(() => {
    if (chatIframe) {
      const container = document.getElementById('GS_CHAT_IFRAME_CONTAINER');
      if (container && !container.contains(chatIframe)) {
        container.appendChild(chatIframe);
        // Optionally style iframe to fill container
        chatIframe.style.width = '100%';
        chatIframe.style.height = '100%';
        chatIframe.style.border = 'none';
      }
    }
  }, [chatIframe]);

  if (!showPanel) return null;

  return (
    <Draggable>
      <div
        style={{
          position: 'fixed',
          top: '100px',
          left: '100px',
          width: '320px',
          height: '420px',
          backgroundColor: '#fff',
          border: '2px solid #ccc',
          borderRadius: '8px',
          padding: '8px',
          zIndex: 9999,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0' }}>Live Chat Panel</h3>
        <div
          id="GS_CHAT_IFRAME_CONTAINER"
          style={{
            flexGrow: 1,
            overflow: 'hidden',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
          }}
        >
          {/* iframe#chatframe will be moved here dynamically */}
          {!chatIframe && <p style={{ padding: '10px' }}>No chat available</p>}
        </div>
      </div>
    </Draggable>
  );
};

export default App;
