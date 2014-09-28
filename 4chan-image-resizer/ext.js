function find(iterable, callback) {
    for (var i = 0; i < iterable.length; i++) {
        if (callback(iterable[i])) return iterable[i];
    }

    return undefined;
}

function filter(iterable, callback) {
    var out = [];

    for (var i = 0; i < iterable.length; i++) {
        if (callback(iterable[i])) out.push(iterable[i]);
    }

    return out;
}

function expandedImages() {
    function isExpanded(e) {
        return find(e.classList, function(c) { 
            return c == "expanded-thumb"; 
        }) !== undefined;
    }

    return filter(document.getElementsByTagName('img'), isExpanded);
}

function forEach(iterable, callback) {
    for (var i = 0; i < iterable.length; i++) {
        callback(iterable[i]);
    }
}

var applyDragResize = (function() {
    var elements = [];

    return function(element) {
        if (!find(elements, function(e) { return e === element; })) {
            dragResize(element);
            elements.push(element);
        }
    };
}());

var dragResize = function(element) {
    var height = 0, width = 0,
        mouseStart = {},
        active = false, moved = false;
    element.onclick = steal(element.onclick, stop);
    element.onmouseup = steal(element.onmouseup, stop);
    element.onmousedown = start;
    element.onmouseout  = stop;
    element.onblur = stop;
    element.onmousemove = step;
    function start(event) {
        height = element.offsetHeight,
        width = element.offsetWidth; 
        element.style.removeProperty('max-width');
        element.style.removeProperty('max-height');
        mouseStart.x = event.clientX;
        mouseStart.y = event.clientY;
        active = true; moved = false;
    }
    function steal(handler) {
        var rest = Array.prototype.slice.call(arguments).slice(1);
        return function(event) {
            if (!moved) {
                if (typeof(handler) === 'function') { 
                    handler(event); 
                }
            } else { 
                event.preventDefault(); event.stopPropagation(); 
            }
            forEach(rest, function(r) { 
                if (typeof(r) === 'function') r(event);
            });
        }
    }
    function stop() { active = false; }
    function step(event) {
        if (!active) return; 
        event.preventDefault(); 
        var dMouseX = event.clientX - mouseStart.x,
            dMouseY = event.clientY - mouseStart.y;
        if (dMouseX !== 0 || dMouseY !== 0) moved = true;
        var resizeFactor = Math.max(dMouseX / width, dMouseY / height);
        element.style.width = width + resizeFactor * width + 'px';
        element.style.height = height + resizeFactor * height + 'px';
    }
};

setInterval(function() {
    forEach(expandedImages(), applyDragResize);
}, 500);
