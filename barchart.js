(function($) {

    function addPercentage(values, max) {
        for (i = 0; i < values.length; i++) {
            values[i].percent = parseInt( (values[i].stripped * 100) / max );
        }

        return values;
    }

    function stripNumber(number) {
        return parseFloat(number.replace('$',''));
    }

    function prepareValues(values) {
        var raw,
            stripped;

        for (i = 0; i < values.length; i++) {
            raw = values[i];
            stripped = stripNumber(raw);
            values[i] = {
                raw: raw,
                stripped: stripped
            }
        }

        return values;
    }

    function getMinAndMax(values) {
        var array;

        array = [];

        for (i = 0; i < values.length; i++) {
            array.push(values[i].stripped);
        }

        return {
            min: Math.min.apply(null, array),
            max: Math.max.apply(null, array)
        }
    };

    function calculateOrderOfMagnitude(val) {
        return Math.floor(Math.log(val) / Math.LN10);
    }       

    function calculateScale(maxSteps,minSteps,maxValue,minValue) {
        var graphMin,
            graphMax,
            graphRange,
            stepValue,
            numberOfSteps,
            valueRange,
            rangeOrderOfMagnitude;

        valueRange = maxValue - minValue;
        
        rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);

        graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
        
        graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
        
        graphRange = graphMax - graphMin;
        
        stepValue = Math.pow(10, rangeOrderOfMagnitude);
        
        numberOfSteps = Math.round(graphRange / stepValue);
        
        //Compare number of steps to the max and min for that size graph, and add in half steps if need be.         
        while(numberOfSteps < minSteps || numberOfSteps > maxSteps) {
            if (numberOfSteps < minSteps){
                stepValue /= 2;
                numberOfSteps = Math.round(graphRange/stepValue);
            }
            else{
                stepValue *=2;
                numberOfSteps = Math.round(graphRange/stepValue);
            }
        };

        return {
            steps : numberOfSteps,
            stepValue : stepValue,
            graphMin : graphMin
        }

    }

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
            i,
            minAndMax,
            minValue,
            maxValue,
            scale,
            maxYAxisValue,
            labelValue;

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

        // prepare raw values for mathematical manipulation
        values = prepareValues(values);

        minAndMax = getMinAndMax(values);

        // always want the y-axis to start at 0
        minValue = 0;

        maxValue = minAndMax.max;

        scale = calculateScale(8, 2, maxValue, minValue);

        // Now let's create some els

        // ------------------------------------ create main wrapper el
        chart = templates.chart.clone();

        // ------------------------------------ create y-axis label els

        yAxisLabels = [];
        numYAxisLabels = scale.steps + 1;
        for (i = 0; i < numYAxisLabels; i++) {
            yAxisLabel = templates.yAxisLabel.clone();
            labelValue = (scale.steps - i) * scale.stepValue;
            yAxisLabel.html(labelValue);
            intervalPercentage = parseInt(100 / scale.steps);
            yAxisLabel.css('top', (i * intervalPercentage) + '%');
            yAxisLabels.push(yAxisLabel);
        }

        // insert the axis labels
        chart.find('.y-axis').html(yAxisLabels);

        // ------------------------------------ create bar els

        maxYAxisValue = scale.graphMin + (scale.steps * scale.stepValue);
        values = addPercentage(values, maxYAxisValue);

        bars = [];
        numBars = values.length;
        for (i = 0; i < numBars; i++) {
            bar = templates.bar.clone();
            bar.find('.bar-value').html(values[i].raw);
            bar.find('.bar-label').html(labels[i]);
            bar.find('.bar-foreground').height(values[i].percent + '%');
            bars.push(bar);
        }

        // insert the bars
        chart.find('.bars').html(bars);

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
