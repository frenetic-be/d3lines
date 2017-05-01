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

<p align="center"><img src="/images/API/plot/option_data_1.png" width="600"></p>

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

<a name="plot_option_xkey"></a>**`xkey`** - the name of the data field for the x-axis. `xkey` should be the name of an existing key/field in your data (or existing column in your `.csv` file).

Suppose that you have the following `example2.csv`:

```
Day,Sample A,Sample B,Sample C
3,69.7665925945,50.8980167548,61.4978011553
7,70.2307668378,48.3065756125,55.7963998342
13,78.1404816526,44.3945781512,64.7251611208
17,74.2128753514,46.6664839444,69.456580873
18,78.7136091918,46.0431669673,64.5843281325
19,68.2731934312,45.1773347638,67.0246086318
20,64.6784765394,43.8829260824,67.3304829687
21,64.078266354,42.7393393412,67.4614262131
27,59.9736260654,41.8389801619,76.6184128588
28,54.1963318973,43.1991975906,74.5551006676
29,45.4346434254,40.8165035072,78.7135983798
30,39.5235907855,37.9678408868,79.1089953112
31,40.9070193725,45.7138889281,82.3784494751
35,41.6691052989,47.9107825793,80.5789026314
36,36.1142120885,47.2426926164,85.4838881572
37,34.2928694345,47.7384269922,79.1678668036
39,41.7805111834,47.8739136227,82.7028614384
45,51.9588457713,52.6420505946,73.2735220657
46,44.8207100247,54.9694009876,71.2531399487
47,48.0384615897,54.7887335839,74.432922587
48,56.7066860435,55.3316986158,73.0092348861
49,53.9976928278,52.5088657451,71.4317964783
50,51.3274301356,52.8425459045,65.8703562685
51,57.8483208511,52.7984731613,66.4797810692
55,67.6225873434,53.4088409972,64.5942464805
56,78.682754998,49.2548751825,64.2137755437
57,70.1188207482,54.138512164,62.8840246882
65,80.0604567566,41.3548750048,62.9439413559
66,78.3013956113,40.8632430803,63.2198078713
67,79.9679308774,41.7919659434,67.4707900413
68,83.2877833742,42.6636048632,67.5678695071
69,77.33435728,38.097450205,69.3084623065
70,65.614365036,38.2147610106,70.9377960871
71,74.123920916,37.0322817873,76.1509830151
72,63.6736680769,38.1033794331,73.0974722335
77,48.9972820909,37.5631887494,94.2539018493
78,49.2046936762,38.184370403,92.3802315884
79,42.6473164729,40.8041792357,96.5701073646
87,35.3975775855,42.806132401,119.183267619
88,29.3350246672,50.720324528,121.427372588
89,41.7412372846,50.110861592,117.862777462
90,34.1749979574,47.1374402302,119.657094144
91,43.9498604905,51.1191193224,121.736495799
92,38.7696044878,51.4961996245,120.743382758
96,52.804215494,49.4095674323,122.992119826
97,46.4073025374,52.5807774045,119.077755809
98,56.8501170472,56.8733243277,114.900404169
99,49.736711926,50.5512701401,117.028862561
```

In this case, there will be three possible `xkey` values (`"Day"`, `"In"` or `"Out"`). For example:

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day"
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_xkey.png" width="600"></p>

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



