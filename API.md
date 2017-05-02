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

    * [**`width`**](#plot_option_width) - the width of the svg element.
    * [**`height`**](#plot_option_height) - the height of the svg element.
    * [**`margins`**](#plot_option_margins) - the margins between the edges of the svg element and the plotting area.

* [All axes](#plot_options_category_allaxes) - Options related to the look/style of all axes.

    * [**`box`**](#plot_option_box) - set to true (default) if you want a box drawn around the plotting area.
    * [**`axes_color`**](#plot_option_axes_color) - line color for the axes.
    * [**`axes_width`**](#plot_option_axes_width) - line width for the axes.
    * [**`axes_linestyle`**](#plot_option_axes_linestyle) - line style for the axes.
    * [**`axes_fill`**](#plot_option_axes_fill) - background color of the plotting area.
    * [**`axes_fill_opacity`**](#plot_option_axes_fill_opacity) - background opacity of the plotting area.
    * [**`axes_font_size`**](#plot_option_axes_font_size) - font size for the axes.
    * [**`axes_font_color`**](#plot_option_axes_font_color) - font color for the axes.
    * [**`axes_font_family`**](#plot_option_axes_font_family) - font family for the axes.

* [X-AXIS, Y-AXIS, Y2-AXIS](#plot_options_category_axes) - Options specific to one of the axes.

    * [**`xscale_type`**, **`yscale_type`**, **`y2scale_type`**](#plot_option_xscale_type) - scale type (linear, log or time) for the x-, y- or y2-axis.
    * [**`xlabel`**, **`ylabel`**, **`y2label`**](#plot_option_xlabel) - label for the x-, y- or y2-axis.
    * [**`xlabel_offset`**, **`ylabel_offset`**, **`y2label_offset`**](#plot_option_xlabel_offset) - label position offset for the x-, y- or y2-axis.
    * [**`xlim`**, **`ylim`**, **`y2lim`**](#plot_option_xlim) - limits for the x-, y- or y2-axis.
    * [**`xticks`**, **`yticks`**, **`y2ticks`**](#plot_option_xticks) - number of ticks for the x-, y- or y2-axis.
    * [**`xtick_format`**, **`ytick_format`**, **`y2tick_format`**](#plot_option_xtick_format) - tick-formatting for the x-, y- or y2-axis.
    * [**`xgrid`**, **`ygrid`**, **`y2grid`**](#plot_option_xgrid) - set to true if you want a grid for the x-, y- or y2-axis. Default value: false.
    * [**`xgrid_color`**, **`ygrid_color`**, **`y2grid_color`**](#plot_option_xgrid_color) - line color for the grid.
    * [**`xgrid_width`**, **`ygrid_width`**, **`y2grid_width`**](#plot_option_xgrid_width) - line width for the grid.
    * [**`xgrid_linestyle`**, **`ygrid_linestyle`**, **`y2grid_linestyle`**](#plot_option_xgrid_linestyle) - line style for the grid.

* [Legend](#plot_options_category_legend) - Options related to the chart legend.
* [Interactivity](#plot_options_category_interactivity) - Options related to the interactivity of the plot.

#### <a name="plot_options_category_data"></a>Data options

<!-- DATA -->
<a name="plot_option_data"></a> **`data`** - the data that you want to display.

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

----

<!-- XKEY -->
<a name="plot_option_xkey"></a>**`xkey`** - the name of the data field for the x-axis. `xkey` should be the name of an existing key/field in your data (or existing column in your `.csv` file).

Suppose that you have the following `example2.csv`:

```
Day,Sample A,Sample B,Sample C
0,1.36978893471,3.38066609811,7.45844794384
1,1.49137655531,3.73562084117,7.63119347755
2,1.31017647221,3.18068192911,7.91360793457
3,1.94220556984,3.3077832707,7.58647498067
5,1.77968604686,4.08654857579,7.88098220595
7,0.997654022027,3.63538096353,8.00060374422
9,1.0733420551,3.94260109575,8.27977747233
10,1.05827381601,3.4675124496,8.27592568438
11,0.868382926097,3.98204649432,8.5884383334
12,0.81904420459,4.23153801748,8.60615909873
13,0.211346950485,3.48159582174,8.51885166262
14,0.502426110935,4.00882731717,8.85955705304
16,0.428451632712,3.96117944976,9.18180366264
17,1.04163792553,3.96417664929,9.20189324965
20,1.65277501927,4.71706610312,9.28660800814
21,2.30355686489,4.40055478386,9.10005351925
22,1.98011642352,4.28127578006,9.45732390058
23,1.92578819133,4.24988962377,9.2813438626
25,2.83355771364,4.531977732,9.74802805888
27,2.86510553,4.45628993545,9.72014913369
29,2.46391268367,4.94468815819,9.83643787802
31,1.33390118878,4.94602962698,9.94864620082
32,1.49865153895,4.5081845264,9.73482618335
35,1.12928356976,5.54484986623,9.80230835739
37,0.577915325874,5.3160935591,10.2208536926
38,0.963887752359,5.27097249312,9.87139312408
43,1.91308864095,5.84662048942,10.2575789957
45,2.28138866381,5.62614589185,10.0362131626
47,3.98233556726,6.03960751819,10.3564396765
48,4.20154102933,5.74450477186,10.0201650906
52,4.62734034229,6.58126399348,10.4879707942
53,4.1583600623,6.74476162006,10.3062670141
54,3.60289368004,7.08549438007,9.99730862968
55,3.10613029358,6.51947130176,10.3953371742
56,2.37063599917,7.00610102317,10.4167041786
57,2.72980165959,7.34890058783,10.2393033322
58,2.03934690879,6.85086377411,10.3584094022
59,1.63679377172,6.9296261582,9.94050716439
60,1.19564798487,6.79853084373,10.1114271712
61,0.655471774952,7.83847602017,9.99690581442
62,0.385796680674,7.64894687909,10.0531244406
63,0.278324384613,7.16921707316,10.2653275541
64,0.51113849592,7.604307368,10.1286850174
66,1.57461405987,8.2262377036,9.77114841935
67,2.40624734565,8.11356524606,9.68408544648
68,2.43529684566,7.95256231606,9.97495804536
69,3.61332159008,8.22750328326,9.63678093146
70,4.92327747654,8.39838248123,9.84821794504
71,5.06532411968,9.00167080446,9.94965846792
72,5.85338666451,8.9578441662,9.81770910251
76,7.95126311533,9.15882518405,9.320794114
77,7.39387324551,9.40653560907,9.23932850863
78,7.3560307929,9.52281438728,9.46205751247
80,5.65850626333,10.0206385502,9.14498445324
82,4.11375029892,11.088206372,9.26279650048
83,3.33141152116,11.2291596108,8.80828285438
85,1.24794738328,11.0923759382,9.1272399739
86,0.383933826093,11.9565979759,8.99766245759
88,0.12056697819,12.2736856997,8.62030045971
89,1.17790151531,12.3018139038,8.42843589536
90,1.6695839921,12.2338390187,8.32240562087
91,2.47604417627,12.9268026429,8.51609928178
93,4.70595987669,13.7153127875,8.06990380397
94,6.82692246401,13.4768857118,8.30022925411
95,7.87689619998,14.3432131529,8.02836320274
96,9.73399572755,14.1008412337,7.92389526433
97,10.4488214849,14.1375429697,7.63726835332
98,11.7286960169,14.4860340892,7.59136934731
99,12.9190593149,15.0618799918,7.41576150465
```

In this case, there are four columns and four possible `xkey` values (`"Day"`, `"Sample A"`, `"Sample B"` or `"Sample C"`). For example:

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

----

#### <a name="plot_options_category_lines"></a>Line options

<!-- LINE_COLOR -->
<a name="plot_option_line_color"></a>**`line_color`** - a color or an array of colors for the lines. 
The colors are the ones supported by D3 and can be any CSS color representation (rgb, hex, named color, ...).
By default, `line_color = ['blue', 'red', 'limegreen', 'magenta', 'cyan', 'black', 'orange']`.

If `line_color` is a string, all lines will have the same color. For example:

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_color: "blue",
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_line_color_1.png" width="600"></p>

If `line_color` is an array (of strings), the first line will have the first color, the second line the second color, ...
If the array length is less than the number of lines, the colors will be repeated.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_color: ["steelblue", "#f77", "rgb(250, 120, 240)"],
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_line_color_2.png" width="600"></p>

----

<!-- LINE_WIDTH -->
<a name="plot_option_line_width"></a>**`line_width`** - a width/thickness or an array of widths for the lines.
By default, `line_width = 1.5`.

If `line_width` is a float, all lines will have the same width. Use an array (of floats) to specify different widths for different lines.
If the array length is less than the number of lines, the widths will be repeated.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_width: [1, 3.5, 1],
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_line_width.png" width="600"></p>

----

<!-- LINE_STYLE -->
<a name="plot_option_line_style"></a>**`line_style`** - a style (solid, dotted, ...) or an array of styles for the lines.
By default, `line_style = "-"` (solid).

If `line_style` is a string, all lines will have the same style. Use an array (of strings) to specify different styles for different lines.
If the array length is less than the number of lines, the styles will be repeated.

Possible styles are:
- "-" or "solid"
- ":" or "dotted"
- "--" or "dashed"
- "-." or "dash-dot"

For example,
```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_style: ['dash-dot', ':', '--'],
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_line_style_1.png" width="600"></p>

It is also possible to use custom styles by providing a dash array string, that is a string representing the dashes and the spaces between the dashes. For example, the `dotted` style has a dash array of "1 1" (1-px dash and 1-px space), the `dashed` style has a dash array of "3 3" and the `dash-dot` style has a dash array of "5 2 1 2".

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_style: "3 5 3 5 3 5 10 5 10 5 10 5",
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_line_style_2.png" width="600"></p>

----

<!-- LINE_FILL -->
<a name="plot_option_line_fill"></a>**`line_fill`** - a fill color or an array of fill colors for the areas under the lines.
By default, `line_fill = "none"` (no fill color).

If `line_fill` is a string, all lines will have the same fill color. Use an array (of strings) to specify different fill colors for different lines.
If the array length is less than the number of lines, the fill colors will be repeated.

Note that the fill color might hide some of the data. In that case, you can play with [**`line_fill_opacity`**](#plot_option_line_fill_opacity) to change the transparency of the areas under the lines.

See [**`line_color`**](#plot_option_line_color) for color options.

For example,
```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_fill: ["lightgrey", "none", "none"],
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_line_fill.png" width="600"></p>

You can set `line_fill` to "color" to have all fill colors equal to the line colors.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_fill: "color",
    };
    d3lines.plot(svg, options);
});
```

----

<!-- LINE_FILL_OPACITY -->
<a name="plot_option_line_fill_opacity"></a>**`line_fill_opacity`** - a fill opacity or an array of fill opacities for the areas under the lines. Opacities should be floats between 0.0 (transparent) and 1.0 (opaque).
By default, `line_fill_opacity = 1.0`.
Note that `line_fill_opacity` only affects the lines that have a `line_fill` different than "none".

If `line_fill_opacity` is a float, all lines will have the same fill opacity. Use an array (of floats) to specify different fill opacities for different lines.
If the array length is less than the number of lines, the fill opacities will be repeated.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_fill: "color",
        line_fill_opacity: 0.1,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_line_fill_opacity.png" width="600"></p>

----

<!-- MARKER -->
<a name="plot_option_marker"></a>**`marker`** - a marker/symbol or an array of markers for the lines.
By default, `marker = ""` (no marker).

If `marker` is a string, all lines will have the same marker. Use an array (of strings) to specify different markers for different lines.
If the array length is less than the number of lines, the markers will be repeated.

Possible values are:
- "" (no marker)
- "o" or "circle"
- "s" or "square"
- "d" or "diamond"
- "+" or "cross"
- "^" or "triangle-up"
- "v" or "triangle-down"

For example,
```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        marker: ["o", "s", "v"],
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_marker.png" width="600"></p>

----

<!-- MARKER_FILL -->
<a name="plot_option_marker_fill"></a>**`marker_fill`** - a fill color or an array of fill colors for the markers.
By default, `marker_fill = "white"`.
Note that this option will only affect the lines that have makers.

If `marker_fill` is a string, all markers will have the same fill color. Use an array (of strings) to specify different marker fill colors for different lines.
If the array length is less than the number of lines, the marker fill colors will be repeated.

See [**`line_color`**](#plot_option_line_color) for color options.

For example,
```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        marker: ["o", "s", "v"],
        marker_fill: ["limegreen", "none", "yellow"],
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_marker_fill.png" width="600"></p>

You can set `marker_fill` to "color" to have all marker fill colors equal to the line colors.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        marker: ["o", "s", "v"],
        marker_fill: "color",
    };
    d3lines.plot(svg, options);
});
```

----

<!-- MARKER_FILL_OPACITY -->
<a name="plot_option_marker_fill_opacity"></a>**`marker_fill_opacity`** - a fill opacity or an array of fill opacities for the markers. Opacities should be floats between 0.0 (transparent) and 1.0 (opaque).
By default, `marker_fill_opacity = 1.0`.
Note that this option only affects the lines that have markers and a `marker_fill` different than "none".

If `marker_fill_opacity` is a float, all lines will have the same marker fill opacity. Use an array (of floats) to specify different marker fill opacities for different lines.
If the array length is less than the number of lines, the marker fill opacities will be repeated.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        marker: ["o", "s", "v"],
        marker_fill: "color",
        marker_fill_opacity: 0.2,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_marker_fill_opacity.png" width="600"></p>

----

<!-- MARKER_STROKE_WIDTH -->
<a name="plot_option_marker_stroke_width"></a>**`marker_stroke_width`** - a width/thickness or an array of widths for the marker edges.
By default, `marker_stroke_width = 1.0`.
Note that this option only affects lines that have markers.

If `marker_stroke_width` is a float, all markers will have the same stroke width. Use an array (of floats) to specify different marker stroke widths for different lines.
If the array length is less than the number of lines, the marker stroke widths will be repeated.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        marker: ["o", "s", "v"],
        marker_fill: "color",
        marker_fill_opacity: 0.2,
        marker_stroke_width: 0.5,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_marker_stroke_width.png" width="600"></p>

----

<!-- MARKER_SIZE -->
<a name="plot_option_marker_size"></a>**`marker_size`** - a size or an array of sizes for the markers.
By default, `marker_size = 8`.
Note that this option only affects lines that have markers.

If `marker_size` is a float, all markers will have the same size. Use an array (of floats) to specify different marker sizes for different lines.
If the array length is less than the number of lines, the marker sizes will be repeated.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        marker: ["o", "s", "v"],
        marker_size: [3, 12, 5.5],
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_marker_size.png" width="600"></p>

----

<!-- line_yaxis -->
<a name="plot_option_line_yaxis"></a>**`line_yaxis`** - specifies the y-axis (left or right) for the lines.
By default, `line_yaxis = "left"`. This option allows to have two sets of y-axes.

If `line_yaxis` is a string ("left" or "right", all line will have the same y-axis. Use an array (of strings) to specify different y-axes for different lines.
If the array length is less than the number of lines, the y-axes will be repeated.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_yaxis: ["left", "left", "right"]
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_line_yaxis.png" width="600"></p>

----

<!-- plot_type -->
<a name="plot_option_plot_type"></a>**`plot_type`** - Specifies the type of plot (line or scatter plot). By default, `plot_type = "line"`.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        plot_type: "scatter"
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_plot_type.png" width="600"></p>

`plot_type` is simply a wrapper for a few different options, in such a way that the above code is equivalent to:

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        line_width: 0,
        marker: ["o", "s", "v", "d", "^", "+"],
        marker_fill: ["#ddf", "#fdd", "#ded", "#fdf", "#dff", "#ddd", "#fed"],
        marker_fill_opacity: 1.0
    };
    d3lines.plot(svg, options);
});
```

----

#### <a name="plot_options_category_geometry"></a>Geometry options

<!-- width -->
<a name="plot_option_width"></a>**`width`** - the width of the svg element (in pixels). The width must be larger than the sum of the left and right margins. By default, `width = 800`.

Example:
```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        width: 500,
    };
    d3lines.plot(svg, options);
});
```

----

<!-- height -->
<a name="plot_option_height"></a>**`height`** - the height of the svg element (in pixels). The height must be larger than the sum of the top and bottom margins. By default, `height = 500`.

Example:
```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        height: 800,
    };
    d3lines.plot(svg, options);
});
```

----

<!-- margins -->
<a name="plot_option_margins"></a>**`margins`** - the margins between the edges of the svg element and the plotting area. `margins` must be an object with the optional `top`, `right`, `bottom`, `left` keys. By default,
```js
margins = {top: 15,
           right: 70,
           bottom: 50,
           left: 70};
```

Example:
```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        margins: {
                  top: 55,
                  left: 100
                  },
    };
    d3lines.plot(svg, options);
});
```

----

#### <a name="plot_options_category_allaxes"></a>Options for all axes

<!-- box -->
<a name="plot_option_box"></a>**`box`** - set to true (default) if you want a box drawn around the plotting area.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        box: false,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_box.png" width="600"></p>

----

<!-- axes_color -->
<a name="plot_option_axes_color"></a>**`axes_color`** - line color for the axes.
By default, `axes_color = "#777"`.
Note that this option will set the color of the axes only. To change the color of the axes's text, see [**`axes_font_color`**]("#plot_option_axes_font_color").

See [**`line_color`**](#plot_option_line_color) for color options.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        axes_color: "red",
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_axes_color.png" width="600"></p>

----

<!-- axes_width -->
<a name="plot_option_axes_width"></a>**`axes_width`** - line width for the axes. By default, `axes_width = 1`.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        axes_width: 2.5,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_axes_width.png" width="600"></p>

----

<!-- axes_linestyle -->
<a name="plot_option_axes_linestyle"></a>**`axes_linestyle`** - line style for the axes. By default, `axes_linestyle = "-"` (solid).

See [**`line_style`**](#plot_option_line_style) for style options.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        axes_linestyle: "dotted",
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_axes_linestyle.png" width="600"></p>

----

<!-- axes_fill -->
<a name="plot_option_axes_fill"></a>**`axes_fill`** - background color of the plotting area. By default, `axes_fill = "none"` (transparent).
Note that it only works when `box` is true.

See [**`line_color`**](#plot_option_line_color) for color options.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        axes_fill: "#f5f5ff",
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_axes_fill.png" width="600"></p>

----

<!-- axes_fill_opacity -->
<a name="plot_option_axes_fill_opacity"></a>**`axes_fill_opacity`** - background opacity of the plotting area. By default, `axes_fill_opacity = 1.0` (opaque).
Note that it only works when `box` is true and when `axes_fill` is not set to "none".

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        axes_fill: "red",
        axes_fill_opacity: 0.1,
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_axes_fill_opacity.png" width="600"></p>

----

<!-- axes_font_size -->
<a name="plot_option_axes_font_size"></a>**`axes_font_size`** - font size for the axes. 

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        axes_font_size: "18px",
    };
    d3lines.plot(svg, options);
});
```
<p align="center"><img src="/images/API/plot/option_axes_font_size.png" width="600"></p>

----

<!-- axes_font_color -->
<a name="plot_option_axes_font_color"></a>**`axes_font_color`** - font color for the axes.

See [**`line_color`**](#plot_option_line_color) for color options.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        axes_font_color: "red",
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_axes_font_color.png" width="600"></p>

----

<!-- axes_font_family -->
<a name="plot_option_axes_font_family"></a>**`axes_font_family`** - font family for the axes.

```javascript
d3.csv("example2.csv", function(error, data) {
    var options = {
        data: data,
        xkey: "Day",
        axes_font_family: "'Times New Roman', Georgia, Serif"
    };
    d3lines.plot(svg, options);
});
```

<p align="center"><img src="/images/API/plot/option_axes_font_family.png" width="600"></p>

----

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

<p align="center"><img src="/images/API/plot/option_xscale_type_1.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xscale_type_2.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xlabel.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xlabel_offset.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xlim.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xticks.png" width="600"></p>

----

<!-- xtick_format, ytick_format, y2tick_format -->
<a name="plot_option_xtick_format"></a>**`xtick_format`**, **`ytick_format`**, **`y2tick_format`** - tick-formatting for the x-, y- or y2-axis. These options allow you to format the strings associated with the ticks. To specify the format, you need to provide a function that will transform the tick string. The function takes optional arguments: the original tick string and the tick index.

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

<p align="center"><img src="/images/API/plot/option_xtick_format.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xgrid.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xgrid_color.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xgrid_width.png" width="600"></p>

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

<p align="center"><img src="/images/API/plot/option_xgrid_linestyle.png" width="600"></p>

----


#### <a name="plot_options_category_legend"></a>Legend options

#### <a name="plot_options_category_interactivity"></a>Interactivity options


## <a name="Data"></a>d3lines.Data(data)



