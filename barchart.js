(function($) {
    $.fn.barChart = function(){
        var labels,
            values,
            numBars,
            templates,
            chart,
            yAxisLabels,
            yAxisLabel,
            bars,
            bar,
            i;

        templates = {
            chart: $('<div class="bar-chart"> <div class="y-axis"> </div> <div class="bars"> </div> </div>'),
            bar: $('<div class="bar"> <div class="bar-layers"> <div class="bar-layer bar-background"></div><div class="bar-layer bar-foreground" style="height:30%;"> <div class="bar-value"></div> </div> </div> <div class="bar-label"> </div> </div> '),
            yAxisLabel: $('<div class="y-axis-label"></div>')
        };

        // get labels
        labels = [];

        this.find('th').each(function(){
            labels.push($(this).text());
        });

        // get values
        values = [];

        this.find('td').each(function(){
            values.push($(this).text());
        });

        numBars = labels.length;

        // Now let's create some els

        // main wrapper el
        chart = templates.chart.clone();

        // this will hold a bunch of bar els
        bars = [];

        for (i = 0; i < numBars; i++) {
            bar = templates.bar.clone();
            bar.find('.bar-value').html(values[i]);
            bar.find('.bar-label').html(labels[i]);
            bar.find('.bar-foreground').height(70 + '%');
            bars.push(bar);
        }

        // insert the bars
        chart.find('.bars').html(bars);

        // this will hold a bunch of y-axis labels
        yAxisLabels = [];

        numYAxisLabels = 6;

        for (i = 0; i < numYAxisLabels; i++) {
            yAxisLabel = templates.yAxisLabel.clone();
            yAxisLabel.html(i);
            yAxisLabel.css('top', (i * 20) + '%');
            yAxisLabels.push(yAxisLabel);
        }

        // insert the axis labels
        chart.find('.y-axis').html(yAxisLabels);

        // set type of bar chart
        chart.addClass('vertical');

        // create a new wrapper el that retains the original
        // el's id + classes
        chart = $('<div>')
                .attr('id', this.attr('id'))
                .addClass(this[0].className)
                .html(chart);

        // put the chart in the DOM
        chart.insertBefore(this);

        // hide the original table
        this.hide();

        // maintain chainability
        return this;

    };
})(jQuery);
