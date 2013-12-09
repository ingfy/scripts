var clicked = (function() {
    var store = null;

    document.addEventListener('mousedown', function(evt) {
        if (evt.button === 2) {
            store = evt.target;
        }
    });

    function get() {
        return store;
    }

    return { 
        get: get 
    };
}());

chrome .runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request === "clicked_element_text")
            sendResponse({text: getElementText(clicked.get())});
    }
);

function getElementText(element, std) {
    if (!element) return null;
    if (element.tagName === "A" && element.textContent) 
        return element.textContent;
    if (element.tagName === "IMG" && element.alt) 
        return element.alt;
    return null;
}
