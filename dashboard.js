// From: https://developers.google.com/gmail/api/quickstart/js
var CLIENT_ID = gmailyticsClientID;

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
    var w = 1000;
    var h = 500;
    var padding = 2; // space between bars
    // var dataset = [5, 10, 13, 19, 21, 25,
    //                 11, 25, 22, 18, 7];

    var minBarWidth = 100;

    var dataset = dataForEmailsBySender;

    var svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h);

    function colorPicker(v) {
        if (v<=20) { return "#666666"; }
        else if (v>20) { return "#FF0033"; }
    }

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
    .attr({
        // x: function(d, i) {
        //     return i * (w/ dataset.length);
        // },
        // y: function(d) {
        //     return h - (d.count*20);
        // },
        x: function(d) {
            return 0;
        },
        y: function(d, i) {
            return i * (h / dataset.length) + padding;
        },
        //width: w / dataset.length - padding,
        // height: function(d) {
        //     return d.count*20;
        // },
        width: function (d) {
            return d.count * minBarWidth;
        },
        height: h / dataset.length,
        fill: function(d) {
            return colorPicker(d);
        }
    });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) { return d.name; })
        .attr({
            "text-anchor": "start",
            // x: function(d, i) {
            //     return i * (w / dataset.length) + (w / dataset.length - padding) / 2;
            // },
            // y: function(d) {
            //     return h - (d.count*20) + 14;
            // },
            x: function(d) {
                //return w - (d.count*20) + 14;
                return 0 + 50;
            },
            y: function(d, i) {
                return i * (h / dataset.length) + (h / dataset.length - padding) / 2;
            },
            "font-family": "sans-serif",
            "font-size": "12",
            "fill": "#ffffff"
        })
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
   gapi.client.load('gmail', 'v1', listItems);
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

function appendPreForMessage(message, type) {
   var pre = document.getElementById('email');
   var textContent = document.createTextNode("-" + message + '\n');
   pre.appendChild(textContent);
}
