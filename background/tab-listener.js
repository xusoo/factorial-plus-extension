chrome.tabs.onUpdated.addListener((tabId, change) => {
    if (change.url && change.url.includes('factorialhr.com')) {
        chrome.tabs.sendMessage(tabId, 'tab-updated');
    }
});