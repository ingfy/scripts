function loadRecipients() {
	var emails = window.localStorage.recipients;
	console.log('loaded');
	console.log(emails);
	if (emails === undefined)
		emails = [];

	var recipients = document.getElementById('recipientsArea');
	recipients.value = emails.split(',').join('\n');
}


function saveRecipients() {
	var recipients = document.getElementById('recipientsArea');
	window.localStorage.recipients = recipients.value.split('\n');
	console.log('saved');
	console.log(window.localStorage.recipients);
	
	var status = document.getElementById('status');
	status.innerHTML = "Recipients updated.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 1000);
}

document.addEventListener('DOMContentLoaded', loadRecipients);
document.getElementById('save').addEventListener('click', saveRecipients);
