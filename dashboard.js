// From: https://developers.google.com/gmail/api/quickstart/js
var CLIENT_ID = gmailytics.clientID;

var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

var messagesForViz = [];
var totalEmails = 0;
var dataForEmailsBySender;

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
    makeEmailsBySenderChart();
    drawEmailsBySenderChart();
}

function makeEmailsBySenderChart() {
    var dict = {};

    for (var i=0; i<messagesForViz.length; i++) {
        var sender = messagesForViz[i].senderDomain;
        if (!dict.hasOwnProperty(sender)) {
            dict[sender] = {
                name: sender,
                count: 1
            };
        } else {
            dict[sender].count++;
        }
    }

    var data = [];

    for (var prop in dict) {
        if (dict.hasOwnProperty(prop)){
            data.push(dict[prop]);
        }
    }

    var reverseCompare = function(a,b) {
        if (a.count < b.count) {
            return 1;
        }
        if (a.count > b.count) {
            return -1;
        }
        return 0;
    };

    data.sort(reverseCompare);

    dataForEmailsBySender = data; //cwkTODO global bad I know
}

function drawEmailsBySenderChart() {
//cwkTODO chart stuff from my other project MOVE THIS

    var w = 500;
    var h = 500;
    var padding = 5; // space between bars
    var minBarWidth = 100;

    var svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h)
        .style({
            "background-color": "green"
        })

    var dataset = dataForEmailsBySender;

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
    .attr({
        x: function(d) {
            return 0;
        },
        y: function(d, i) {
            return i * ( (h / dataset.length) + padding );
        },
        width: function (d) {
            return d.count * minBarWidth;
        },
        height: function () {
            return (h / dataset.length);
        },
        fill: function(d) {
            return getColor(d.count);
        }
    });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d.name + " (" + d.count + ")";
        })
        .attr({
            "text-anchor": "start",
            x: function(d) {
                return 0;
            },
            y: function(d, i) {
                return i * ( (h / dataset.length) + padding ) + 10; //cwkTODO how to derive this magic number 10?
            },
            "font-family": "sans-serif",
            "font-size": "12",
            "fill": "#ffffff"
        })
}

function getColor(value) {
    var threshold = 5;
    if (value >= threshold) {
        return "#FF0033";
    }
    return "#666666";
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
        gapi.client.load('gmail', 'v1', listItems);
    } else {
        appendPre('Messages already loaded');
    }
}

// Add other items to list here
function listItems() {
   listMessages();
}

function listMessages() {
   var request = gapi.client.gmail.users.messages.list({
       userId: 'me'
   });

   request.execute(function(resp) {
       var messages = resp.messages;

       if (messages && messages.length > 0) {
           for (var i = 0; i < messages.length; i++) {
               var messageId = messages[i].id;
               printMessage(messageId);
           }
       } else {
           appendPre('No Messages found.');
       }
   });
}

function printMessage(id) {
    var request = gapi.client.gmail.users.messages.get({
       userId: 'me',
       id: id
    });

    request.execute(function(resp) {
        //cwkTODO apply this filter in the query?
        if (hasLabel(resp, "INBOX") && !hasLabel(resp, "CHAT")) {
            var headers = resp.payload.headers;
            var message = new Message();

            message.id = resp.id;
            message.sender = getHeaderValue(headers, "From");
            message.senderDomain = getSenderDomain(message.sender);
            message.senderIPAddress = getSenderIPAddress(resp, headers);
            message.isRead = !hasLabel(resp, "UNREAD");
            message.isStarred = hasLabel(resp, "STARRED");
            message.date = getHeaderValue(headers, "Date");
            message.dayOfWeek = new Date(message.date).getDay();
            //message.location //cwkTODO pass senderIPAddress to API to get coordinates (Ref: https://ctrlq.org/code/20046-email-ip-address)
            message.snippet = resp.snippet;

            messagesForViz.push(message);
            gmailytics.storage.set("messagesForViz", messagesForViz);

            totalEmails++;
            document.getElementById("emailsHeader").innerText = "Emails (" + totalEmails + "):";

            appendPreForMessage(resp.snippet);
        }
    });
}

function hasLabel(message, label) {
    var labels = message.labelIds;

    if (!labels || labels.length < 1) {
        return false;
    }

    for (var i=0; i<labels.length; i++) {
        if (labels[i].toUpperCase() === label.toUpperCase()) {
            return true;
        }
    }

    return false;
}

function getHeaderValue(headers, name) {
    if (!headers || !headers.length) {
        return null;
    }

    for (var i=0; i<headers.length; i++) {
        var header = headers[i];
        if (header.name.toLowerCase() === name.toLowerCase()) {
            return header.value;
        }
    }

    return null;
}

function getSenderDomain(senderStr) {
    var matches = senderStr.match(/@((\w*\.)*(\w*\.\w*))/);
    return matches ? matches[3] : null;
}

function getSenderIPAddress(message, headers) {
    var receivedStr = getHeaderValue(headers, "Received");

    // Ref: https://ctrlq.org/code/20046-email-ip-address
    var ipMatches = receivedStr.match(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/);

    return ipMatches ? ipMatches[0] : null;
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
