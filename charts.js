(function() {
    var dataForEmailsBySender;
    var dataForEmailsByWeekday; //cwkTODO move to separate class?
    var totalEmails;

    var reverseCompare = function(a,b) {
        if (a.count < b.count) {
            return 1;
        }
        if (a.count > b.count) {
            return -1;
        }
        return 0;
    };

    var makeEmailsBySenderChart = function(messagesForViz) {
        totalEmails = messagesForViz.length;

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

        data.sort(reverseCompare);

        dataForEmailsBySender = data;
    };

    var getColor = function(value) {
        var threshold = 5;
        if (value >= threshold) {
            return "#FF0033";
        }
        return "#666666";
    };

    var getPercentage = function(count) {
        return ((count / totalEmails) * 100).toFixed(2);
    }

    var drawEmailsBySenderChart = function() {
        var w = 500;
        var h = 500;
        var padding = 5; // space between bars
        var minBarWidth = 100;

        //cwkTODO add an id to prevent duplicates
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
                return d.name + " (" + d.count + ") - " + getPercentage(d.count) + "%";
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
            });
    };

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
        stats: function() {
            //cwkTODO
        },
        emailsBySender: function(messagesForViz) {
            makeEmailsBySenderChart(messagesForViz);
            drawEmailsBySenderChart();
        },
        emailsPerWeekday: function() {
            makeEmailsPerWeekdayChart(messagesForViz);
            drawEmailsPerWeekdayChart();
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