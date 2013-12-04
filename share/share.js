// Build mailto: link
function constructEmailUrl(target, title, text) {
	return "mailto:" + encodeURIComponent(target) + "?" + 
        "subject=" + encodeURIComponent(title) + 
        "&body=" + encodeURIComponent(text);
}

// TODO: add support for custom message
function shareClick(info, tab, recipient) {
    var link = info.linkUrl || info.srcUrl;
    var customMessage = window.localStorage.message;
    var text = (customMessage || "Check this out!") + " " + link;
	var address = recipient || "";

    requestClickedElementText(tab, function(title) {
        var url = constructEmailUrl(address, title, text);
	    chrome.tabs.create({ url: url });
    });
}

function requestClickedElementText(tab, callback) {
    chrome.tabs.sendMessage(tab.id, 
        "clicked_element_text", function(response) {
        var defaultText = "I am sharing this link with you!";
        callback((response ? response.text : "") || defaultText);
    });
}


// Get recipients
var recipients = window.localStorage.recipients;
var contexts = ["all"];

if (recipients === undefined || recipients.length === undefined || recipients.length === 0) {
  // If no recipients are configured, add simple menu item
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
