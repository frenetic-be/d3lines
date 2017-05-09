<em>
**Table of contents for [`d3lines.Chart`](d3lines_Chart.md)**

* [`d3lines.Chart`](d3lines_Chart.md#Chart)
* [`d3lines.SVGChart`](d3lines_Chart.md#SVGChart)
* [`d3lines.SVGAxesGroup`](d3lines_Chart.md#SVGAxesGroup)
* [`d3lines.SVGAxesLabelGroup`](d3lines_Chart.md#SVGAxesLabelGroup)
* [`d3lines.SVGBoxGroup`](d3lines_Chart.md#SVGBoxGroup)
* [`d3lines.SVGLegendGroup`](d3lines_Chart.md#SVGLegendGroup)
* [`d3lines.SVGLinesGroup`](d3lines_Chart.md#SVGLinesGroup)
* [`d3lines.SVGInteractiveGroup`](d3lines_Chart.md#SVGInteractiveGroup)
</em>

----

## <a name="Chart"></a>`d3lines.Chart(svg)`

`d3lines.Chart` is an object representing a chart and all of its svg elements.
`d3lines.Chart` is the result of [`d3lines.plot`](d3lines_plot.md#plot).

Example:
```javascript
var svg = d3.select("#main-svg");
var plt = d3lines.plot(svg); // plt is a d3lines.Chart object
```

Arguments:

- **`svg`**: a D3 selection object of an `svg` tag.

### Properties

- **`options`**: object containing all chart options (see [`options`](d3lines_plot.md#plot_options))
- **`width`**: width of the svg tag
- **`height`**: height of the svg tag
- **`margins`**: margins around the chart
- **`xaxis`**: axis generator created by [`d3.svg.axis`](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis)
- **`yaxis`**: axis generator created by [`d3.svg.axis`](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis)
- **`y2axis`**: axis generator created by [`d3.svg.axis`](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis)
- **`line_options`**: array of line options, each element corresponds to one line on the chart
- **`scale`**: an object containing all of the chart scales (objects that converts data to pixel location and pixel location to data coordinates).
See [`d3.scale`](https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md#d3scale-scales) for details.
    - **`scale.x`**: scale for the `x` axis
    - **`scale.y`**: scale for the `y` axis
    - **`scale.y2`**: scale for the `y2` (right) axis
    - **`scale.original_x`**: original scale for the `x` axis. When zooming, `scale.x` will change while `scale.original_x` will remain the same.
    - **`scale.original_y`**: original scale for the `y` axis. When zooming, `scale.y` will change while `scale.original_y` will remain the same.
    - **`scale.original_y2`**: original scale for the `y2` axis. When zooming, `scale.y2` will change while `scale.original_y2` will remain the same.
- **`svg`**: [`d3lines.SVGChart`](d3lines_Chart.md#SVGChart) object that contains all svg elements created by [`d3lines.plot`](d3lines_plot.md#plot).

### Methods

- **`copy(other)`**: copies another `d3lines.Chart` object.

For example:

```javascript
var svg = d3.select("#main-svg");
var plt = d3lines.plot(svg);
var plt2 = d3lines.Chart(svg);
plt2.copy(plt);
```

- **`redrawXAxis()`**, **`redrawYAxis()`**, **`redrawY2Axis()`**: refreshes one of the axes.

For example:

```javascript
var svg = d3.select("#main-svg");
var plt = d3lines.plot(svg);
plt.scale.x.domain([-1, 1]);
plt.redrawXAxis();
```

- **`redrawLine(index)`**: refreshes one of the data lines.
- **`redrawLines()`**: refreshes all data lines.
- **`redraw()`**: refreshes the entire chart. 
This method calls `redrawXAxis()`, `redrawYAxis()`, `redrawY2Axis()` and `redrawLines()`.
For example, it is used when zooming in and out of the chart.
- **`reset()`**: resets a chart to its original settings.

For example:

```javascript
var svg = d3.select("#main-svg");
var plt = d3lines.plot(svg);
plt.scale.x.domain([-1, 1]);
plt.redraw();
plt.reset();
```

----

## <a name="SVGChart"></a>`d3lines.SVGChart(svg)`

`d3lines.SVGChart` is an object representing all of the svg elements created by [`d3lines.plot`](d3lines_plot.md#plot).

Arguments:

- **`svg`**: D3 selection object of an `svg` tag.

### Properties

- **`main`**: D3 selection object of the `svg` tag..
- **`axes`**: [`d3lines.SVGAxesGroup`](d3lines_Chart.md#SVGAxesGroup) object that contains the svg elements related to the chart axes.
- **`box`**: [`d3lines.SVGBoxGroup`](d3lines_Chart.md#SVGBoxGroup) object that contains the svg elements related to the box around the chart.
- **`legend`**: [`d3lines.SVGLegendGroup`](d3lines_Chart.md#SVGLegendGroup) object that contains the svg elements related to the chart legend.
- **`lines`**: [`d3lines.SVGLinesGroup`](d3lines_Chart.md#SVGLinesGroup) object that contains the svg elements related to the chart data lines.
- **`interactive`**: [`d3lines.SVGInteractiveGroup`](d3lines_Chart.md#SVGInteractiveGroup) object that contains the svg elements related to the chart's interactive behavior.

### Methods

- **`removeAll()`**: removes all nodes and groups from the chart (axes, box, legend, lines, interactive).

For example:

```javascript
var svg = d3.select("#main-svg");
var plt = d3lines.plot(svg);
plt.svg.removeAll();
```

----

## <a name="SVGAxesGroup"></a>`d3lines.SVGAxesGroup()`

`d3lines.SVGAxesGroup` is an object that contains the svg elements related to the chart axes.

### Properties

- **`group`**: D3 selection object representing the svg group containing all axes and axes labels.
- **`labels`**: [`d3lines.SVGAxesLabelGroup`](d3lines_Chart.md#SVGAxesLabelGroup) object that contains the svg elements related to the chart axes labels.
- **`x`**: D3 selection object representing the svg group containing the x-axis and all of its ticks and grid lines.
- **`y`**: D3 selection object representing the svg group containing the y-axis and all of its ticks and grid lines.
- **`y2`**: if defined, D3 selection object representing the svg group containing the y2-axis and all of its ticks and grid lines.

For example, 

```javascript
var svg = d3.select("#main-svg");
var plt = d3lines.plot(svg);
plt.svg.axes.y.selectAll('.tick line').style("stroke", "red");
```

### Methods

- **`remove()`**: removes the svg group containing all axes and labels.

For example:

```javascript
var svg = d3.select("#main-svg");
var options = {
    data: [{Day: 1, In: 67.3, Out: 56.5},
            {Day: 2, In: 73.1, Out: 59.1},
            {Day: 3, In: 71.9, Out: 58.7},
            {Day: 4, In: 74.3, Out: 53.3},
            {Day: 5, In: 77.7, Out: 49.2}],
    xkey: "Day"
};
var plt = d3lines.plot(svg, options);
plt.svg.axes.remove();
```

----

## <a name="SVGAxesLabelGroup"></a>`d3lines.SVGAxesLabelGroup()`

`d3lines.SVGAxesLabelGroup` is an object that contains the svg elements related to the chart axes labels.

### Properties

- **`group`**: D3 selection object representing the svg group containing all axes labels.
- **`x`**: D3 selection object representing the svg text for the x-axis label.
- **`y`**: if defined, D3 selection object representing the svg text for the y-axis label.
- **`y2`**: if defined, D3 selection object representing the svg text for the y2-axis label.

For example, 

```javascript
var svg = d3.select("#main-svg");
var plt = d3lines.plot(svg);
plt.svg.axes.labels.x.text("X-AXIS");
plt.svg.axes.labels.y.text("Y-AXIS");
```

### Methods

- **`remove()`**: removes the svg group containing all axes labels.

For example:

```javascript
var svg = d3.select("#main-svg");
var options = {
    data: [{Day: 1, In: 67.3, Out: 56.5},
            {Day: 2, In: 73.1, Out: 59.1},
            {Day: 3, In: 71.9, Out: 58.7},
            {Day: 4, In: 74.3, Out: 53.3},
            {Day: 5, In: 77.7, Out: 49.2}],
    xkey: "Day"
};
var plt = d3lines.plot(svg, options);
plt.svg.axes.labels.remove();
```

----

## <a name="SVGBoxGroup"></a>`d3lines.SVGBoxGroup()`

`d3lines.SVGBoxGroup` is an object that contains the svg elements related to the box around the chart.

### Properties

- **`group`**: D3 selection object representing the svg group containing the box.
- **`rect`**: D3 selection object representing the box.

For example, 

```javascript
var svg = d3.select("#main-svg");
var plt = d3lines.plot(svg);
plt.svg.box.rect.style("stroke", "red");
```

### Methods

- **`remove()`**: removes the svg group containing the box. This will also remove the axes lines.

For example:

```javascript
var svg = d3.select("#main-svg");
var options = {
    data: [{Day: 1, In: 67.3, Out: 56.5},
            {Day: 2, In: 73.1, Out: 59.1},
            {Day: 3, In: 71.9, Out: 58.7},
            {Day: 4, In: 74.3, Out: 53.3},
            {Day: 5, In: 77.7, Out: 49.2}],
    xkey: "Day"
};
var plt = d3lines.plot(svg, options);
plt.svg.box.remove();
```

----

## <a name="SVGLegendGroup"></a>`d3lines.SVGLegendGroup()`

`d3lines.SVGLegendGroup` is an object that contains the svg elements related to the legend.

### Properties

- **`group`**: D3 selection object representing the svg group containing the box.

For example, 

```javascript
var svg = d3.select("#main-svg");
var options = {
    data: [{Day: 1, In: 67.3, Out: 56.5},
            {Day: 2, In: 73.1, Out: 59.1},
            {Day: 3, In: 71.9, Out: 58.7},
            {Day: 4, In: 74.3, Out: 53.3},
            {Day: 5, In: 77.7, Out: 49.2}],
    xkey: "Day"
};
var plt = d3lines.plot(svg, options);
plt.svg.legend.group.attr("transform", "translate(500, 200)");
```

### Methods

- **`remove()`**: removes the svg group containing the legend.

For example:

```javascript
var svg = d3.select("#main-svg");
var options = {
    data: [{Day: 1, In: 67.3, Out: 56.5},
            {Day: 2, In: 73.1, Out: 59.1},
            {Day: 3, In: 71.9, Out: 58.7},
            {Day: 4, In: 74.3, Out: 53.3},
            {Day: 5, In: 77.7, Out: 49.2}],
    xkey: "Day"
};
var plt = d3lines.plot(svg, options);
plt.svg.legend.remove();
```

----

## <a name="SVGLinesGroup"></a>`d3lines.SVGLinesGroup()`

`d3lines.SVGLinesGroup` is an object that contains the svg elements related to the data lines.

### Properties

- **`group`**: D3 selection object representing the svg group containing the data lines.
- **`lines`**: array of D3 selection objects representing the data lines.
- **`areas`**: array of D3 selection objects representing the areas under the data lines (`null` if the area is undefined).
- **`markers`**: array of D3 selection objects representing the data markers (`null` if the markers are undefined).

For example:

```javascript
var svg = d3.select("#main-svg");
var options = {
    data: [{Day: 1, In: 67.3, Out: 56.5},
            {Day: 2, In: 73.1, Out: 59.1},
            {Day: 3, In: 71.9, Out: 58.7},
            {Day: 4, In: 74.3, Out: 53.3},
            {Day: 5, In: 77.7, Out: 49.2}],
    xkey: "Day"
};
var plt = d3lines.plot(svg, options);
plt.svg.lines.lines[0].style("stroke-width", 4);
```

### Methods

- **`remove()`**: removes the svg group containing the data lines.

For example:

```javascript
var svg = d3.select("#main-svg");
var options = {
    data: [{Day: 1, In: 67.3, Out: 56.5},
            {Day: 2, In: 73.1, Out: 59.1},
            {Day: 3, In: 71.9, Out: 58.7},
            {Day: 4, In: 74.3, Out: 53.3},
            {Day: 5, In: 77.7, Out: 49.2}],
    xkey: "Day"
};
var plt = d3lines.plot(svg, options);
plt.svg.lines.remove();
```

----

## <a name="SVGInteractiveGroup"></a>`d3lines.SVGInteractiveGroup()`

`d3lines.SVGInteractiveGroup` is an object that contains the svg elements related to the chart's interactive behavior.

### Properties

- **`group`**: D3 selection object representing the svg group.
- **`hline`**: D3 selection object representing the horizontal line displayed when hovering over the data (if defined).
- **`vline`**: D3 selection object representing the vertical line displayed when hovering over the data (if defined).
- **`dots`**: array of D3 selection objects representing the dots displayed when hovering over the data (if defined).
- **`box`**: D3 selection object representing the box displayed when hovering over the data (if defined).
- **`text`**: D3 selection object representing the text displayed when hovering over the data (if defined).

### Methods

- **`remove()`**: removes the svg group.

For example:

```javascript
var svg = d3.select("#main-svg");
var options = {
    data: [{Day: 1, In: 67.3, Out: 56.5},
            {Day: 2, In: 73.1, Out: 59.1},
            {Day: 3, In: 71.9, Out: 58.7},
            {Day: 4, In: 74.3, Out: 53.3},
            {Day: 5, In: 77.7, Out: 49.2}],
    xkey: "Day"
};
var plt = d3lines.plot(svg, options);
plt.svg.interactive.remove();
```