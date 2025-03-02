chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed or updated.");
    injectContentScriptIntoAllTabs();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
        }, () => {
            console.log("Injected content.js into:", tab.url);
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message in background.js:", request);

    if (request.action === "debug_content_script") {
        sendResponse({ success: true });
        return true;
    }
});

function injectContentScriptIntoAllTabs() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.url && tab.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"]
                }, () => {
                    console.log("Injected content.js into:", tab.url);
                });
            }
        });
    });
}
