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
        if (request === 'clicked_element_text')
            sendResponse(getElementText(clicked.get()));
    }
);

/*  Finds the first element that matches type, propagating upward
 *  through parents. Considers the start element.
 */
function getOuterOfType(element, type) {
    if (element.parentElement === null)
        return null;
    return element.tagName === type
        ? element 
        : getOuterOfType(element.parentElement, type);
}

function getElementText(element, std) {
    if (element) {
        /*  In some cases a user can think he clicks a link while
         *  actually clicking an inner element. Find the parent 
         *  'A' if there is one.
         */
        var a = getOuterOfType(element, 'A');
        if (a !== null && a.textContent)
            return { 
                text: a.textContent, 
                type: 'A'
            };
        if (element.tagName === 'IMG') {
            if (element.title || element.alt) {
                return { 
                    text: element.title || element.alt, 
                    type: 'IMG'
                };
            }
            /*  Even if the image has no title or alt-text, we
             *  still want to share the direct link to it.
             */
            return {
                type: 'IMG'
            };
        }
    }
    /*  If neither a link or image is clicked, assume that the 
     *  whole page is requested.
     */
    return  { 
        text: document.title, 
        url: document.URL,
        type: 'DOCUMENT'
    };
}
