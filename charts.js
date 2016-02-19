(function() {
    gmailytics.charts = {
        create: function(messagesForViz) {
            gmailytics.charts.emailsBySender(messagesForViz);
            gmailytics.charts.emailsPerWeekday(messagesForViz);
        },
        //cwkTODO move these to separate classes
        stats: function() {
            //cwkTODO
        },
        emailsOverTime: function() {
            //cwkTODO
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