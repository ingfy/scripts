// Some license here. Free for everything, of course.

// Share
function constructEmailUrl(target, title, text) {
	return "mailto:" + encodeURIComponent(target) + "?" + 
        "subject=" + encodeURIComponent(title) + 
        "&body=" + encodeURIComponent(text);
}

function shareClick(info, tab, recipient) {
	var link = info.linkUrl;
	var element = document.getElementById(info.parentMenuItem);
	var title = "I am sharing this link with you!";
	if (element) {
		title = element.innerHTML;
	}
	var text = "Check this out! " + link;
	
	//dialog box for address
	var address = recipient || "";

	var url = constructEmailUrl(address, title, text);
	chrome.tabs.create({ url: url });
}

// Add the context menu

// Get recipients
var recipients = window.localStorage.recipients;

if (recipients === undefined || recipients.length === undefined || recipients.length === 0) {
	chrome.contextMenus.create({
		"title": "Share this link",
		"contexts": ["link"], 
		"onclick": shareClick
	});
} else {
	var parent = chrome.contextMenus.create({
		"title": "Share this link with...",
		"contexts": ["link"]
	});
	
	var rs = recipients.split(",");
	rs.forEach(function(r) {
		chrome.contextMenus.create({
			"title": r,
			"parentId": parent,
			"contexts": ["link"],
			"onclick": function(info, tab) {
				shareClick(info, tab, r);
			}
		});
	});
}
