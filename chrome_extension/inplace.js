chrome.runtime.onMessage.addListener(
    function (request) {
        let pretext = undefined;
        if (request.toTranslate) {
            pretext = document.querySelector(".translation");
            if (pretext) pretext = pretext.innerText;
            document.querySelector("textarea#source").value = request.toTranslate;
            function checkTranslationDone() {
                let newtext = document.querySelector(".translation");
                if (newtext && newtext.innerText != pretext && !newtext.innerText.includes("...")) { // ellipsis means translating
                    let translationFull = document.querySelector(".translation").innerText;
                    if (document.querySelector(".tlid-transliteration-content.transliteration-content.full")) {
                        translationFull = document.querySelector(".tlid-transliteration-content.transliteration-content.full").innerText + "::" + translationFull;
                    }
                    chrome.runtime.sendMessage({ success: translationFull, pageURL: request.pageURL, guid: request.guid });
                } else {
                    setTimeout(checkTranslationDone, 200);
                }
            }
            setTimeout(checkTranslationDone, 200);
        }
    }
);
