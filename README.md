# d3lines

**d3lines** is a JavaScript library to display simple line charts on your website. 
<a href="http://d3js.org/">**D3**</a> is an amazing data visualization library that allows you to display data with stunningly beautiful visuals. 
But sometimes, what you need to display can be very simple, like a line chart. This is where **d3lines** can help.
**d3lines** is a simple wrapper around **D3** that allows you to create a beautiful line chart with *just a few lines of codes*.
It is designed for simplicity.

## Installing

Because **d3lines** uses **D3.v3**, you need to include the following two scripts:

```html
    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script src="https://d3js.org/d3-time.v1.min.js"></script>
```

Then, once you download **d3lines**, just include the script on your page:

```html
<script src="d3lines.js"></script>
```

or the minified version:

```html
<script src="d3lines.min.js"></script>
```

## Getting started with your first chart

First, make sure you have an `svg` tag on your webpage. For example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,300,400' rel='stylesheet' type='text/css'>
    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script src="https://d3js.org/d3-time.v1.min.js"></script>
    <script src="d3lines.js"></script>
    <style>
        svg {
            font-family: 'Open Sans', Palatino;
            font-weight: 300;
        }
    </style>
</head>
<body>
    <svg id="main-svg"></svg>
</body>
```

Then, you need some data to display. For example:

```javascript
var data = [{x: 0, y: 0},
            {x: 0.262, y: 0.259},
            {x: 0.524, y: 0.5},
            {x: 0.785, y: 0.707},
            {x: 1.047, y: 0.866},
            {x: 1.309, y: 0.966},
            {x: 1.571, y: 1},
            {x: 1.833, y: 0.966},
            {x: 2.094, y: 0.866},
            {x: 2.356, y: 0.707},
            {x: 2.618, y: 0.5},
            {x: 2.88, y: 0.259},
            {x: 3.142, y: 0},
            {x: 3.403, y: -0.259},
            {x: 3.665, y: -0.5},
            {x: 3.927, y: -0.707},
            {x: 4.189, y: -0.866},
            {x: 4.451, y: -0.966},
            {x: 4.712, y: -1},
            {x: 4.974, y: -0.966},
            {x: 5.236, y: -0.866},
            {x: 5.498, y: -0.707},
            {x: 5.76, y: -0.5},
            {x: 6.021, y: -0.259},
            {x: 6.283, y: -0}];
```

And finally, here is the code to make the plot:

```javascript
// Select the svg tag where you want the plot to appear
var svg = d3.select("#main-svg");

var options = {
    // Specify what data you are plotting
    data: data,
    // Specify which of the two data `keys` ("x" or "y" in this case but it could be anything) will appear on the x-axis
    xkey: "x",
};

// Make the plot
d3lines.plot(svg, options);
```

That's it!! It's that simple. You have a beautiful plot on your webpage, the rest is just tweaking a few options to make it look exactly the way you like it.

<img src="/images/basic_sine.png" width="200">
