#d3lines API

d3lines is a module with the following methods:

* [d3lines.plot](#plot) - Creates a plot.



## <a name="plot"></a>d3lines.plot(svg[, options])

Creates a plot and appends it to the `svg` tag. `svg` should be a D3 selection.

For example, if you have an `svg` tag with the ID "main-svg":

```javascript
var svg = d3.select("#main-svg");
```

Without specifying any option, you will get an empty plot with default axes:

```javascript
d3lines.plot(svg);
```

<img src="/images/API/plot/no_options.png" width="600" align="center">

### Options

`options` is an object with keys and values. For example:

```javascript
var options = {
    data: data,
    xkey: "Year",
    yscale_type: "log",
    ygrid: true,
    legend_position: "top right",
};
```

Here is a list of possible options, grouped by categories, and what their effect is on the chart. 
We split the options into the following categories:

* [Data](#plot_options_category_data) - Options that define the data that you want to display.
* [Lines](#plot_options_category_lines) - Options that define the look and style of the lines or markers.
* [Geometry](#plot_options_category_geometry) - Options related to the geometry of the plot.
* [All axes](#plot_options_category_allaxes) - Options related to the look/style of all axes.
* [X-AXIS, Y-AXIS, Y2-AXIS](#plot_options_category_axes) - Options specific to one of the axes.
* [Legend](#plot_options_category_legend) - Options related to the chart legend.
* [Interactivity](#plot_options_category_interactivity) - Options related to the interactivity of the plot.

#### <a name="plot_options_category_data"></a>Data options

#### <a name="plot_options_category_lines"></a>Line options

#### <a name="plot_options_category_geometry"></a>Geometry options

#### <a name="plot_options_category_allaxes"></a>Options for all axes

#### <a name="plot_options_category_axes"></a>X-AXIS, Y-AXIS, Y2-AXIS options

#### <a name="plot_options_category_legend"></a>Legend options

#### <a name="plot_options_category_interactivity"></a>Interactivity options


