console.log('background script loaded')

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

function notify(msg) {
    let logo = chrome.runtime.getURL('./icons/Icon.png')
    chrome.notifications.create({
        type: "basic",
        iconUrl: logo,
        title: "youtube live chat view",
        message: msg,
    });
}

chrome.runtime.onInstalled.addListener(async function (details) {
    if (details.reason === "install") {
        notify("Use this extension to easily adjust audio settings with just once click")
    }
    await setToStorage('YOUTUBE_LIVE_CHAT_STATUS', true)

});