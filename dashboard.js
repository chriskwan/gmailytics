// From: https://developers.google.com/gmail/api/quickstart/js
var CLIENT_ID = gmailytics.clientID;

var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

var messagesForViz = [];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
   gapi.auth.authorize({
       client_id : CLIENT_ID,
       scope : SCOPES.join(' '),
       immediate :  true
   }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 * 
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
   var authorizeDiv = document.getElementById('authorize-div');
   if (authResult && !authResult.error) {
       // Hide auth UI, then load client library.
       authorizeDiv.style.display = 'none';
       loadGmailApi();
   } else {
       // Show auth UI, allowing the user to initiate authorization by
       // clicking authorize button.
       authorizeDiv.style.display = 'inline';
   }
}

function handleMakeChartsClick(event) {
    gmailytics.charts.emailsBySenderChart(messagesForViz);
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
   gapi.auth.authorize({
       client_id : CLIENT_ID,
       scope : SCOPES,
       immediate : false
   }, handleAuthResult);

   return false;
}

/**
 * Load Gmail API client library. List labels once client library
 * is loaded.
 */
function loadGmailApi() {
    // cwkTODO for now cache the messages while we are developing
    messagesForViz = gmailytics.storage.get("messagesForViz") || [];
    if (!messagesForViz.length) {
        gapi.client.load('gmail', 'v1', retrieveMessages);
    } else {
        appendPre('Messages already loaded');
    }
}

function retrieveMessages() {
   var request = gapi.client.gmail.users.messages.list({
       userId: 'me'
   });

   request.execute(function(resp) {
       var messages = resp.messages;

       if (messages && messages.length > 0) {
           for (var i = 0; i < messages.length; i++) {
               var messageId = messages[i].id;
               getAndCreateMessage(messageId);
           }
       } else {
           appendPre('No Messages found.');
       }
   });
}

function getAndCreateMessage(id) {
    var request = gapi.client.gmail.users.messages.get({
       userId: 'me',
       id: id
    });

    request.execute(function(resp) {
        var message = gmailytics.messages.create(resp);

        if (message) {
            messagesForViz.push(message);
            gmailytics.storage.set("messagesForViz", messagesForViz);
            document.getElementById("emailsHeader").innerText = "Emails (" + messagesForViz.length + "):";
            appendPreForMessage(resp.snippet);
        }
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function appendPreForMessage(message, type) {
   var pre = document.getElementById('email');
   var textContent = document.createTextNode("-" + message + '\n');
   pre.appendChild(textContent);
}
