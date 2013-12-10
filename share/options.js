function loadOpts() {
	var emails = window.localStorage.recipients || [];
    var message = window.localStorage.message || "";

	var recipientssArea = document
        .getElementById('recipientsArea');
	recipientsArea.value = emails.split(',').join('\n');

    var messageArea = document.getElementById('messageArea');
    messageArea.value = message;
}


function saveOpts() {
	var recipients = document.getElementById('recipientsArea');
	window.localStorage.recipients = recipients.value.split('\n');

    var message = document.getElementById('messageArea');
    window.localStorage.message = message.value;    

	var status = document.getElementById('status');
	status.innerHTML = status
        .attributes['data-ok-text'].textContent;
	setTimeout(function() {
		status.innerHTML = "";
	}, 1000);
}

document.addEventListener('DOMContentLoaded', loadOpts);
document.getElementById('save').addEventListener('click', saveOpts);
