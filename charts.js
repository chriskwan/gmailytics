(function() {
    gmailytics.charts = {
        drawEmailsBySenderChart: function(dataForEmailsBySender) {
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
                });
        }
    }

    function getColor(value) {
        var threshold = 5;
        if (value >= threshold) {
            return "#FF0033";
        }
        return "#666666";
    }
})();