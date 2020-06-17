chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.toTranslate) {
            document.querySelector("textarea#source").value = request.toTranslate;
            setTimeout(() => {
                chrome.runtime.sendMessage({ success: document.querySelector(".translation").innerText, pageURL: request.pageURL });
            }, 3000);
        }
    }
);
