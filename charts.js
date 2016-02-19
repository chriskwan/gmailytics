(function() {

    var dataForEmailsByWeekday; //cwkTODO move to separate class?
    var totalEmails;


    var makeEmailsPerWeekdayChart = function(messagesForViz) {
        totalEmails = messagesForViz.length;

        var dict = {};

        for (var i=0; i<messagesForViz.length; i++) {
            var weekday = messagesForViz[i].dayOfWeek;
            if (!dict.hasOwnProperty(weekday)) {
                dict[weekday] = {
                    weekday: weekday,
                    name: getWeekdayName(weekday),
                    count: 1
                };
            } else {
                dict[weekday].count++;
            }
        }

        var data = [];

        for (var prop in dict) {
            if (dict.hasOwnProperty(prop)){
                data.push(dict[prop]);
            }
        }

        //data.sort(reverseCompare); //cwkTODO sort by weekday

        dataForEmailsByWeekday = data;
    };

    var getWeekdayName = function(weekDayIndex) {
        var names = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        return names[weekDayIndex];
    };

    var drawEmailsPerWeekdayChart = function() {
        var w = 500;
        var h = 500;
        var padding = 5;
        var minBarHeight = 10;

        //cwkTODO add an id to prevent duplicates
        var svg = d3.select("body").append("svg")
            .attr("width", w)
            .attr("height", h)
            .style({
                "background-color": "blue"
            });

        var dataset = dataForEmailsByWeekday;

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr({
                x: function (d, i) {
                    return i * ( (w / dataset.length) + padding );
                },
                y: function (d) {
                    return h - (d.count * minBarHeight);
                },
                width: function (d) {
                    return w / dataset.length;
                },
                height: function (d) {
                    return d.count * minBarHeight;
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
                x: function(d, i) {
                    var barWidth = (w / dataset.length);
                    var labelOffset = barWidth / 2 - barWidth / 5;
                    return i * ( barWidth + padding ) + labelOffset;
                },
                y: function(d) {
                    return h - (d.count * minBarHeight);
                },
                "font-family": "sans-serif",
                "font-size": "12",
                "fill": "#ffffff"
            });
    };

    gmailytics.charts = {
        create: function(messagesForViz) {
            gmailytics.charts.emailsBySender(messagesForViz);

            //cwkTODO move to separate file - emailsPerWeekday
            makeEmailsPerWeekdayChart(messagesForViz);
            drawEmailsPerWeekdayChart();
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