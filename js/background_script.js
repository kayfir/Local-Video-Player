// background_script.js

// Add an event listener to handle clicks on the extension icon
chrome.browserAction.onClicked.addListener(function(tab) {
    // Open a new tab with the specified URL
    chrome.tabs.create({ url: "html/index.html" });
});
