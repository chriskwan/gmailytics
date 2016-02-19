(function() {
    var dataForChart;

    var make = function(messagesForViz) {
        var dict = {};

        //cwkTODO refactor this to utility method since it seems the same for all charts
        for (var i=0; i<messagesForViz.length; i++) {
            var date = messagesForViz[i].date;
            if (!dict.hasOwnProperty(date)) {

                // Create new Dates in case they come in as string
                // (i.e. if this data was from local storage and was serialized)
                var dateObj = new Date(date);

                dict[date] = {
                    date: dateObj,
                    count: 1,
                    name: dateObj.toString()
                };
            } else {
                dict[date].count++;
            }
        }

        var data = [];

        //cwkTODO refactor this to a utility method as well
        for (var prop in dict) {
            if (dict.hasOwnProperty(prop)) {
                data.push(dict[prop]);
            }
        }

        data.sort(function(a, b) {
            // Ref: http://stackoverflow.com/a/10124053
            return new Date(a.date) - new Date(b.date);
        });

        dataForChart = data;
    };

    var draw = function() {
        var w = 500;
        var h = 500;
        var padding = 20;

        var svg = d3.select("body")
            .append("svg")
            .attr({
                width: w,
                height: h,
                id: "svg-emails-over-time-chart"
            }
        );

        var minDate = dataForChart[0].date;
        var maxDate = dataForChart[dataForChart.length-1].date;

        var xScale = d3.time.scale()
            .domain([minDate, maxDate])
            .range([0 + padding, w - padding]);

        // large counts are higher up in the chart (smaller y values)
        var yScale = d3.scale.linear()
            .domain([0,
                d3.max(dataForChart, function(d) {
                    return d.count;
                }
            )])
            .range([h - padding, 0 + padding]);

        var dots = svg.selectAll("circle")
            .data(dataForChart)
            .enter()
            .append("circle")
            .attr({
                cx: function(d) {
                    return xScale(d.date);
                },
                cy: function(d) {
                    return yScale(d.count);
                },
                r: 4
            })
    };

    gmailytics.charts.emailsOverTime = function(messagesForViz) {
        make(messagesForViz);
        draw();
    };
})();
