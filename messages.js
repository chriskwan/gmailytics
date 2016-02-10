(function() {

    var hasLabel = function(message, label) {
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
    };

    var getHeaderValue = function(headers, name) {
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
    };

    var getSenderDomain = function(senderStr) {
        var matches = senderStr.match(/@((\w*\.)*(\w*\.\w*))/);
        return matches ? matches[3] : null;
    };

    var getSenderIPAddress = function(message, headers) {
        var receivedStr = getHeaderValue(headers, "Received");

        // Ref: https://ctrlq.org/code/20046-email-ip-address
        var ipMatches = receivedStr.match(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/);

        return ipMatches ? ipMatches[0] : null;
    };

    gmailytics.messages = {
        create: function(resp) {
            if (!resp || !resp.payload || !resp.payload.headers) {
                return null;
            }

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

            return message;
        }
    };
})();