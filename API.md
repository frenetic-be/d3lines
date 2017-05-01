# d3lines API

d3lines is a module with the following methods and protoypes:

* [d3lines.plot](#plot) - Creates a plot.

* [d3lines.Data](#Data) - A prototype to perform simple data tasks.


## <a name="plot"></a>d3lines.plot(svg[, options])

Creates a plot and appends it to the `svg` tag. `svg` should be a D3 selection object.

For example, if you have an `svg` tag with the ID "main-svg":

```javascript
var svg = d3.select("#main-svg");
```

Without specifying any option, you will get an empty plot with default axes:

```javascript
d3lines.plot(svg);
```

<p align="center"><img src="/images/API/plot/no_options.png" width="600" align="center"></p>

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

* [Data](#plot_options_category_data) - options that define the data that you want to display.

    * [**`data`**](#plot_option_data) - the data that you want to display.
    * [**`xkey`**](#plot_option_xkey) - the name of the data field for the x-axis.

* [Lines](#plot_options_category_lines) - options that define the look and style of the lines or markers.

    * [**`line_color`**](#plot_option_line_color) - a color or an array of colors for the lines.
    * [**`line_width`**](#plot_option_line_width) - a width/thickness or an array of widths for the lines.
    * [**`line_style`**](#plot_option_line_style) - a style (solid, dotted, ...) or an array of styles for the lines.
    * [**`line_fill`**](#plot_option_line_fill) - a fill color or an array of fill colors for the areas under the lines.
    * [**`line_fill_opacity`**](#plot_option_line_fill_opacity) - a fill opacity or an array of fill opacities for the areas under the lines.
    * [**`marker`**](#plot_option_marker) - a marker/symbol or an array of markers for the lines.
    * [**`marker_fill`**](#plot_option_marker_fill) - a fill color or an array of fill colors for the markers.
    * [**`marker_fill_opacity`**](#plot_option_marker_fill_opacity) - a fill opacity or an array of fill opacities for the markers.
    * [**`marker_stroke_width`**](#plot_option_marker_stroke_width) - a width/thickness or an array of widths for the marker edges.
    * [**`marker_size`**](#plot_option_marker_size) - a size or an array of sizes for the markers.
    * [**`line_yaxis`**](#plot_option_line_yaxis) - specifies the y-axis (left or right) for the lines.
    * [**`plot_type`**](#plot_option_plot_type) - Line or scatter plot.

* [Geometry](#plot_options_category_geometry) - Options related to the geometry of the plot.
* [All axes](#plot_options_category_allaxes) - Options related to the look/style of all axes.
* [X-AXIS, Y-AXIS, Y2-AXIS](#plot_options_category_axes) - Options specific to one of the axes.
* [Legend](#plot_options_category_legend) - Options related to the chart legend.
* [Interactivity](#plot_options_category_interactivity) - Options related to the interactivity of the plot.

#### <a name="plot_options_category_data"></a>Data options

<a name="plot_option_data"></a>**`data`** - the data that you want to display.

`d3lines.plot` accepts several data types:

1. An array of dictionaries

Example:

```javascript
var data = [{In: 67.3, Out: 56.5},
            {In: 73.1, Out: 59.1},
            {In: 71.9, Out: 58.7},
            {In: 74.3, Out: 53.3},
            {In: 77.7, Out: 49.2}];

var options = {
    data: data,
};

d3lines.plot(svg, options);
```

<p align="center"><img src="/images/API/plot/option_data_1.png" width="600" align="center"></p>

This is the basic supported data type. It is the data type coming out of the [D3 csv, tsv and dsv](https://github.com/d3/d3-3.x-api-reference/blob/master/CSV.md) parsers.

For example, the data above can be obtained by parsing the following `example.csv` file:

```
In,Out
67.3,56.5
73.1,59.1
71.9,58.7
74.3,53.3
77.7,49.2
```

The example above then becomes:

```javascript
d3.csv("example.csv", function(error, data) {
    var options = {
        data: data,
    };
    d3lines.plot(svg, options);
});

```

2. A dictionary of arrays

Example:

```js
var data = {In: [67.3, 73.1, 71.9, 74.3, 77.7],
            Out: [56.5, 59.1, 58.7, 53.3, 49.2]};
```

`d3lines.plot` will attempt to transform this data into the standard array of dictionaries.

3. An array (or an array of arrays)

Example:

```js
var data = [[67.3, 56.5],
            [73.1, 59.1],
            [71.9, 58.7],
            [74.3, 53.3],
            [77.7, 49.2]];
```

`d3lines.plot` will attempt to transform this data into the standard array of dictionaries. Since there are no keys or field names in this array. `d3lines.plot` will simply name them `y1`, `y2`, ...

4. An instance of `d3lines.Data`

See [d3lines.Data](#Data) for details.

<a name="plot_option_xkey"></a>**`xkey`** - the name of the data field for the x-axis.

#### <a name="plot_options_category_lines"></a>Line options

<a name="plot_option_line_color"></a>**`line_color`** - a color or an array of colors for the lines.


<a name="plot_option_line_width"></a>**`line_width`** - a width/thickness or an array of widths for the lines.


<a name="plot_option_line_style"></a>**`line_style`** - a style (solid, dotted, ...) or an array of styles for the lines.


<a name="plot_option_line_fill"></a>**`line_fill`** - a fill color or an array of fill colors for the areas under the lines.


<a name="plot_option_line_fill_opacity"></a>**`line_fill_opacity`** - a fill opacity or an array of fill opacities for the areas under the lines.


<a name="plot_option_marker"></a>**`marker`** - a marker/symbol or an array of markers for the lines.


<a name="plot_option_marker_fill"></a>**`marker_fill`** - a fill color or an array of fill colors for the markers.


<a name="plot_option_marker_fill_opacity"></a>**`marker_fill_opacity`** - a fill opacity or an array of fill opacities for the markers.


<a name="plot_option_marker_stroke_width"></a>**`marker_stroke_width`** - a width/thickness or an array of widths for the marker edges.


<a name="plot_option_marker_size"></a>**`marker_size`** - a size or an array of sizes for the markers.


<a name="plot_option_line_yaxis"></a>**`line_yaxis`** - specifies the y-axis (left or right) for the lines.


<a name="plot_option_plot_type"></a>**`plot_type`** - Line or scatter plot.

#### <a name="plot_options_category_geometry"></a>Geometry options

#### <a name="plot_options_category_allaxes"></a>Options for all axes

#### <a name="plot_options_category_axes"></a>X-AXIS, Y-AXIS, Y2-AXIS options

#### <a name="plot_options_category_legend"></a>Legend options

#### <a name="plot_options_category_interactivity"></a>Interactivity options


## <a name="Data"></a>d3lines.Data(data)



