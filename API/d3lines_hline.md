## <a name="hline"></a>`d3lines.hline(svg, y, [xscale, yscale, options])`

Draws a horizontal line inside an `svg` element at a given `y` value.
This method returns a D3 selection object of the created line.

#### Examples

- 

    ```javascript
    var svg = d3.select("#main-svg");
    var h = d3lines.hline(svg, 0.5);
    ```

-

     ```javascript
    var svg = d3.select("#main-svg");
    var plt = d3lines.plot(svg);
    var h = d3lines.hline(svg, 0.5, plt.scale.x, plt.scale.y);
    ```   

### Arguments

- **`svg`**: D3 selection object of an `svg` tag. The line will be appended to the svg tag.
- **`y`**: the y-value at which you want to draw a line. If `yscale` is undefined, 0 represents the bottom of the svg tag and 1 represents the top.

### Optional arguments

- **`xscale`**: [`d3.scale`](https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md#d3scale-scales) object for the x-axis. 
- **`yscale`**: [`d3.scale`](https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md#d3scale-scales) object for the y-axis.
- **`options`**: an object with the following optional properties:
    - **`line_color`**: specifies the color of the line (see [**`line_color`**](d3lines_plot_lines.md#plot_option_line_color) for color options)
    - **`line_width`**: specifies the width of the line
    - **`line_style`**: specifies the style of the line (see [**`line_style`**](d3lines_plot_lines.md#plot_option_line_style) for style options)

## <a name="vline"></a>`d3lines.vline(svg, x, [xscale, yscale, options])`

Draws a vertical line inside an `svg` element at a given `x` value.
This method returns a D3 selection object of the created line.

#### Examples

- 

    ```javascript
    var svg = d3.select("#main-svg");
    var v = d3lines.vline(svg, 0.5);
    ```

- 

    ```javascript
    var svg = d3.select("#main-svg");
    var plt = d3lines.plot(svg);
    var v = d3lines.vline(svg, 0.5, plt.scale.x, plt.scale.y);
    ```

### Arguments

- **`svg`**: D3 selection object of an `svg` tag. The line will be appended to the svg tag.
- **`x`**: the x-value at which you want to draw a line. If `xscale` is undefined, 0 represents the left of the svg tag and 1 represents the right.

### Optional arguments

- **`xscale`**: [`d3.scale`](https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md#d3scale-scales) object for the x-axis. 
- **`yscale`**: [`d3.scale`](https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md#d3scale-scales) object for the y-axis.
- **`options`**: an object with the following optional properties:
    - **`line_color`**: specifies the color of the line (see [**`line_color`**](d3lines_plot_lines.md#plot_option_line_color) for color options)
    - **`line_width`**: specifies the width of the line
    - **`line_style`**: specifies the style of the line (see [**`line_style`**](d3lines_plot_lines.md#plot_option_line_style) for style options)


    
