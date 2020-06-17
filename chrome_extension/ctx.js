chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.msg) {
            let popupbox = document.createElement("div");
            popupbox.innerHTML = request.msg;
            popupbox.style.position = "absolute";
            let selected = document.getSelection();
            selected = selected.getRangeAt(0);
            let newspan = document.createElement("span");
            selected.surroundContents(newspan);
            let clr = newspan.getClientRects();
            document.body.appendChild(popupbox);
            popupbox.style.left = (clr[0].x + clr[0].width / 2 - popupbox.scrollWidth / 2) + "px";
            popupbox.style.top = (clr[0].y - popupbox.scrollHeight) + "px";
            popupbox.style.opacity = 0;
            popupbox.style.background = 'red';
            popupbox.style.color = 'white';
            popupbox.animate([
                { // from
                    opacity: 1,
                },
                { opacity: 1, offset: 0.7 },
                { // to
                    opacity: 0,
                }
            ], 2000);
        } else if (request.success) {
            if (request.aurl) {
                let replacer = Array.from(document.querySelectorAll(`a`));
                replacer.filter(i => i.href == request.aurl).forEach(i => {
                    let q = document.createElement("span");
                    q.innerHTML = request.success;
                    q.style.border = "1px solid black";
                    i.replaceWith(q);
                })
            } else {
                let selected = document.getSelection();
                selected = selected.getRangeAt(0);
                let newspan = document.createElement("span");
                selected.surroundContents(newspan);
                newspan.innerHTML = request.success;
                newspan.style.border = "1px solid black";
            }

        }
    }
);
