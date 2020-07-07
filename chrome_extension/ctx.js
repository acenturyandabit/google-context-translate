(() => {
    function guid(count = 6) {//we don't want to be polluting the scope now do we?
        let pool = "1234567890qwertyuiopasdfghjklzxcvbnm";
        tguid = "";
        for (i = 0; i < count; i++) tguid += pool[Math.floor(Math.random() * pool.length)];
        return tguid;
    }
    let styleAdded = false;

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.instantCallback) {
                //Encapsulate the selection and respond with a UUID
                let selected = document.getSelection();
                selected = selected.getRangeAt(0);
                let newspan = document.createElement("span");
                newspan.id = "GCTXT__" + guid();
                selected.surroundContents(newspan);
                sendResponse({ guid: newspan.id });
            } else if (request.success) {
                let originalSelection = document.getElementById(request.guid);
                let popupbox = document.createElement("div");
                popupbox.innerHTML = request.success;
                popupbox.style.position = "absolute";
                originalSelection.classList.add("GCTXT__popup");

                originalSelection.style.position = "relative";
                originalSelection.appendChild(popupbox);
                popupbox.style.bottom = "100%";
                popupbox.style.width = "max-content";
                let clr = popupbox.getClientRects();
                popupbox.style.left = `calc(50% - ${clr[0].width / 2}px)`;
                popupbox.style.border = "1px solid black";
                popupbox.style.background = "white";
                popupbox.animate([
                    { // from
                        opacity: 1,
                    },
                    { opacity: 1, offset: 0.7 },
                    { // to
                        opacity: 0,
                    }
                ], 2000);
                if (!styleAdded) {
                    styleAdded = true;
                    let s = document.createElement("style");
                    s.innerHTML = `
                    .GCTXT__popup{
                        background: yellow;
                    }
                    .GCTXT__popup>div{
                        opacity:0;
                    }
                    .GCTXT__popup:hover>div{
                        opacity: 1;
                    }`;
                    document.body.appendChild(s);
                }
            } else if (request.alert) {
                if (confirm(request.alert)) {
                    let a = document.createElement("a");
                    a.href = "https://translate.google.com";
                    a.target = "_blank";
                    a.click();
                    //refocus me
                    sendResponse({"refocus":true});
                }
            }
        }
    );
})();
