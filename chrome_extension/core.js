//Set up the context menus

chrome.contextMenus.create({
    title: 'Google translate this selection',
    id: "Google translate this selection",
    documentUrlPatterns: ["*://*/*"],
    contexts: ['selection']
});
async function ctxResolve(data, pageurl) {
    return new Promise(resolve => {
        chrome.tabs.query({ url: pageurl.split("#")[0] }, function (tabs) { // split at hash because of inline highlights
            chrome.tabs.sendMessage(tabs[0].id, data, (response) => { resolve(response) });
        });
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
            let aguid = await ctxResolve({ instantCallback: true }, itemData.pageUrl);
            aguid = aguid.guid;
            chrome.tabs.query({ url: "https://translate.google.com/" }, async function (tabs) { // split at hash because of inline highlights
                if (!tabs.length) {
                    let needsRefocus = await ctxResolve({ alert: "Google translate isn't open in another tab. Do it now?" }, itemData.pageUrl);
                    if (needsRefocus) {
                        chrome.tabs.query({ url: itemData.pageUrl.split("#")[0] }, function (tabs) {
                            var updateProperties = { 'active': true };
                            chrome.tabs.update(tabs[0].id, updateProperties);
                        })
                    };
                } else chrome.tabs.sendMessage(tabs[0].id, { "toTranslate": itemData.selectionText, pageURL: itemData.pageUrl, guid: aguid });
            });
        }
    }
});
