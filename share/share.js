// Build mailto: link
function constructEmailUrl(target, title, text) {
	return "mailto:" + encodeURIComponent(target) + "?" + 
        "subject=" + encodeURIComponent(title) + 
        "&body=" + encodeURIComponent(text);
}

function shareClick(info, tab, recipient) {
    var link = info.linkUrl || info.srcUrl;
    var customMessage = window.localStorage.message;
	var address = recipient || "";

    requestClickedElementText(tab, link, 
        function(title, link) {
        var text = (customMessage || "Check this out!") + 
            " " + link;
        var url = constructEmailUrl(address, title, text);
	    chrome.tabs.create({ url: url });
    });
}

function requestClickedElementText(tab, link, callback) {
    chrome.tabs.sendMessage(tab.id, 
        "clicked_element_text", function(response) {
        var defaultText = window.localStorage.title || 
            "I'm sharing a link with you!";
        var text = defaultText;
        if (response != null && response.type == 'DOCUMENT') {
            link = response.url;
        }
        callback((response ? response.text : "") || defaultText,
            link);
    });
}


function setupContextMenus() {
    // Get recipients
    var recipients = window.localStorage.recipients;
    var contexts = ["all"];

    // Remove old entries
    chrome.contextMenus.removeAll(function() {
        if (recipients === undefined 
            || recipients.length === undefined 
            || recipients.length === 0) {
            // If no recipients are configured, add simple menu 
            // item
            chrome.contextMenus.create({
        		"title": "Share this",
        		"contexts": contexts, 
        		"onclick": shareClick
        	});
        } else {
          // Add a group if recipients are defined
        	var parent = chrome.contextMenus.create({
        		"title": "Share this with...",
        		"contexts": contexts
        	});
        	
        	var rs = recipients.split(",");
        	rs.forEach(function(r) {
        		chrome.contextMenus.create({
        			"title": r,
        			"parentId": parent,
        			"contexts": contexts,
        			"onclick": function(info, tab) {
        				shareClick(info, tab, r);
        			}
        		});
        	});
        }
    });
}

setupContextMenus();

chrome.runtime.onMessage.addListener(function(request) {
    if (request === "update_context_menus") {
        setupContextMenus();
    }
});
