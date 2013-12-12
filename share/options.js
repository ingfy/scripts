function loadOpts() {
	var emails = window.localStorage.recipients || [];
    var message = window.localStorage.message || "";
    var title = window.localStorage.title || "";

	var recipientssArea = document
        .getElementById('recipientsArea');
	recipientsArea.value = emails.split(',').join('\n');

    var messageArea = document.getElementById('messageArea');
    messageArea.value = message;

    var titleInput = document.getElementById('titleInput');
    titleInput.value = title;
}


function saveOpts() {
	var recipientsArea = document.getElementById('recipientsArea');
	window.localStorage.recipients = recipientsArea.value.split('\n');

    var messageArea = document.getElementById('messageArea');
    window.localStorage.message = messageArea.value;

    var titleInput = document.getElementById('titleInput');
    window.localStorage.title = titleInput.value;    

//    chrome.extension.getBackgroundPage().setupContextMenus();
    chrome.runtime.sendMessage("update_context_menus");

	var status = document.getElementById('status');
	status.innerHTML = status
        .attributes['data-ok-text'].textContent;
	setTimeout(function() {
		status.innerHTML = "";
	}, 1000);
}

document.addEventListener('DOMContentLoaded', loadOpts);
document.getElementById('save').addEventListener('click', saveOpts);

