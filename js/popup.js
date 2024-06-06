// Open the desired page in a new tab
chrome.tabs.create({ url: "../html/index.html" }, function() {
    // Close the popup window after opening the new tab
    window.close();
});
