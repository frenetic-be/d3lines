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
