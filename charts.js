(function() {
    //cwkTODO change this to just setup the global charts object
    //cwkTODO move the create logic to a chartCreator file
    gmailytics.charts = {
        create: function(messagesForViz) {
            gmailytics.charts.emailsBySender(messagesForViz);
            gmailytics.charts.emailsPerWeekday(messagesForViz);
            gmailytics.charts.emailsOverTime(messagesForViz);
        },
        //cwkTODO move these to separate classes
        stats: function() {
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