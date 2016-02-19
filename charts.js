(function() {
    gmailytics.charts = {
        create: function(messagesForViz) {
            gmailytics.charts.emailsBySender(messagesForViz);
            gmailytics.charts.emailsPerWeekday(messagesForViz);
        },
        stats: function() {
            //cwkTODO
        },
        emailsPerDay: function() {
            //cwkTODO
            //cwkTODO rename to differentiate from emailsPerWeekday
        },
        inboxSizeOverTime: function() {
            //cwkTODO
        },
        emailSenderLocation: function() {
            //cwkTODO
        },
        wordCloud: function() {
            //cwkTODO
        }
    };
})();