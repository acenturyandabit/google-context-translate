chrome.runtime.onInstalled.addListener(function () {
    // When the app gets installed, set up the context menus

    chrome.contextMenus.create({
        title: 'Google translate this selection',
        id: "Google translate this selection",
        documentUrlPatterns: ["*://*/*"],
        contexts: ['selection']
    });
    function ctxResolve(data, pageurl) {
        chrome.tabs.query({ url: pageurl.split("#")[0] }, function (tabs) { // split at hash because of inline highlights
            chrome.tabs.sendMessage(tabs[0].id, data);
        });
    }

    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
        if (sender.tab && sender.tab.url.includes("https://translate.google.com")) {
            ctxResolve(req, req.pageURL);
        }
    })

    chrome.contextMenus.onClicked.addListener(async function (itemData) {
        if (itemData.menuItemId == "Google translate this selection") {
            if (itemData.selectionText) {
                chrome.tabs.query({ url: "https://translate.google.com/" }, function (tabs) { // split at hash because of inline highlights
                    chrome.tabs.sendMessage(tabs[0].id, { "toTranslate": itemData.selectionText, pageURL: itemData.pageUrl });
                });
            }
        }
    });
});

