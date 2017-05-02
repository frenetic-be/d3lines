#### <a name="plot_options_category_axes"></a>X-AXIS, Y-AXIS, Y2-AXIS options

<!-- xscale_type, yscale_type, y2scale_type -->
<a name="plot_option_xscale_type"></a>**`xscale_type`**, **`yscale_type`**, **`y2scale_type`** - scale type (linear, log or time) for the x-, y- or y2-axis.

Possible values:
- "linear" (default): standard linear scale;
- "log": logarithmic scale;

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        yscale_type: "log"
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xscale_type_1.png" width="600" height="375"></p>

- "time": this scale is used when the data values are `Date` objects.

Suppose you have the following `example_time.csv` file:
```
Time,Humidity
2017-04-13 00:01:48,67.0
2017-04-13 00:32:05,67.9
2017-04-13 00:58:20,68.4
2017-04-13 01:34:41,68.8
2017-04-13 04:22:17,70.1
2017-04-13 06:26:28,70.5
2017-04-13 08:09:26,79.1
2017-04-13 09:15:04,75.8
2017-04-13 11:52:34,70.7
2017-04-13 15:28:38,66.2
```

The csv parser will read this data as strings. So, before plotting the data, we need to transform it into `Date` objects. We'll use the `d3.time` module to do that. Then, we can plot it.

```javascript
d3.csv("example_time.csv", function(error, data) {
    data.forEach(function(d){
        d.Time = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.Time)
    });

    var options = {
        data: data,
        xkey: "Time",
        xscale_type: "time",
        xticks: 5,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xscale_type_2.png" width="600" height="375"></p>

----

<!-- xlabel, ylabel, y2label -->
<a name="plot_option_xlabel"></a>**`xlabel`**, **`ylabel`**, **`y2label`** - label for the x-, y- or y2-axis. 
If `xkey` is provided, `xlabel` will be by default equal to `xkey`.
If there is only one line on the chart, `ylabel` will be set by default to the matching key/column name.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        xlabel: "Day of the year",
        ylabel: "Some variable"
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xlabel.png" width="600" height="375"></p>

----

<!-- xlabel_offset, ylabel_offset, y2label_offset -->
<a name="plot_option_xlabel_offset"></a>**`xlabel_offset`**, **`ylabel_offset`**, **`y2label_offset`** - label position offset for the x-, y- or y2-axis.
Use these options if you want the labels to be closer (negative value) to or further away (positive value) from the axes.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        ylabel: "Some variable",
        ylabel_offset: -20,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xlabel_offset.png" width="600" height="375"></p>

----

<!-- xlim, ylim, y2lim -->
<a name="plot_option_xlim"></a>**`xlim`**, **`ylim`**, **`y2lim`** - limits for the x-, y- or y2-axis. These options can either be:

- a float: the number represents the ratio between the axis range and the data range. 
A value of 1.0 is a tight layout where the min and max of the axis correspond to the min and max of the data. 
A good value is 1.05, where all your data is visible and spread but not cramped against the axis.
By default, `xlim = 1.0`, `ylim = 1.05` and y2lim = `1.05`.
- a 2-element array: the two values define the limits for the axis

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        xlim: [40, 110],
        ylim: 1,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xlim.png" width="600" height="375"></p>

----

<!-- xticks, yticks, y2ticks -->
<a name="plot_option_xticks"></a>**`xticks`**, **`yticks`**, **`y2ticks`** - number of ticks for the x-, y- or y2-axis. Depending on the data, the number of ticks might not be exactly the number you specify. To suppress ticks, set the number of ticks to 0.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        xticks: 0,
        yticks: 3,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xticks.png" width="600" height="375"></p>

----

<!-- xtick_format, ytick_format, y2tick_format -->
<a name="plot_option_xtick_format"></a>**`xtick_format`**, **`ytick_format`**, **`y2tick_format`** - tick-formatting for the x-, y- or y2-axis. These options allow you to format the strings associated with the ticks. To specify the format, you need to provide a function that will transform the tick string. The function takes optional arguments: the original tick string and the tick index.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_yaxis: ["left", "left", "right"],
        xlabel: "Hours",
        xtick_format: function(data, index){
            return data*24;
        },
        yticks: 3,
        ytick_format: function(data, index){
            return ["Very low", "Low", "High", "Very high"][index];
        },
        y2tick_format: function(data, index){
            return data+" %";
        },
        margins: {left: 80},
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xtick_format.png" width="600" height="375"></p>

----

<!-- xgrid, ygrid, y2grid -->
<a name="plot_option_xgrid"></a>**`xgrid`**, **`ygrid`**, **`y2grid`** - set to true if you want a grid for the x-, y- or y2-axis. These options are set to false by default.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        xgrid: true,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xgrid.png" width="600" height="375"></p>

----

<!-- xgrid_color, ygrid_color, y2grid_color -->
<a name="plot_option_xgrid_color"></a>**`xgrid_color`**, **`ygrid_color`**, **`y2grid_color`** - line color for the grid.
The corresponding grid must be set to true for these options to have any effect. The default color is "#777".

See [**`line_color`**](#plot_option_line_color) for color options.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        ygrid: true,
        ygrid_color: "red",
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xgrid_color.png" width="600" height="375"></p>

----

<!-- xgrid_width, ygrid_width, y2grid_width -->
<a name="plot_option_xgrid_width"></a>**`xgrid_width`**, **`ygrid_width`**, **`y2grid_width`** - line width for the grid.
The corresponding grid must be set to true for these options to have any effect. The default width is 0.5.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        ygrid: true,
        ygrid_width: 3,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xgrid_width.png" width="600" height="375"></p>

----

<!-- xgrid_linestyle, ygrid_linestyle, y2grid_linestyle -->
<a name="plot_option_xgrid_linestyle"></a>**`xgrid_linestyle`**, **`ygrid_linestyle`**, **`y2grid_linestyle`** - line style for the grid.
The corresponding grid must be set to true for these options to have any effect.

See [**`line_style`**](#plot_option_line_style) for style options. The default style is "dotted".

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        ygrid: true,
        ygrid_linestyle: "dashed",
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xgrid_linestyle.png" width="600" height="375"></p>