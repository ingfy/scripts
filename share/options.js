function loadOpts() {
	var emails = window.localStorage.recipients;
	console.log('loaded');
	console.log(emails);
	if (emails === undefined)
		emails = [];

    var message = window.localStorage.message;

	var recipients = document.getElementById('recipientsArea');
	recipients.value = emails.split(',').join('\n');

    var messageArea = document.getElementById('messageArea');
    message.value = message;
}


function saveOpts() {
	var recipients = document.getElementById('recipientsArea');
	window.localStorage.recipients = recipients.value.split('\n');

    var message = document.getElementById('messageArea');
    window.localStorage.message = message.value;    

	console.log('saved');
	
	var status = document.getElementById('status');
	status.innerHTML = "Recipients updated.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 1000);
}

document.addEventListener('DOMContentLoaded', loadOpts);
document.getElementById('save').addEventListener('click', saveOpts);
