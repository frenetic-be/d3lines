var d3lines = (function () {

    var scaleType = {
        LINEAR: "LINEAR",
        LOG: "LOG",
        TIME: "TIME"
    };

    // Default values
    var DEFAULT_DATA_SANITIZATION = true,

        DEFAULT_PLOT_TYPE = "line",

        DEFAULT_WIDTH = 800,
        DEFAULT_HEIGHT = 500,
        DEFAULT_MARGINS = {
            top: 30,
            right: 70,
            bottom: 50,
            left: 70
        },

        DEFAULT_LINE_YAXIS = "left",
        DEFAULT_LINE_COLOR = ["blue", "red", "limegreen", "magenta", "cyan",
                              "black", "orange"],
        DEFAULT_LINE_WIDTH = 1.5,
        DEFAULT_LINE_WIDTH_SCATTER = 0.,
        DEFAULT_LINE_STYLE = "-",
        DEFAULT_LINE_FILL = "none",
        DEFAULT_LINE_FILL_OPACITY = 1.0,
        DEFAULT_LINE_INTERPOLATION = "linear",
        DEFAULT_MARKER = "",
        DEFAULT_MARKER_SCATTER = ["o", "s", "v", "d", "^", "+"],
        DEFAULT_MARKER_FILL = "white",
        DEFAULT_MARKER_FILL_SCATTER = ["#ddf", "#fdd", "#ded", "#fdf", "#dff",
                                       "#ddd", "#fed"],
        DEFAULT_MARKER_FILL_OPACITY = 1.0,
        DEFAULT_MARKER_FILL_OPACITY_SCATTER = 1.0,
        DEFAULT_MARKER_STROKE_WIDTH = 1.0,
        DEFAULT_MARKER_SIZE = 8,

        // TICKS
        DEFAULT_XTICKS,
        DEFAULT_YTICKS,
        DEFAULT_Y2TICKS,

        DEFAULT_XTICK_FORMAT,
        DEFAULT_YTICK_FORMAT,
        DEFAULT_Y2TICK_FORMAT,

        DEFAULT_XTICK_ROTATION = 0,
        DEFAULT_YTICK_ROTATION = 0,
        DEFAULT_Y2TICK_ROTATION = 0,

        // BOX AND GRID
        DEFAULT_BOX = true,
        DEFAULT_XGRID = false,
        DEFAULT_XGRID_COLOR = "#BBB",
        DEFAULT_XGRID_WIDTH = 0.5,
        DEFAULT_XGRID_LINESTYLE = ":",

        DEFAULT_YGRID = false,
        DEFAULT_YGRID_COLOR = "#BBB",
        DEFAULT_YGRID_WIDTH = 0.5,
        DEFAULT_YGRID_LINESTYLE = ":",

        DEFAULT_Y2GRID = false,
        DEFAULT_Y2GRID_COLOR = "#BBB",
        DEFAULT_Y2GRID_WIDTH = 0.5,
        DEFAULT_Y2GRID_LINESTYLE = ":",

        // LEGEND
        DEFAULT_LEGEND = true,
        DEFAULT_LEGEND_FONT_SIZE = "0.875em",
        DEFAULT_LEGEND_FONT_COLOR,
        DEFAULT_LEGEND_FONT_FAMILY,
        DEFAULT_LEGEND_FILL = "white",
        DEFAULT_LEGEND_FILL_OPACITY = 1,
        DEFAULT_LEGEND_BORDER_COLOR = "#777",
        DEFAULT_LEGEND_BORDER_WIDTH = 1,
        DEFAULT_LEGEND_BORDER_STYLE = "-",
        DEFAULT_LEGEND_POSITION = "top left",

        // AXES
        DEFAULT_TITLE = "",
        DEFAULT_XLIM = 1.0,
        DEFAULT_YLIM = 1.05,
        DEFAULT_Y2LIM = 1.05,
        DEFAULT_XLABEL = "",
        DEFAULT_YLABEL = "",
        DEFAULT_Y2LABEL = "",
        DEFAULT_XLABEL_OFFSET = 0,
        DEFAULT_YLABEL_OFFSET = 0,
        DEFAULT_Y2LABEL_OFFSET = 0,
        DEFAULT_AXES_FONT_SIZE = "1em",
        DEFAULT_AXES_FONT_COLOR,
        DEFAULT_AXES_FONT_FAMILY,
        DEFAULT_AXES_COLOR = "#777",
        DEFAULT_AXES_WIDTH = 1,
        DEFAULT_AXES_FILL = "none",
        DEFAULT_AXES_FILL_OPACITY = 1,
        DEFAULT_AXES_LINESTYLE = "-",

        // INTERACTIVE PLOT
        DEFAULT_INTERACTIVE = true;
        DEFAULT_INTERACTIVE_OPTIONS = {

            snap_axis: "x",

            line: true,
            line_style: "-",
            line_width: 1,
            line_color: "#777",

            dots: true,
            dot_radius: 5,

            textbox: true,
            box_border_color: "none",
            box_border_width: 1,
            box_border_style: "-",
            box_fill: "#ffb4b4",
            box_padding: 10,
            box_fill_opacity: 0.95,
            font_size: "1em",
            font_color: "black",
            font_family: "",

            output_string: function(pt){
                var arr = [];
                Object.keys(pt).forEach(function(key, index){
                    arr.push(key+": "+pt[key]);
                });
                return arr.join("<br>");
            },

            zoom: true,
        };

    var LINE_COLOR, LINE_WIDTH, LINE_STYLE, LINE_FILL, LINE_FILL_OPACITY,
        LINE_INTERPOLATION, MARKER, MARKER_FILL, MARKER_FILL_OPACITY,
        MARKER_STROKE_WIDTH, MARKER_SIZE, LINE_YAXIS, PLOT_TYPE;

    /// Checks if an object is undefined or not
    function objectExists(object) {
        return (object !== undefined && object !== null);
    }

    /// Checks if a variable can be converted to a float
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // Check if a variable is a function
    function isFunction(obj) {
        var getType = {};
        return obj && getType.toString.call(obj) === "[object Function]";
    }

    // Check if a variable is a String
    function isString(obj){
        return typeof obj === "string" || obj instanceof String;
    }

    /// Attempts to convert string to a Date, returns undefined if unsuccessfull
    function toDate(str) {
        try {
            var date = new Date(str);
            if (isNaN(date.getTime())) return;
            return date;
        } catch(err) {
            return;
        }
    }

    /// Checks if a variable is an array
    function isArray(object) {
        return Object.prototype.toString.call(object) == "[object Array]";
    }

    /// Checks if `object` has property `key` and returns the corresponding
    /// value or a default value.
    function getValue(object, key, defaultValue, deleteValue){
        if (arguments.length < 4) deleteValue = true;

        if (!objectExists(object)) {
            return defaultValue;
        }
        if (!object.hasOwnProperty(key)) {
            return defaultValue;
        }
        var out = object[key];
        if (deleteValue) delete object[key];
        return out;
    }

    function getType(object){
        if (isNumeric(object)) return "float";
        if (isArray(object)) return "array";
        return typeof object;
    }

    function copyOptions(options){
        var out = {};
        if (!objectExists(options)) return options;
        var keys = Object.keys(options);
        if (keys.length === 0 ||
            isString(options) ||
            options instanceof Data) {
                return options;
        }
        if (isArray(options)){
            out = [];
            options.forEach(function(option, index){
                out.push(copyOptions(option));
            });
            return out;
        }
        keys.forEach(function(key){
            out[key] = copyOptions(options[key])
        });
        return out;
    }

    // DATA HANDLING
    function Data(data) {
        if (!objectExists(data)) {
            this.data = data;
            return;
        }
        if ( !(this instanceof Data) )
            return new Data(data);

        var typeData = getType(data);
        if (typeData === "array"){
            if (data.length != 0){
                var type = getType(data[0]);
                var all = data.reduce(function(total, row){
                    return total && getType(row) === type;
                });
                if (!all) throw TypeError("Data has mixed types");
                if (type === "object") {
                    this.data = data;
                } else if (type === "array") {
                    // transform array of arrays into array of dictionaries
                    var data2 = [];
                    data.forEach(function(row, jrow){
                        data2.push({});
                        row.forEach(function(item, jitem){
                            data2[jrow]["y"+ (jitem + 1)] = item
                        });
                    });
                    this.data = data2;
                } else if (type === "float"){
                    // transform array of float into array of dictionaries
                    var data2 = [];
                    data.forEach(function(row){
                        data2.push({y: row});
                    });
                    this.data = data2;
                } else {
                    throw TypeError("Data type is not supported");
                }
            }
        } else if (typeData === "object"){
            var data2 = [];
            var keys = Object.keys(data);
            var nitems;
            keys.forEach(function(key, jkey){
                if (!isArray(data[key])){
                    throw TypeError("Data type is not supported");
                } else {
                    if (jkey === 0) {
                        nitems = data[key].length
                    } else {
                        if (data[key].length !== nitems) {
                            throw TypeError("Inconsistent number of elements " +
                                            "for different keys");
                        }
                    }
                    data[key].forEach(function(item, jitem){
                        if (jkey === 0) {
                            data2.push({});
                        }
                        data2[jitem][key] = item
                    });
                }
            });
            this.data = data2;
        } else {
            throw TypeError("Data type is not supported");
        }
    }

    Data.prototype.toString = function() {
        return "[object d3lines.Data]"
    }

    Data.prototype.transpose = function(lineNameKey, xkey){

        if (!objectExists(lineNameKey)) lineNameKey = "";
        if (!objectExists(xkey)) xkey = lineNameKey;
        if (xkey === "") xkey = "x";

        var data = this.data;
        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        if (data.length === 0) return;

        var data2 = [], rowName;
        data.forEach(function(row, jrow){
            rowName = row[lineNameKey];
            var keys = Object.keys(data[0]).filter(function(key){
                return key.trim() !== lineNameKey;
            });
            keys.forEach(function(key, jkey){
                if (jrow === 0) {
                    data2.push({});
                    data2[jkey][xkey] = key;
                }
                data2[jkey][rowName] = row[key];
            });
        });
        return new Data(data2);
    }

    /// Attempt to sanitize DATA
    Data.prototype.sanitize = function(){

        var data = this.data;
        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        // Remove empty elements
        data = data.filter(function(d){return Object.keys(d).length > 0})

        if (data.length === 0) return;

        // Get the keys from the first element and remove empty keys
        var keys = Object.keys(data[0]).filter(function(key){
            return key.trim() !== "";
        });
        // Get the data types from the first element
        var types = [];
        keys.forEach(function(key){
            if (typeof(data[0][key]) === "object"){
                types.push("object");
            } else if (isNumeric(data[0][key]) ||
                       (typeof(data[0][key]) === "string" &&
                        data[0][key].trim() === "")) {
                types.push("float");
            } else if (objectExists(toDate(data[0][key]))) {
                types.push("date");
            } else {
                types.push("string");
            }
        });

        var data2 = [], row2, allNaNs;
        data.forEach(function(row){
            row2 = {};
            allNaNs = true;
            keys.forEach(function(key, index){
                var type = types[index];
                switch (type) {
                    case "object":
                        if (row[key] == null) {
                            row2[key] = NaN
                        } else {
                            row2[key] = row[key];
                            allNaNs = false;
                        }
                        break;
                    case "string":
                    case "float":
                        if (!isNumeric(row[key])){
                            row2[key] = NaN;
                        } else {
                            if (typeof(row[key]) === "string" &&
                                row[key].trim() === ""){
                                    row2[key] = NaN;
                            } else {
                                row2[key] = parseFloat(row[key]);
                                allNaNs = false;
                            }
                        }
                        break;
                    case "date":
                        var date = toDate(row[key]);
                        if (!objectExists(date)){
                            row2[key] = NaN;
                        } else {
                            row2[key] = date;
                            allNaNs = false;
                        }
                        break;
                    default:
                        break;
                }
            });
            if (!allNaNs) {
                data2.push(row2);
            }
        });
        return new Data(data2);
    }

    /// Attempt to sanitize DATA
    Data.prototype.removeNaNColumns = function(){

        var data = this.data;
        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        if (data.length === 0) return;

        // Get the keys from the first element and remove empty keys
        var keys = Object.keys(data[0]);

        for (dataIndex in data){
            row = data[dataIndex];
            keys.forEach(function(key, index){
                if (typeof row[key] !== "number" || !isNaN(row[key])) {
                    delete keys[keys.indexOf(key)];
                }
            });
            if (keys.every(function (x){return !objectExists(x)})) break;
        }

        keys = keys.filter(objectExists);

        if (keys.length === 0) return new Data(data);
        var data2 = [];
        for (dataIndex in data){
            row = data[dataIndex];
            keys.forEach(function(key, index){
                delete row[key];
            });
            data2.push(row);
        }
        return new Data(data2);
    }

    Data.prototype.sample = function(start, end){

        var data = this.data;
        if (arguments.length == 1) {
            end = start;
            start = 0;
        } else if (arguments.length == 0) {
            start = 0;
            end = 5;
        }

        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        if (data.length === 0) return;

        var data2 = [], keys = [];
        data.forEach(function(row, jrow){
            if (jrow == 0) {
                keys = Object.keys(data[0]).filter(function(key){
                    return key.trim() !== "";
                });
            }
            var row2 = {};
            keys.slice(start, end).forEach(function(key, jkey){
                row2[key] = row[key];
            });
            data2.push(row2);
        });
        return new Data(data2);
    }

    Data.prototype.selectColumns = function(columns){

        var data = this.data;

        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        if (data.length === 0 ||
            !objectExists(columns) ||
            !isArray(columns)) return;

        var data2 = [], keys = [];
        data.forEach(function(row, jrow){
            if (jrow == 0) {
                keys = Object.keys(data[0]).filter(function(key){
                    return columns.indexOf(key) != -1;
                });
            }
            var row2 = {};
            keys.forEach(function(key, jkey){
                row2[key] = row[key];
            });
            data2.push(row2);
        });
        return new Data(data2);
    }

    Data.prototype.ignoreColumns = function(columns){

        var data = this.data;

        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        if (data.length === 0 ||
            !objectExists(columns) ||
            !isArray(columns)) return;

        var data2 = [], keys = [];
        data.forEach(function(row, jrow){
            if (jrow == 0) {
                keys = Object.keys(data[0]).filter(function(key){
                    return columns.indexOf(key) == -1
                });
            }
            var row2 = {};
            keys.forEach(function(key, jkey){
                row2[key] = row[key];
            });
            data2.push(row2);
        });
        return new Data(data2);
    }

    Data.prototype.filterColumns = function(filterFunc){

        var data = this.data;

        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        if (data.length === 0) return;

        var data2 = [], keys = [];
        data.forEach(function(row, jrow){
            if (jrow == 0) {
                keys = Object.keys(data[0]).filter(filterFunc);
            }
            var row2 = {};
            keys.forEach(function(key, jkey){
                row2[key] = row[key];
            });
            data2.push(row2);
        });
        return new Data(data2);
    }

    Data.prototype.renameColumns = function(nameDict){

        var data = this.data;

        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        if (typeof(nameDict) !== "object") {
            throw TypeError("Argument should be a dictionary")
        }

        if (data.length === 0) return;

        var data2 = [], keys = [];
        data.forEach(function(row, jrow){
            keys = Object.keys(row);
            var row2 = {};
            keys.forEach(function(key, jkey){
                if (nameDict.hasOwnProperty(key)) {
                    row2[nameDict[key]] = row[key];
                } else {
                    row2[key] = row[key];
                }
            });
            data2.push(row2);
        });
        return new Data(data2);
    }

    Data.prototype.map = function(mapDict){

        var data = this.data;

        if (!objectExists(data)) return;

        if (!isArray(data)) {
            throw TypeError("The data should be an array of dictionaries.")
        }

        if (typeof(mapDict) !== "object") {
            throw TypeError("Argument should be a dictionary")
        }

        if (data.length === 0) return;

        var data2 = [], keys = [];
        data.forEach(function(row, jrow){
            keys = Object.keys(row);
            var row2 = {};
            keys.forEach(function(key, jkey){
                if (mapDict.hasOwnProperty(key)) {
                    row2[key] = mapDict[key](row[key]);
                } else {
                    row2[key] = row[key];
                }
            });
            data2.push(row2);
        });
        return new Data(data2);
    }

    ///////////////////////
    /// SVGGroup objects ///
    ///////////////////////

    function SVGGroup(group){
        this.group = group;
    }

    SVGGroup.prototype.remove = function(){
        var object = this;
        if (object === undefined) return;
        if (object.group !== undefined) {
            object.group.remove()
            object.group = undefined;
        }
    }

    SVGGroup.prototype.append = function(arg){
        var object = this;
        if (object.group !== undefined) {
            object.group.append(arg)
        }
    }

    function SVGLinesGroup(group, lines, areas, markers){
        // if user accidentally omits the new keyword, this will
        // silently correct the problem...
        if ( !(this instanceof SVGLinesGroup) )
            return new SVGLinesGroup(group, lines, areas, markers);

        SVGGroup.call(this, group);
        this.lines = lines;
        this.areas = areas;
        this.markers = markers;
    }

    SVGLinesGroup.prototype = Object.create(SVGGroup.prototype);
    SVGLinesGroup.prototype.constructor = SVGLinesGroup;

    SVGLinesGroup.prototype.remove = function(){
        SVGGroup.prototype.remove.call(this)
        this.lines = undefined;
        this.areas = undefined;
        this.markers = undefined;
    }

    function SVGAxesLabelGroup(group, x, y, y2){
        // if user accidentally omits the new keyword, this will
        // silently correct the problem...
        if ( !(this instanceof SVGAxesLabelGroup) )
            return new SVGAxesLabelGroup(group, x, y, y2);

        SVGGroup.call(this, group);
        this.x = x;
        this.y = y;
        this.y2 = y2;
    }

    SVGAxesLabelGroup.prototype = Object.create(SVGGroup.prototype);
    SVGAxesLabelGroup.prototype.constructor = SVGAxesLabelGroup;

    SVGAxesLabelGroup.prototype.remove = function(){
        SVGGroup.prototype.remove.call(this)
        this.x = undefined;
        this.y = undefined;
        this.y2 = undefined;
    }

    function SVGAxesGroup(group, x, y, y2, title, labels){
        // if user accidentally omits the new keyword, this will
        // silently correct the problem...
        if ( !(this instanceof SVGAxesGroup) )
            return new SVGAxesGroup(group, x, y, y2, title, labels);

        SVGGroup.call(this, group);
        this.x = x;
        this.y = y;
        this.y2 = y2;
        this.title = title
        if (labels === undefined){
            this.labels = new SVGAxesLabelGroup()
        } else {
            this.labels = labels;
        }
    }

    SVGAxesGroup.prototype = Object.create(SVGGroup.prototype);
    SVGAxesGroup.prototype.constructor = SVGAxesGroup;

    SVGAxesGroup.prototype.remove = function(){
        SVGAxesLabelGroup.prototype.remove.call(this.labels)
        SVGGroup.prototype.remove.call(this)
        this.x = undefined;
        this.y = undefined;
        this.y2 = undefined;
        this.labels = undefined;
    }

    function SVGLegendGroup(group){
        // if user accidentally omits the new keyword, this will
        // silently correct the problem...
        if ( !(this instanceof SVGLegendGroup) )
            return new SVGLegendGroup(group);

        SVGGroup.call(this, group);
    }

    SVGLegendGroup.prototype = Object.create(SVGGroup.prototype);
    SVGLegendGroup.prototype.constructor = SVGLegendGroup;

    function SVGBoxGroup(group, rect){
        // if user accidentally omits the new keyword, this will
        // silently correct the problem...
        if ( !(this instanceof SVGBoxGroup) )
            return new SVGBoxGroup(group, rect);

        SVGGroup.call(this, group);
        this.rect = rect;
    }

    SVGBoxGroup.prototype = Object.create(SVGGroup.prototype);
    SVGBoxGroup.prototype.constructor = SVGBoxGroup;

    SVGBoxGroup.prototype.remove = function(){
        SVGGroup.prototype.remove.call(this)
        this.rect = undefined;
    }

    function SVGInteractiveGroup(group, hline, vline, dots, box, text){
        // if user accidentally omits the new keyword, this will
        // silently correct the problem...
        if ( !(this instanceof SVGInteractiveGroup) )
            return new SVGInteractiveGroup(group, hline, vline, dots, box,
                                           text);

        SVGGroup.call(this, group);
        this.hline = hline;
        this.vline = vline;
        this.dots = dots;
        this.box = box;
        this.text = text;
    }

    SVGInteractiveGroup.prototype = Object.create(SVGGroup.prototype);
    SVGInteractiveGroup.prototype.constructor = SVGInteractiveGroup;

    SVGInteractiveGroup.prototype.remove = function(){
        SVGGroup.prototype.remove.call(this)
        this.hline = undefined;
        this.vline = undefined;
        this.dots = undefined;
        this.box = undefined;
        this.text = undefined;
    }

    function SVGChart(svg){
        // if user accidentally omits the new keyword, this will
        // silently correct the problem...
        if ( !(this instanceof SVGChart) )
            return new SVGChart(svg);

        this.main = svg;
        this.axes = new SVGAxesGroup();
        this.box = new SVGBoxGroup();
        this.lines = new SVGLinesGroup();
        this.legend = new SVGLegendGroup();
        this.interactive = new SVGInteractiveGroup();
    }

    SVGChart.prototype.removeAll = function(){
        this.axes.remove();
        this.box.remove();
        this.lines.remove();
        this.legend.remove();
        this.interactive.remove();
        var node = this.main.node();
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    }

    function Chart(svg){
        if (arguments.length < 1){
            throw TypeError("d3lines.Chart takes 1 argument: a d3.Selection of an svg tag.")
        }
        if ( !(this instanceof Chart) )
            return new Chart(svg);

        this.options = {};
        this.width = undefined;
        this.height = undefined;
        this.margins = {};
        this.xaxis = undefined;
        this.yaxis = undefined;
        this.y2axis = undefined;
        this.line_options = [];
        this.scale = {};
        this.svg = new SVGChart(svg);
    }

    Chart.prototype.copy = function(other){
        if (!other instanceof Chart){
            throw TypeError("You can only copy a d3lines.Chart object");
        }
        this.options = copyOptions(other.options)
        this.width = other.width;
        this.height = other.height;
        this.margins = copyOptions(other.margins);
        this.xaxis = other.xaxis;
        this.yaxis = other.yaxis;
        this.y2axis = other.y2axis;
        this.line_options = copyOptions(other.line_options);
        var scale = this.scale;
        Object.keys(other.scale).forEach(function(key){
            scale[key] = other.scale[key];
        });
        this.svg = other.svg;
    }

    Chart.prototype.redrawXAxis = function(refreshStyle){
        var self = this;
        if (objectExists(self.svg.axes.x) && objectExists(self.xaxis)) {
            self.svg.axes.x.call(self.xaxis)
        }
        if (!objectExists(refreshStyle)) refreshStyle = true;
        if (refreshStyle){
            setAxesStyle(self.svg.main, self.options);
            createGrid(self.svg.main, self.options, self.scale.hasOwnProperty("y2"));
        }
    }

    Chart.prototype.redrawYAxis = function(refreshStyle){
        var self = this;
        if (objectExists(self.svg.axes.y) && objectExists(self.yaxis)) {
            self.svg.axes.y.call(self.yaxis)
        }
        if (!objectExists(refreshStyle)) refreshStyle = true;
        if (refreshStyle){
            setAxesStyle(self.svg.main, self.options);
            createGrid(self.svg.main, self.options, self.scale.hasOwnProperty("y2"));
        }
    }

    Chart.prototype.redrawY2Axis = function(refreshStyle){
        var self = this;
        if (objectExists(self.svg.axes.y2) && objectExists(self.y2axis)) {
            self.svg.axes.y2.call(self.y2axis)
        }
        if (!objectExists(refreshStyle)) refreshStyle = true;
        if (refreshStyle){
            setAxesStyle(self.svg.main, self.options);
            createGrid(self.svg.main, self.options, self.scale.hasOwnProperty("y2"));
        }
    }

    Chart.prototype.redrawLine = function(index){
        var self = this;
        if (!objectExists(self.svg.lines.lines)){
            return;
        }
        var line = self.svg.lines.lines[index];
        var options = self.line_options[index];
        var area = self.svg.lines.areas[index];
        var markers = self.svg.lines.markers[index];
        if (options.hasOwnProperty("x") && (options.hasOwnProperty("y") || options.hasOwnProperty("y2"))) {
            data = Array(options.x.length);
        } else {
            return;
        }
        function definition(d, i){
            if (options.hasOwnProperty("x") && isNaN(options.x[i])) return false;
            if (options.hasOwnProperty("y") && isNaN(options.offset_y[i])) return false;
            if (options.hasOwnProperty("y2") && isNaN(options.offset_y2[i])) return false;
            return true;
        }
        var linegen = lineGen(self.scale.x, self.scale.y, self.scale.y2, options);
        linegen.defined(definition);
        line.attr("d", linegen(data));
        if (objectExists(area)) {
            var newArea = d3.svg.area()
                .x(linegen.x())
                .y(linegen.y())
                .y0(self.scale.y.range()[0])
                .defined(definition)
                .interpolate(options.interpolation);
            area.attr("d", newArea);
        }
        if (objectExists(markers)) {
            markers.selectAll("path").attr("transform", function(d, i) {return "translate(" + (linegen.x())(d, i) + "," + (linegen.y())(d, i) + ")"; })
        }


    }

    Chart.prototype.redrawLines = function(){
        var self = this;
        if (!objectExists(self.svg.lines.lines) ||
            !objectExists(self.svg.lines.areas) ||
            !objectExists(self.svg.lines.markers)){
            return;
        }
        if (isArray(self.svg.lines.lines) &&
            isArray(self.svg.lines.areas) &&
            isArray(self.svg.lines.markers) &&
            self.line_options.length !== self.svg.lines.lines.length &&
            self.svg.lines.areas.length !== self.svg.lines.lines.length &&
            self.svg.lines.markers.length !== self.svg.lines.lines.length) {
                return;
        }
        var lines = self.svg.lines.lines;
        lines.forEach(function(line, index){
            self.redrawLine(index);
        });
    }

    Chart.prototype.redraw = function(){
        var self = this;
        if (!self.scale.hasOwnProperty("original_x") ||
            !self.scale.hasOwnProperty("original_y") ||
            !self.scale.hasOwnProperty("x") ||
            !self.scale.hasOwnProperty("y") ||
            !objectExists(self.svg.lines.lines) ||
            !objectExists(self.svg.lines.areas) ||
            !objectExists(self.svg.lines.markers)){
            return;
        }
        self.redrawXAxis(false);
        self.redrawYAxis(false);
        self.redrawY2Axis(false);
        setAxesStyle(self.svg.main, self.options);
        createGrid(self.svg.main, self.options, self.scale.hasOwnProperty("y2"));
        self.redrawLines();
    }

    Chart.prototype.reset = function(){
        var self = this;
        if (self.scale.hasOwnProperty("original_x") && self.scale.hasOwnProperty("x")) {
            self.scale.x.domain([self.scale.original_x.domain()[0], self.scale.original_x.domain()[1]])
        }
        if (self.scale.hasOwnProperty("original_y") && self.scale.hasOwnProperty("y")) {
            self.scale.y.domain([self.scale.original_y.domain()[0], self.scale.original_y.domain()[1]])
        }
        if (self.scale.hasOwnProperty("original_y2") && self.scale.hasOwnProperty("y2")) {
            self.scale.y2.domain([self.scale.original_y2.domain()[0], self.scale.original_y2.domain()[1]])
        }
        self.redraw();
    }

    ///////////////////////

    function lineGen(xscale, yscale, y2scale, line) {
        return d3.svg.line()
            .x(function(d, i) {
                if (line.hasOwnProperty("x")) return xscale(line.x[i]);
                return xscale(i);
            })
            .y(function(d, i) {
                if (line.hasOwnProperty("y")) return yscale(line.offset_y[i]);
                if (line.hasOwnProperty("y2")) return y2scale(line.offset_y2[i]);
                return yscale(i);
            })
            .interpolate(line.interpolation);
    }

    // Creates a vertical line
    function vline(svg, x, xscale, yscale, options) {
        if (!objectExists(xscale)){
            paddingLeft = parseFloat(window.getComputedStyle(svg.node()).paddingLeft);
            paddingRight = parseFloat(window.getComputedStyle(svg.node()).paddingRight);
            xscale = d3.scale.linear()
                .range([-paddingLeft, svg.node().clientWidth-paddingRight])
                .domain([0, 1]);
        }
        if (!objectExists(yscale)){
            paddingTop = parseFloat(window.getComputedStyle(svg.node()).paddingTop);
            paddingBottom = parseFloat(window.getComputedStyle(svg.node()).paddingBottom);
            yscale = d3.scale.linear()
                .range([svg.node().clientHeight-paddingBottom, -paddingTop])
                .domain([0, 1]);

        }
        LINE_COLOR = getValue(options, "line_color", "#777", false);
        LINE_WIDTH = getValue(options, "line_width", 1, false);
        LINE_STYLE = getValue(options, "line_style", "-", false);
        return svg.append("line")
                    .attr("x1", xscale(x))
                    .attr("y1", yscale.range()[0])
                    .attr("x2", xscale(x))
                    .attr("y2", yscale.range()[1])
                    .style("stroke", LINE_COLOR)
                    .style("stroke-width", LINE_WIDTH)
                    .style("stroke-dasharray", dashArray(LINE_STYLE));
    }

    // Creates a horizontal line
    function hline(svg, y, xscale, yscale, options) {
        if (!objectExists(xscale)){
            paddingLeft = parseFloat(window.getComputedStyle(svg.node()).paddingLeft);
            paddingRight = parseFloat(window.getComputedStyle(svg.node()).paddingRight);
            xscale = d3.scale.linear()
                .range([-paddingLeft, svg.node().clientWidth-paddingRight])
                .domain([0, 1]);
        }
        if (!objectExists(yscale)){
            paddingTop = parseFloat(window.getComputedStyle(svg.node()).paddingTop);
            paddingBottom = parseFloat(window.getComputedStyle(svg.node()).paddingBottom);
            yscale = d3.scale.linear()
                .range([svg.node().clientHeight-paddingBottom, -paddingTop])
                .domain([0, 1]);

        }
        LINE_COLOR = getValue(options, "line_color", "#777", false);
        LINE_WIDTH = getValue(options, "line_width", 1, false);
        LINE_STYLE = getValue(options, "line_style", "-", false);
        return svg.append("line")
                    .attr("x1", xscale.range()[0])
                    .attr("y1", yscale(y))
                    .attr("x2", xscale.range()[1])
                    .attr("y2", yscale(y))
                    .style("stroke", LINE_COLOR)
                    .style("stroke-width", LINE_WIDTH)
                    .style("stroke-dasharray", dashArray(LINE_STYLE));
    }

    // Create a legend
    function buildLegend(g) {
        g.each(function() {
            var g= d3.select(this),
                items = {},
                svg = d3.select(g.property("nearestViewportElement")),
                legendPadding = parseFloat(g.attr("data-style-padding") || 5)
                lb = g.selectAll(".legend-box").data([true]);

            lb.enter().append("rect").classed("legend-box", true);

            svg.selectAll("[data-legend]").each(function() {
                var self = d3.select(this);
                var key = self.attr("data-legend")
                while (items.hasOwnProperty(key)) {
                    var splitems = key.split("-");
                    var root = key;
                    var index = 2;
                    if (splitems.length > 1 &&
                        isNumeric(splitems[splitems.length - 1])){
                            index = parseFloat(splitems[splitems.length - 1])+1;
                            root = splitems.slice(0, splitems.length - 1).join("-");
                    }
                    key = root+"-"+index;
                }
                items[key] = {
                    pos : self.attr("data-legend-pos") || this.getBBox().y,
                    line_color: self.attr("data-line-color") !== "none" ? self.attr("data-line-color") : self.attr("data-line-fill"),
                    line_width: self.attr("data-line-width"),
                    line_style: self.attr("data-line-style"),
                    marker: self.attr("data-marker"),
                    marker_fill: self.attr("data-marker-fill"),
                    marker_fill_opacity: self.attr("data-marker-fill-opacity"),
                    marker_size: self.attr("data-marker-size"),
                    marker_stroke_width: self.attr("data-marker-stroke-width"),
                    symbol: symbolType(self.attr("data-marker"), 6) !== "" ? symbolType(self.attr("data-marker"), 6)() : null,

                };
              });

            items = d3.entries(items).sort(function(a, b) {
                return a.value.pos - b.value.pos;
            });

            var legend = g.append("g")
                .attr("class", "legend-items")

            var emSize = parseFloat(window.getComputedStyle(legend[0][0]).getPropertyValue("font-size"));

            var legendRect = legend
                .selectAll("g")
                .data(items);

            var legendRow = legendRect.enter()
                .append("g")
                .attr("transform", function(d, i){
                  return "translate(0, " + (i * 1.2*emSize) + ")";
                });

            legendRow.append("line")
                .attr("x2", "1.5em")
                .attr("y1", "-0.38em")
                .attr("y2", "-0.38em")
                .style("fill", "none")
                .style("stroke", function(d){return d.value.line_color;})
                .style("stroke-width", function(d){return d.value.line_width;})
                .style("stroke-dasharray", function(d){
                    return dashArray(d.value.line_style);
                });

            legendRow.append("path")
                .attr("d", function(d){return d.value.symbol})
                .attr("transform", function(d, i){
                  return "translate(" + (0.75*emSize) + ", " + (-0.38*emSize) + ")";
                })
                .style("stroke", function(d){return d.value.line_color;})
                .style("fill", function(d){
                    return d.value.marker_fill === "color" ? d.value.line_color : d.value.marker_fill;
                })
                .style("fill-opacity", function(d){
                    return d.value.marker_fill_opacity
                })
                .style("stroke-width", function(d){
                    return d.value.marker_stroke_width
                });

            legendRow.append("text")
                .attr("x", "2em")
                .text(function (d) {
                    return d.key;
                });

            // Reposition and resize the box
            var lbbox = legend[0][0].getBBox();
            legend.attr("transform", "translate(" + (-lbbox.x+legendPadding) + "," + (-lbbox.y+legendPadding)+")");
            lb.attr("x", 0)
              .attr("y", 0)
              .attr("height", (lbbox.height + 2*legendPadding))
              .attr("width", (lbbox.width + 2*legendPadding));
          })
          return g;
    }

    // Sets the axis limits
    function setAxisLimits(data, lines, axis, layoutType, scale, hold) {
        // Arguments:
        //  - data: data array
        //  - lines: line array
        //  - axis: "x", "y" or "y2"
        //  - layoutType: a float (1.0 for tight layout, 1.02 is a good number) or
        //                  an array with the two axes limits
        //  - scale: for example, xscale = d3.scale.linear()

        if (isNumeric(layoutType)) {
        // axes limits are defined by a factor with respect to data. A factor of 1
        // is a tight layout.
            if (layoutType <= 0){
                throw "ValueError: `layoutType` should be a strictly positive number."
            }
            var minData, maxData, minRange, maxRange;
            if (!objectExists(data)) {
                minData = 0;
                maxData = 1;
            } else {
                switch (axis) {
                    case "x":
                        lines.forEach(function(line){
                            if (line.hasOwnProperty("x")) {
                                // If line.x is defined, that's the data to use
                                minData = d3.min([minData, d3.min(line.x)]);
                                maxData = d3.max([maxData, d3.max(line.x)]);
                            } else {
                                // if neither x nor xkey are defined, use the number of points in y for xaxis
                                minData = 0;
                                maxData = data.length;
                            }
                        });
                        break;
                    case "y":
                        lines.forEach(function(line){
                            if (line.hasOwnProperty("y")) {
                                // If line.offset_y is defined, that's the data to use
                                minData = d3.min([minData, d3.min(line.offset_y)]);
                                maxData = d3.max([maxData, d3.max(line.offset_y)]);
                            }
                        });
                        break;
                    case "y2":
                        lines.forEach(function(line){
                            if (line.hasOwnProperty("y2")) {
                                // If line.offset_y2 is defined, that's the data to use
                                minData = d3.min([minData, d3.min(line.offset_y2)]);
                                maxData = d3.max([maxData, d3.max(line.offset_y2)]);
                            }
                        });
                        break;
                    default:
                        break;
                }
            }
            if (!objectExists(minData)) {
                minData = 0;
            }
            if (!objectExists(maxData)) {
                maxData = 1;
            }
            if (hold) {
                minData = d3.min([minData, scale.domain()[0]]);
                maxData = d3.max([maxData, scale.domain()[1]]);
            }
            if (scale.type === scaleType.LOG && !(minData instanceof Date) && !(maxData instanceof Date)){
                if (minData < 0. || maxData < 0.) {
                    throw "ValueError: Cannot use a logarithmic scale with negative data"
                }
                var oldRange = Math.log10(maxData)-Math.log10(minData);
                var midData = Math.log10(minData)+oldRange / 2.0;
                var newRange = oldRange * layoutType;
                minRange = Math.pow(10, midData-newRange / 2.0);
                maxRange = Math.pow(10, midData+newRange / 2.0);
            } else if (scale.type === scaleType.LOG && minData instanceof Date && maxData instanceof Date){
                if (minData < 0. || maxData < 0.) {
                    throw "ValueError: Cannot use a logarithmic scale with negative data"
                }
                var oldRange = Math.log10(maxData.getTime())-Math.log10(minData.getTime());
                var midData = Math.log10(minData) + oldRange / 2.0;
                var newRange = oldRange * layoutType;
                minRange = new Date(Math.pow(10, midData - newRange / 2.0));
                maxRange = new Date(Math.pow(10, midData + newRange / 2.0));
            } else if (minData instanceof Date && maxData instanceof Date){
                var oldRange = maxData.getTime() - minData.getTime();
                var midData = minData.getTime() + oldRange / 2.0;
                var newRange = oldRange * layoutType;
                minRange = new Date(midData-newRange/2.0);
                maxRange = new Date(midData+newRange/2.0);
            } else {
                var oldRange = maxData - minData;
                var midData = minData+oldRange / 2.0;
                var newRange = oldRange * layoutType;
                minRange = midData - newRange / 2.0;
                maxRange = midData + newRange / 2.0;
            }
        } else if (isArray(layoutType) && layoutType.length == 2) {
            minRange = layoutType[0];
            maxRange = layoutType[1];
            if (!isNumeric(minRange) || !isNumeric(maxRange)) {
                throw TypeError("`layoutType` should be a two-element float array");
            }
        } else {
            throw TypeError("`layoutType` should be a strictly-positive float or a two-element float array");
        }
        scale.domain([minRange, maxRange]);
    }

    // Transforms a style string into a dash array pattern that d3 can understand
    function dashArray(style){
        switch(style) {
            case ":":
            case "dotted":
                return "1 1";
            case "-":
            case "solid":
                return "";
            case "--":
            case "dashed":
                return "3 3";
            case "-.":
            case "dash-dot":
                return "5 2 1 2";
            default:
                return style;
        }
    }

    // Transforms a symbol string into a d3 svg symbol
    function symbolType(symbol, size){
        var newSize = DEFAULT_MARKER_SIZE*DEFAULT_MARKER_SIZE
        if (isNumeric(size)) {
            newSize = size*size;
        } else if (isFunction(size)) {
            newSize = function(d, i){return size(d, i)*size(d, i);};
        }
        switch(symbol) {
            case "o":
            case "circle":
                return d3.svg.symbol().type("circle").size(newSize);
            case "+":
            case "cross":
                return d3.svg.symbol().type("cross").size(newSize);
            case "d":
            case "diamond":
                return d3.svg.symbol().type("diamond").size(newSize);
            case "s":
            case "square":
                return d3.svg.symbol().type("square").size(newSize);
            case "^":
            case "triangle-up":
                return d3.svg.symbol().type("triangle-up").size(newSize);
            case "v":
            case "triangle-down":
                return d3.svg.symbol().type("triangle-down").size(newSize);
            default:
                return "";
        }
    }

    // Get a default line property
    function getDefaultLineProperty(prop, line_index) {
        if (isArray(prop)) return prop[line_index % prop.length];
        return prop;
    }

    // Returns a new line dictionary
    function newLine(lineOptions, line_index) {
        var line = {};
        if (objectExists(lineOptions)) {
            Object.keys(lineOptions).forEach(function(key, index) {
                line[key] = lineOptions[key];
            });
        }
        if (!line.hasOwnProperty("color")) {
            line.color = getDefaultLineProperty(LINE_COLOR, line_index);
        }
        if (!line.hasOwnProperty("width")) {
            line.width = getDefaultLineProperty(LINE_WIDTH, line_index);
        }
        if (!line.hasOwnProperty("style")) {
            line.style = getDefaultLineProperty(LINE_STYLE, line_index);
        }
        if (!line.hasOwnProperty("fill")) {
            line.fill = getDefaultLineProperty(LINE_FILL, line_index);
        }
        if (!line.hasOwnProperty("fill_opacity")) {
            line.fill_opacity = getDefaultLineProperty(LINE_FILL_OPACITY, line_index);
        }
        if (!line.hasOwnProperty("interpolation")) {
            line.interpolation = getDefaultLineProperty(LINE_INTERPOLATION, line_index);
        }
        if (!line.hasOwnProperty("marker")) {
            line.marker = getDefaultLineProperty(MARKER, line_index);
        }
        if (!line.hasOwnProperty("marker_fill")) {
            line.marker_fill = getDefaultLineProperty(MARKER_FILL, line_index);
        }
        if (!line.hasOwnProperty("marker_fill_opacity")) {
            line.marker_fill_opacity = getDefaultLineProperty(MARKER_FILL_OPACITY, line_index);
        }
        if (!line.hasOwnProperty("marker_stroke_width")) {
            line.marker_stroke_width = getDefaultLineProperty(MARKER_STROKE_WIDTH, line_index);
        }
        if (!line.hasOwnProperty("marker_size")) {
            line.marker_size = getDefaultLineProperty(MARKER_SIZE, line_index);
        }
    //         if (!line.hasOwnProperty("xkey")) {
    //             throw "Line does not have an `xkey` property. The `xkey` property should be the names of a field of all data element objects."
    //         }
        if (!line.hasOwnProperty("ykey") && !line.hasOwnProperty("y2key")) {
            throw "Line does not have an `ykey` or `y2key` property. The `ykey` or `y2key` property should be the names of a field of all data element objects.";
        }
        return line;
    }

    function closest_in_lines(value, lines, key) {

        var namekey = "";
        var closest = null;
        var diff = null;
        var closestIndex = null;
        var closestLine = null;

        lines.forEach(function(line, line_index){
            if (line.hasOwnProperty(key)){
                line[key].forEach(function(val, val_index){
                    if (objectExists(val) && !isNaN(val) && (closest === null || Math.abs(val-value) < diff)) {
                        closest = val;
                        closestIndex = val_index;
                        closestLine = line_index;
                        diff = Math.abs(value-closest);
                    }
                });
            }
        });
        var datapoint = {};
        lines.forEach(function(line){
            if (line.hasOwnProperty(key)){
                line[key].forEach(function(val, val_index){
                    if (val === closest ||
                        (val instanceof Date &&
                         closest instanceof Date &&
                         val.getTime() === closest.getTime())) {
                        if (line.hasOwnProperty("xkey") &&
                            !isNaN(line.x[val_index])) datapoint[line.xkey] = line.x[val_index];
                        if (line.hasOwnProperty("ykey") &&
                            !isNaN(line.y[val_index])) datapoint[line.ykey] = line.y[val_index];
                        if (line.hasOwnProperty("y2key") &&
                            !isNaN(line.y2[val_index])) datapoint[line.y2key] = line.y2[val_index];
                    }
                });
            }
        });
        return [datapoint, closestLine, closestIndex];
    }

    function closest_point(x, y, lines, xscale, yscale, y2scale) {

        function distance(ptx, pty, ptx_2, pty_2, scale){
            return Math.sqrt(Math.pow(ptx-xscale(ptx_2), 2) + Math.pow(pty-scale(pty_2), 2));
        }

        var valX,
            valOffsetY,
            valY,
            nameX = "",
            nameY = "",
            closestX = null,
            closestY = null,
            closestScale = null,
            closestIndex = null,
            closestLine = null,
            dist = null,
            scale,
            scaleName = "";

        lines.forEach(function(line, line_index){
            line.x.forEach(function(valX, val_index){
                if (line.hasOwnProperty("y")){
                    valOffsetY = line.offset_y[val_index];
                    valY = line.y[val_index];
                    scale = yscale;
                    scaleName = "y";
                } else {
                    valOffsetY = line.offset_y2[val_index];
                    valY = line.y2[val_index];
                    scale = y2scale;
                    scaleName = "y2";
                }
                if (objectExists(valX) && !isNaN(valX) &&
                    objectExists(valOffsetY) && !isNaN(valOffsetY) &&
                    (closestX === null || distance(x, y, valX, valOffsetY, scale) < dist)) {
                        closestX = valX;
                        closestY = valY;
                        closestIndex = val_index;
                        closestLine = line_index;
                        nameX = line.xkey
                        if (line.hasOwnProperty("y")){
                            nameY = line.ykey
                        } else {
                            nameY = line.y2key
                        }
                        dist = distance(x, y, valX, valOffsetY, scale);
                        closestScale = scaleName;
                }
            });
        });
        var datapoint = {};
        datapoint[nameX] = closestX;
        datapoint[nameY] = closestY;
        return [datapoint, closestLine, closestIndex, closestScale];
    }

    // Reapply style to axes
    function setAxesStyle(svg, options){

        var BOX = getValue(options, "box",
            DEFAULT_BOX, false);

        var AXES_FONT_SIZE = getValue(options, "axes_font_size",
            DEFAULT_AXES_FONT_SIZE, false);
        var AXES_FONT_COLOR = getValue(options, "axes_font_color",
            DEFAULT_AXES_COLOR, false);
        var AXES_FONT_FAMILY = getValue(options, "axes_font_family",
            DEFAULT_AXES_FONT_FAMILY, false);

        var AXES_COLOR = getValue(options, "axes_color", DEFAULT_AXES_COLOR,
            false);
        var AXES_WIDTH = getValue(options, "axes_width", DEFAULT_AXES_WIDTH,
            false);
        var AXES_LINESTYLE = getValue(options, "axes_linestyle",
            DEFAULT_AXES_LINESTYLE, false);

        if (BOX) {
            svg.selectAll(".d3lines-axis path").each(function(){
                var self = d3.select(this);
                self.style("fill", "none")
                    .style("stroke", "none")
            });
        } else {
            svg.selectAll(".d3lines-axis path").each(function(){
                var self = d3.select(this);
                self.style("fill", "none")
                    .style("stroke", AXES_COLOR)
                    .style("stroke-width", AXES_WIDTH)
                    .style("stroke-dasharray", dashArray(AXES_LINESTYLE));
            });
        }

        svg.selectAll(".d3lines-axis line").each(function(){
            var self = d3.select(this);
            if (!self.classed("d3lines-grid")){
                self.style("stroke", AXES_COLOR)
                    .style("stroke-width", AXES_WIDTH)
                    .style("stroke-dasharray", dashArray(AXES_LINESTYLE));
            }
        });

        svg.selectAll(".d3lines-axis text").each(function(){
            var self = d3.select(this);
            self.style("font-size", AXES_FONT_SIZE);
            if (AXES_FONT_COLOR !== undefined) {
                self.style("fill", AXES_FONT_COLOR);
            }
            if (AXES_FONT_FAMILY !== undefined) {
                self.style("font-family", AXES_FONT_FAMILY);
            }
        });
    }

    // Create grids
    function createGrid(svg, options, y2scale_exists){

        if (!objectExists(options)) options = {};
        var WIDTH = getValue(options, "width", DEFAULT_WIDTH, false);
        var HEIGHT = getValue(options, "height", DEFAULT_HEIGHT, false);
        var MARGINS = copyOptions(DEFAULT_MARGINS);
        if (objectExists(options.margins)) {
            Object.keys(options.margins).forEach(function(key) {
                MARGINS[key] = options.margins[key];
            });
        }

        var XGRID = getValue(options, "xgrid", DEFAULT_XGRID, false);
        if (XGRID) {
            var XGRID_COLOR = getValue(options, "xgrid_color",
                DEFAULT_XGRID_COLOR, false);
            var XGRID_WIDTH = getValue(options, "xgrid_width",
                DEFAULT_XGRID_WIDTH, false);
            var XGRID_LINESTYLE = getValue(options, "xgrid_linestyle",
                DEFAULT_XGRID_LINESTYLE, false);
            svg.selectAll(".d3lines-xaxis .tick").each(function(d, i){
                var self = d3.select(this);
                if (self.selectAll("line.d3lines-grid").size() === 0){
                    self.append("line")
                        .attr("class", "d3lines-grid d3lines-xgrid")
                        .attr("y2", -HEIGHT+MARGINS.bottom+MARGINS.top)
                        .style("stroke", XGRID_COLOR)
                        .style("stroke-width", XGRID_WIDTH)
                        .style("stroke-dasharray", dashArray(XGRID_LINESTYLE));
                }
            });
        }

        var YGRID = getValue(options, "ygrid", DEFAULT_YGRID, false);
        if (YGRID) {
            var YGRID_COLOR = getValue(options, "ygrid_color",
                DEFAULT_YGRID_COLOR, false);
            var YGRID_WIDTH = getValue(options, "ygrid_width",
                DEFAULT_YGRID_WIDTH, false);
            var YGRID_LINESTYLE = getValue(options, "ygrid_linestyle",
                DEFAULT_YGRID_LINESTYLE, false);
            svg.selectAll(".d3lines-yaxis .tick").each(function(d, i){
                var self = d3.select(this);
                if (self.selectAll("line.d3lines-grid").size() === 0){
                    self.append("line")
                        .attr("class", "d3lines-grid d3lines-ygrid")
                        .attr("x2", WIDTH-MARGINS.left-MARGINS.right)
                        .style("stroke", YGRID_COLOR)
                        .style("stroke-width", YGRID_WIDTH)
                        .style("stroke-dasharray", dashArray(YGRID_LINESTYLE));
                }
            });
        }

        var Y2GRID = getValue(options, "y2grid", DEFAULT_Y2GRID, false);
        if (y2scale_exists && Y2GRID) {
            var Y2GRID_COLOR = getValue(options, "y2grid_color",
                DEFAULT_Y2GRID_COLOR, false);
            var Y2GRID_WIDTH = getValue(options, "y2grid_width",
                DEFAULT_Y2GRID_WIDTH, false);
            var Y2GRID_LINESTYLE = getValue(options, "y2grid_linestyle",
                DEFAULT_Y2GRID_LINESTYLE, false);
            svg.selectAll(".d3lines-y2axis .tick").each(function(d, i){
                var self = d3.select(this);
                if (self.selectAll("line.d3lines-grid").size() === 0){
                    self.append("line")
                        .attr("class", "d3lines-grid d3lines-y2grid")
                        .attr("x2", -WIDTH+MARGINS.left+MARGINS.right)
                        .style("stroke", Y2GRID_COLOR)
                        .style("stroke-width", Y2GRID_WIDTH)
                        .style("stroke-dasharray", dashArray(Y2GRID_LINESTYLE));
                }
            });
        }

    }

//////////////////////////////////////////////////////////

    // Return an object exposed to the public
    return {

        // Convenience methods
        isArray: isArray,
        isNumeric: isNumeric,
        hline: hline,
        vline: vline,

        // data
        Data: Data,

        // Chart
        Chart: Chart,
        SVGChart: SVGChart,
        SVGGroup: SVGGroup,
        SVGAxesGroup: SVGAxesGroup,
        SVGAxesLabelGroup: SVGAxesLabelGroup,
        SVGBoxGroup: SVGBoxGroup,
        SVGInteractiveGroup: SVGInteractiveGroup,
        SVGLegendGroup: SVGLegendGroup,
        SVGLinesGroup: SVGLinesGroup,

        // plot function
        plot: function(svg, original_options, previousPlot){

            if (!(svg instanceof d3.selection)) throw TypeError("`svg` must be a d3.selection object.")

            var self = this;

            var SVG_ELEMENT = svg.node();

            var HOLD = false;
            if (objectExists(previousPlot) && typeof(previousPlot) == "object") {
                HOLD = true;
            }

            // Initialize plot dictionary
            var plt = new Chart(svg);
            if (HOLD) {
                plt.copy(previousPlot);
            } else {
                plt.options = copyOptions(original_options);
            }

            var LINE_INDEX = 0;
            if (HOLD && isArray(plt.line_options)) LINE_INDEX = plt.line_options.length

            // Throw error if options is defined and is not an object
            if (objectExists(original_options) && typeof(original_options) != "object") {
                throw TypeError("`options` should be an Object");
            }

            // Default configuration
            var options = copyOptions(original_options) || {};

            // Plot type
            PLOT_TYPE = getValue(options, "plot_type", DEFAULT_PLOT_TYPE);

            // DATA
            var DATA = getValue(options, "data");

            if (objectExists(DATA)) {
                // Transform into Data object
                if (!(DATA instanceof Data)) DATA = new Data(DATA);

                // Sanitize data
                var DATA_SANITIZATION = getValue(options, "data_sanitization", DEFAULT_DATA_SANITIZATION);
                if (DATA_SANITIZATION) {
                    DATA = DATA.sanitize();
                }

                // Keep the data dictionary
                DATA = DATA.data;
            }

            // XKEY, YKEY
            var XKEY = getValue(options, "xkey");
            var YKEY = getValue(options, "ykey");

            // LINE SETTINGS
            if (PLOT_TYPE == "scatter"){
                LINE_WIDTH = getValue(options, "line_width", DEFAULT_LINE_WIDTH_SCATTER);
                MARKER = getValue(options, "marker", DEFAULT_MARKER_SCATTER);
                MARKER_FILL = getValue(options, "marker_fill", DEFAULT_MARKER_FILL_SCATTER);
                MARKER_FILL_OPACITY = getValue(options, "marker_fill_opacity", DEFAULT_MARKER_FILL_OPACITY_SCATTER);
            } else {
                LINE_WIDTH = getValue(options, "line_width", DEFAULT_LINE_WIDTH);
                MARKER = getValue(options, "marker", DEFAULT_MARKER);
                MARKER_FILL = getValue(options, "marker_fill", DEFAULT_MARKER_FILL);
                MARKER_FILL_OPACITY = getValue(options, "marker_fill_opacity", DEFAULT_MARKER_FILL_OPACITY);
            }
            LINE_YAXIS = getValue(options, "line_yaxis", DEFAULT_LINE_YAXIS);
            LINE_COLOR = getValue(options, "line_color", DEFAULT_LINE_COLOR);
            LINE_STYLE = getValue(options, "line_style", DEFAULT_LINE_STYLE);
            LINE_FILL = getValue(options, "line_fill", DEFAULT_LINE_FILL);
            LINE_FILL_OPACITY = getValue(options, "line_fill_opacity", DEFAULT_LINE_FILL_OPACITY);
            LINE_INTERPOLATION = getValue(options, "line_interpolation", DEFAULT_LINE_INTERPOLATION);
            MARKER_STROKE_WIDTH = getValue(options, "marker_stroke_width", DEFAULT_MARKER_STROKE_WIDTH);
            MARKER_SIZE = getValue(options, "marker_size", DEFAULT_MARKER_SIZE);

            // LINES
            var LINES = [];
            var xkeys = [], ykeys = [], y2keys = [], keys = [];
            if (objectExists(XKEY)) {
                xkeys.push(XKEY)
                keys.push(XKEY)
            }
            if (objectExists(YKEY)) {
                ykeys.push(YKEY)
                keys.push(YKEY)
            }
            if (objectExists(options.lines)){
                options.lines.forEach(function(line){
                    if (!line.hasOwnProperty("xkey") && objectExists(XKEY)){
                        line.xkey = XKEY;
                    }
                    if (!line.hasOwnProperty("ykey") && !line.hasOwnProperty("y2key") && objectExists(YKEY)){
                        line.ykey = YKEY;
                    }
                    var curLine = newLine(line, LINE_INDEX);
                    LINE_INDEX += 1;
                    if (curLine.hasOwnProperty("xkey") && keys.indexOf(curLine.xkey) == -1){
                        xkeys.push(curLine.xkey);
                        keys.push(curLine.xkey);
                    }
                    if (curLine.hasOwnProperty("ykey") && keys.indexOf(curLine.ykey) == -1){
                        ykeys.push(curLine.ykey);
                        keys.push(curLine.ykey);
                    } else if (keys.indexOf(curLine.y2key) == -1){
                        y2keys.push(curLine.y2key);
                        keys.push(curLine.y2key);
                    }
                    LINES.push(curLine);
                });
                delete options.lines;
            }

            // If no lines were defined, plot all of DATA
            if (LINES.length == 0 && objectExists(DATA)) {
                if (!isArray(DATA)) {
                    throw TypeError("Wrong type for `data`");
                }
                Object.keys(DATA[0]).forEach(function(key){
                    var yaxis = getDefaultLineProperty(LINE_YAXIS, LINE_INDEX);
                    if (!objectExists(XKEY)) {
                        if (yaxis === "right"){
                            LINES.push(newLine({y2key: key}, LINE_INDEX));
                        } else {
                            LINES.push(newLine({ykey: key}, LINE_INDEX));
                        }
                        LINE_INDEX += 1;
                    } else if (key != XKEY){
                        if (yaxis === "right"){
                            LINES.push(newLine({xkey: XKEY, y2key: key}, LINE_INDEX));
                        } else {
                            LINES.push(newLine({xkey: XKEY, ykey: key}, LINE_INDEX));
                        }
                        LINE_INDEX += 1;
                    }
                });
            }
            if (LINES.length > 0 && !objectExists(DATA)) {
                throw TypeError("`data` is undefined.");
            }

            if (LINES.length > 0 && !isArray(DATA)) {
                throw TypeError("Wrong type for `data`");
            }

            if (LINES.length > 0 && DATA.length == 0) {
                throw new ValueError("`data` is empty");
            }

            // Check that all keys exist in the DATA
            if (LINES.length > 0) {
                DATA.forEach(function(element, index){
                    keys.forEach(function(key){
                        if (!element.hasOwnProperty(key)) {
                            throw "Missing key "+ key +" in data element "+ index;
                        }
                    });
                });
            }

            // Create x and y arrays based on xkey and ykey
            LINES.forEach(function(line, line_index){
                if (line.hasOwnProperty("xkey") && !line.hasOwnProperty("x")) {
                    line.x = Array.apply(null, Array(DATA.length))
                                .map(function (_, i) {return DATA[i][line.xkey];})
                } else {
                    line.xkey = "index"
                    line.x = Array.apply(null, Array(DATA.length))
                                .map(function (_, i) {return i;})
                }
                if (line.hasOwnProperty("ykey") && !line.hasOwnProperty("y")) {
                    line.y = Array.apply(null, Array(DATA.length))
                                .map(function (_, i) {return DATA[i][line.ykey];})
                    if (PLOT_TYPE !== "stack" || line_index == LINES.length-1){
                        line.offset_y = Array.apply(null, Array(DATA.length))
                            .map(function (_, i) {return DATA[i][line.ykey];})
                        line.offset_y2 = Array.apply(null, Array(DATA.length))
                            .map(function (_, i) {return 0;})
                    }
                } else if (line.hasOwnProperty("y2key") && !line.hasOwnProperty("y2")) {
                    line.y2 = Array.apply(null, Array(DATA.length))
                                .map(function (_, i) {return DATA[i][line.y2key];})
                    if (PLOT_TYPE !== "stack" || line_index == LINES.length-1){
                        line.offset_y2 = Array.apply(null, Array(DATA.length))
                            .map(function (_, i) {return DATA[i][line.y2key];})
                        line.offset_y = Array.apply(null, Array(DATA.length))
                            .map(function (_, i) {return 0;})
                    }
                }

                // Check that all lines have the following keys: x, xkey, y or y2, ykey or y2key
                if (!line.hasOwnProperty("x")) {
                    throw "ValueError: LINES["+line_index+"] does not have the `x` key";
                }
                if (!line.hasOwnProperty("xkey")) {
                    throw "ValueError: LINES["+line_index+"] does not have the `xkey` key";
                }
                if (!line.hasOwnProperty("y") &&
                    !line.hasOwnProperty("y2")) {
                        throw "ValueError: LINES["+line_index+"] does not have the `y` oy `y2` key";
                }
                if (!line.hasOwnProperty("ykey") &&
                    !line.hasOwnProperty("y2key")) {
                        throw "ValueError: LINES["+line_index+"] does not have the `ykey` oy `y2key` key";
                }
            });

            if (PLOT_TYPE === "stack"){
                for (line_index = LINES.length-2; line_index >= 0; line_index--){
                    var line = LINES[line_index];
                    if (line.hasOwnProperty("y")) {
                        line.offset_y = Array.apply(null, Array(line.y.length))
                            .map(function (_, i) {
                                var offset = LINES[line_index+1].offset_y[i];
                                return line.y[i]+offset;
                        });
                        line.offset_y2 = Array.apply(null, Array(DATA.length))
                            .map(function (_, i) {return 0;})
                    } else if (line.hasOwnProperty("y2")) {
                        line.offset_y2 = Array.apply(null, Array(line.y2.length))
                            .map(function (_, i) {
                                var offset = LINES[line_index+1].offset_y2[i];
                                return line.y2[i]+offset;
                        });
                        line.offset_y = Array.apply(null, Array(DATA.length))
                            .map(function (_, i) {return 0;})
                    }
                }
            }
            // GEOMETRY
            var MARGINS = {};
            if (HOLD) {
                var WIDTH = getValue(plt, "WIDTH", DEFAULT_WIDTH, false);
                var HEIGHT = getValue(plt, "HEIGHT", DEFAULT_HEIGHT, false);
                Object.keys(DEFAULT_MARGINS).forEach(function(key, index) {
                    MARGINS[key] = DEFAULT_MARGINS[key];
                });
                if (objectExists(plt.margins)) {
                    Object.keys(plt.margins).forEach(function(key, index) {
                        MARGINS[key] = plt.margins[key];
                    });
                }
                if (options.hasOwnProperty("width")) delete options["width"]
                if (options.hasOwnProperty("height")) delete options["height"]
                if (options.hasOwnProperty("margins")) delete options["margins"]
            } else {
                var WIDTH = getValue(options, "width", DEFAULT_WIDTH);
                var HEIGHT = getValue(options, "height", DEFAULT_HEIGHT);
                Object.keys(DEFAULT_MARGINS).forEach(function(key, index) {
                    MARGINS[key] = DEFAULT_MARGINS[key];
                });

                if (objectExists(options.margins)) {
                    Object.keys(options.margins).forEach(function(key, index) {
                        MARGINS[key] = options.margins[key];
                    });
                    delete options.margins;
                }
                plt.width = WIDTH;
                plt.height = HEIGHT;
                plt.margins = MARGINS;
            }

            if (WIDTH < MARGINS.left+MARGINS.right) {
                throw "ValueError: `width` should be larger than the sum of the left and right margins."
            }

            if (HOLD){
                if (!plt.scale.hasOwnProperty("x")) plt.scale.x = d3.scale.linear()
                if (!plt.scale.hasOwnProperty("y")) plt.scale.y = d3.scale.linear()

                XSCALE = getValue(plt.scale, "x", d3.scale.linear(), false);
                YSCALE = getValue(plt.scale, "y", d3.scale.linear(), false);
                Y2SCALE = getValue(plt.scale, "y2", undefined, false);
                if (objectExists(options.xscale_type)) delete options.xscale_type;
                if (objectExists(options.yscale_type)) delete options.yscale_type;
                if (objectExists(options.y2scale_type)) delete options.y2scale_type;
            } else {
                // Axis scales
                var XSCALE, YSCALE, Y2SCALE;
                if (objectExists(options.xscale_type)) {
                    if (options.xscale_type == "time") {
                        XSCALE = d3.time.scale();
                        XSCALE.type = scaleType.TIME;
                    } else if (options.xscale_type == "log") {
                        XSCALE = d3.scale.log();
                        XSCALE.type = scaleType.LOG;
                    } else {
                        XSCALE = d3.scale.linear();
                        XSCALE.type = scaleType.LINEAR;
                    }
                    delete options.xscale_type;
                } else {
                    XSCALE = d3.scale.linear();
                    XSCALE.type = scaleType.LINEAR;
                }
                if (objectExists(options.yscale_type)) {
                    if (options.yscale_type == "time") {
                        YSCALE = d3.time.scale();
                        YSCALE.type = scaleType.TIME;
                    } else if (options.yscale_type == "log") {
                        YSCALE = d3.scale.log();
                        YSCALE.type = scaleType.LOG;
                    } else {
                        YSCALE = d3.scale.linear();
                        YSCALE.type = scaleType.LINEAR;
                    }
                    delete options.yscale_type;
                } else {
                    YSCALE = d3.scale.linear();
                    YSCALE.type = scaleType.LINEAR;
                }
                if (objectExists(options.y2scale_type)) {
                    if (options.y2scale_type == "time") {
                        Y2SCALE = d3.time.scale();
                        Y2SCALE.type = scaleType.TIME;
                    } else if (options.y2scale_type == "log") {
                        Y2SCALE = d3.scale.log();
                        Y2SCALE.type = scaleType.LOG;
                    } else {
                        Y2SCALE = d3.scale.linear();
                        Y2SCALE.type = scaleType.LINEAR;
                    }
                    delete options.y2scale_type;
                }
            }

            LINES.forEach(function(line){
                if ((line.hasOwnProperty("y2key")) && !objectExists(Y2SCALE)) {
                    Y2SCALE = d3.scale.linear();
                    Y2SCALE.type = scaleType.LINEAR;
                }
            });

            // TICKS
            var XTICKS = getValue(options, "xticks", DEFAULT_XTICKS);
            var YTICKS = getValue(options, "yticks", DEFAULT_YTICKS);
            var Y2TICKS = getValue(options, "y2ticks", DEFAULT_Y2TICKS);

            var XTICK_FORMAT = getValue(options, "xtick_format", DEFAULT_XTICK_FORMAT);
            var YTICK_FORMAT = getValue(options, "ytick_format", DEFAULT_YTICK_FORMAT);
            var Y2TICK_FORMAT = getValue(options, "y2tick_format", DEFAULT_Y2TICK_FORMAT);

            var XTICK_ROTATION = getValue(options, "xtick_rotation", DEFAULT_XTICK_ROTATION);
            var YTICK_ROTATION = getValue(options, "ytick_rotation", DEFAULT_YTICK_ROTATION);
            var Y2TICK_ROTATION = getValue(options, "y2tick_rotation", DEFAULT_Y2TICK_ROTATION);

            // BOX AND GRID
            var BOX = getValue(options, "box", DEFAULT_BOX);
            var XGRID = getValue(options, "xgrid", DEFAULT_XGRID);
            var XGRID_COLOR = getValue(options, "xgrid_color", DEFAULT_XGRID_COLOR);
            var XGRID_WIDTH = getValue(options, "xgrid_width", DEFAULT_XGRID_WIDTH);
            var XGRID_LINESTYLE = getValue(options, "xgrid_linestyle", DEFAULT_XGRID_LINESTYLE);

            var YGRID = getValue(options, "ygrid", DEFAULT_YGRID);
            var YGRID_COLOR = getValue(options, "ygrid_color", DEFAULT_YGRID_COLOR);
            var YGRID_WIDTH = getValue(options, "ygrid_width", DEFAULT_YGRID_WIDTH);
            var YGRID_LINESTYLE = getValue(options, "ygrid_linestyle", DEFAULT_YGRID_LINESTYLE);

            var Y2GRID = getValue(options, "y2grid", DEFAULT_Y2GRID);
            var Y2GRID_COLOR = getValue(options, "y2grid_color", DEFAULT_Y2GRID_COLOR);
            var Y2GRID_WIDTH = getValue(options, "y2grid_width", DEFAULT_Y2GRID_WIDTH);
            var Y2GRID_LINESTYLE = getValue(options, "y2grid_linestyle", DEFAULT_Y2GRID_LINESTYLE);

            // LEGEND
            var LEGEND = getValue(options, "legend", DEFAULT_LEGEND);
            var LEGEND_FONT_SIZE = getValue(options, "legend_font_size", DEFAULT_LEGEND_FONT_SIZE);
            var LEGEND_FONT_COLOR = getValue(options, "legend_font_color", DEFAULT_LEGEND_FONT_COLOR);
            var LEGEND_FONT_FAMILY = getValue(options, "legend_font_family", DEFAULT_LEGEND_FONT_FAMILY);
            var LEGEND_FILL = getValue(options, "legend_fill", DEFAULT_LEGEND_FILL);
            var LEGEND_FILL_OPACITY = getValue(options, "legend_fill_opacity", DEFAULT_LEGEND_FILL_OPACITY);
            var LEGEND_BORDER_COLOR = getValue(options, "legend_border_color", DEFAULT_LEGEND_BORDER_COLOR);
            var LEGEND_BORDER_WIDTH = getValue(options, "legend_border_width", DEFAULT_LEGEND_BORDER_WIDTH);
            var LEGEND_BORDER_STYLE = getValue(options, "legend_border_style", DEFAULT_LEGEND_BORDER_STYLE);
            var LEGEND_POSITION = getValue(options, "legend_position", DEFAULT_LEGEND_POSITION);
            var LEGEND_LABELS = getValue(options, "legend_labels");

            // AXES
            var TITLE = getValue(options, "title", DEFAULT_TITLE);
            var XLIM = getValue(options, "xlim", DEFAULT_XLIM);
            var YLIM = getValue(options, "ylim", DEFAULT_YLIM);
            var Y2LIM = getValue(options, "y2lim", DEFAULT_Y2LIM);
            var XLABEL = getValue(options, "xlabel", DEFAULT_XLABEL);
            if (XLABEL === "" && objectExists(XKEY)) {
                XLABEL = XKEY;
            }
            var YLABEL = getValue(options, "ylabel", DEFAULT_YLABEL);
            var Y2LABEL = getValue(options, "y2label", DEFAULT_Y2LABEL);
            var XLABEL_OFFSET = getValue(options, "xlabel_offset", DEFAULT_XLABEL_OFFSET);
            var YLABEL_OFFSET = getValue(options, "ylabel_offset", DEFAULT_YLABEL_OFFSET);
            var Y2LABEL_OFFSET = getValue(options, "y2label_offset", DEFAULT_Y2LABEL_OFFSET);
            var AXES_FONT_SIZE = getValue(options, "axes_font_size", DEFAULT_AXES_FONT_SIZE);
            var AXES_FONT_COLOR = getValue(options, "axes_font_color", DEFAULT_AXES_COLOR);
            var AXES_FONT_FAMILY = getValue(options, "axes_font_family", DEFAULT_AXES_FONT_FAMILY);
            var AXES_COLOR = getValue(options, "axes_color", DEFAULT_AXES_COLOR);
            var AXES_WIDTH = getValue(options, "axes_width", DEFAULT_AXES_WIDTH);
            var AXES_FILL = getValue(options, "axes_fill", DEFAULT_AXES_FILL);
            var AXES_FILL_OPACITY = getValue(options, "axes_fill_opacity", DEFAULT_AXES_FILL_OPACITY);
            var AXES_LINESTYLE = getValue(options, "axes_linestyle", DEFAULT_AXES_LINESTYLE);

            // INTERACTIVE PLOT
            var INTERACTIVE = getValue(options, "interactive", DEFAULT_INTERACTIVE);
            var INTERACTIVE_OPTIONS = {};

            Object.keys(DEFAULT_INTERACTIVE_OPTIONS).forEach(function(key, index) {
                if (key === "snap_axis" && PLOT_TYPE === "scatter"){
                    INTERACTIVE_OPTIONS[key] = "both";
                } else {
                    INTERACTIVE_OPTIONS[key] = DEFAULT_INTERACTIVE_OPTIONS[key];
                }
            });

            if (objectExists(options.interactive_options)) {
                Object.keys(options.interactive_options).forEach(function(key, index) {
                    INTERACTIVE_OPTIONS[key] = options.interactive_options[key];
                });
                delete options.interactive_options;
            }

            if (["x", "y", "both"].indexOf(INTERACTIVE_OPTIONS.snap_axis) === -1){
                INTERACTIVE_OPTIONS.snap_axis = "x";
            }

            Object.keys(options).forEach(function(key){
                throw "ValueError: unknown key `"+key+"`";
            });

            /////////////////////////////////////////////////////
            /////////////////////////////////////////////////////
            /////////////////////////////////////////////////////

            // Set SVG width and height
            if (HOLD) {
                setAxisLimits(DATA, LINES, "x", XLIM, XSCALE, HOLD);
                setAxisLimits(DATA, LINES, "y", YLIM, YSCALE, HOLD);
                plt.scale.original_x = XSCALE.copy()
                plt.scale.original_y = YSCALE.copy();
                if (objectExists(Y2SCALE)) {
                    Y2SCALE.range([HEIGHT - MARGINS.bottom, MARGINS.top]);
                    setAxisLimits(DATA, LINES, "y2", Y2LIM, Y2SCALE, HOLD);
                    plt.scale.y2 = Y2SCALE;
                    plt.scale.original_y2 = Y2SCALE.copy()
                }
            } else {
                SVG_ELEMENT.setAttribute("style", "width:"+WIDTH+"px; height:"+HEIGHT+"px");
                SVG_ELEMENT.style.width = WIDTH;
                SVG_ELEMENT.style.height = HEIGHT;

                // Set axes range
                XSCALE.range([MARGINS.left, WIDTH - MARGINS.right]);
                setAxisLimits(DATA, LINES, "x", XLIM, XSCALE);

                YSCALE.range([HEIGHT - MARGINS.bottom, MARGINS.top]);
                setAxisLimits(DATA, LINES, "y", YLIM, YSCALE);

                plt.scale.x = XSCALE;
                plt.scale.original_x = XSCALE.copy()
                plt.scale.y = YSCALE;
                plt.scale.original_y = YSCALE.copy()

                if (objectExists(Y2SCALE)) {
                    Y2SCALE.range([HEIGHT - MARGINS.bottom, MARGINS.top]);
                    setAxisLimits(DATA, LINES, "y2", Y2LIM, Y2SCALE);
                    plt.scale.y2 = Y2SCALE;
                    plt.scale.original_y2 = Y2SCALE.copy()
                }
            }

            // Clip Path
            if (!HOLD){
                plt.svg.clip_path = svg.append("clipPath")
                    .attr("id", "clipPath")
                    .append("rect")
                    .attr("x", MARGINS.left)
                    .attr("y", MARGINS.top)
                    .attr("width", WIDTH-MARGINS.left-MARGINS.right)
                    .attr("height", HEIGHT-MARGINS.top-MARGINS.bottom);
            }

            // Create axes
            if (HOLD){
                var XAXIS = getValue(plt, "XAXIS", d3.svg.axis().scale(XSCALE), false)
            } else {
                var XAXIS = d3.svg.axis()
                    .scale(XSCALE)
                    .outerTickSize(0);
            }
            if (objectExists(XTICKS)) {
                XAXIS.ticks(XTICKS);
            }
            if (objectExists(XTICK_FORMAT)) {
                XAXIS.tickFormat(XTICK_FORMAT);
            }

            if (HOLD){
                var YAXIS = getValue(plt, "YAXIS", d3.svg.axis().scale(YSCALE).orient("left"), false)
            } else {
                var YAXIS = d3.svg.axis()
                    .scale(YSCALE)
                    .orient("left")
                    .outerTickSize(0);
            }

            if (objectExists(YTICKS)) {
                YAXIS.ticks(YTICKS);
            }
            if (objectExists(YTICK_FORMAT)) {
                YAXIS.tickFormat(YTICK_FORMAT);
            }

            if (objectExists(Y2SCALE)) {
                if (HOLD){
                    var Y2AXIS = getValue(plt, "Y2AXIS", d3.svg.axis().scale(Y2SCALE).orient("right"), false)
                } else {
                    var Y2AXIS = d3.svg.axis()
                        .scale(Y2SCALE)
                        .orient("right")
                        .outerTickSize(0);
                }
                if (objectExists(Y2TICKS)) {
                    Y2AXIS.ticks(Y2TICKS);
                }
                if (objectExists(Y2TICK_FORMAT)) {
                    Y2AXIS.tickFormat(Y2TICK_FORMAT);
                }
            }

            // BOX
            var prevBOX = objectExists(plt.svg.box.group)
            if (!BOX) plt.svg.box.remove();
            if (BOX && !prevBOX) {
                plt.svg.box.group = svg.append("g")
                                .attr("class", "d3lines-box")

                plt.svg.box.rect = plt.svg.box.group.append("rect")
                    .attr("x", MARGINS.left)
                    .attr("y", MARGINS.top)
                    .attr("width", WIDTH-MARGINS.left-MARGINS.right)
                    .attr("height", HEIGHT-MARGINS.top-MARGINS.bottom)
                    .style("stroke", AXES_COLOR)
                    .style("stroke-width", AXES_WIDTH)
                    .style("stroke-dasharray", dashArray(AXES_LINESTYLE))
                    .style("fill", AXES_FILL)
                    .style("fill-opacity", AXES_FILL_OPACITY)
            }

            // LINES
            if (!HOLD || !objectExists(plt.svg.lines.lines)) plt.svg.lines.lines = [];
            if (!HOLD || !objectExists(plt.svg.lines.areas)) plt.svg.lines.areas = [];
            if (!HOLD || !objectExists(plt.svg.lines.markers)) plt.svg.lines.markers = [];
            if (!HOLD || !objectExists(plt.line_options)) plt.line_options = [];
            if (!HOLD || !objectExists(plt.svg.lines.group)) {
                plt.svg.lines.group = svg.append("g")
                    .attr("class", "d3lines-lines")
            }

            var legend_label;

            var indexOffset = 0;
            if (HOLD) {
                indexOffset = plt.line_options.length;
            }
            LINES.forEach(function(line, index){

                plt.line_options.push(line)

                function definition(d, i){
                    if (line.hasOwnProperty("x") && isNaN(line.x[i])) return false;
                    if (line.hasOwnProperty("offset_y") && isNaN(line.offset_y[i])) return false;
                    if (line.hasOwnProperty("offset_y2") && isNaN(line.offset_y2[i])) return false;
                    return true;
                }

                var linegen1 = lineGen(XSCALE, YSCALE, Y2SCALE, line);
                linegen1.defined(definition);

                var color = line.color;
                var width = line.width;
                var style = line.style;
                var fill = line.fill;
                var fill_opacity = line.fill_opacity;
                if (line.hasOwnProperty("label")) {
                    legend_label = line.label;
                } else if (objectExists(LEGEND_LABELS)){
                    legend_label = getDefaultLineProperty(LEGEND_LABELS, index+indexOffset)
                } else if (line.hasOwnProperty("ykey")){
                    legend_label = line.ykey;//function(d) { return line.ykey;};
                } else if (line.hasOwnProperty("y2key")){
                    legend_label = line.y2key;//function(d) { return line.y2key;};
                } else {
                    legend_label = "";//function(d) { return "";};
                }

                if (fill === "color"){
                    fill = color;
                }

                if (fill != "none"){
                    var area = d3.svg.area()
                        .x(linegen1.x())
                        .y(linegen1.y())
                        .y0(YSCALE.range()[0])
                        .defined(definition)
                        .interpolate(line.interpolation);

                    plt.svg.lines.areas.push(plt.svg.lines.group.append("path")
                        .datum(DATA)
                        .attr("d", area)
                        .style("fill", fill)
                        .style("fill-opacity", fill_opacity)
                        .attr("clip-path", "url(#clipPath)")

                    );
                } else {
                    plt.svg.lines.areas.push(null);
                }
                plt.svg.lines.lines.push(plt.svg.lines.group.append("svg:path")
                    .attr("d", linegen1(DATA))
                    .attr("clip-path", "url(#clipPath)")
                    .attr("data-legend", legend_label)
                    .attr("data-line-color", color)
                    .attr("data-line-width", width)
                    .attr("data-line-style", style)
                    .attr("data-line-fill", fill)
                    .attr("data-marker", line.marker)
                    .attr("data-marker-fill", line.marker_fill)
                    .attr("data-marker-fill-opacity", line.marker_fill_opacity)
                    .attr("data-marker-stroke-width", line.marker_stroke_width)
                    .attr("data-marker-size", line.marker_size)
                    .attr("data-legend-pos", index+indexOffset)
                    .style("fill", "none")
                    .style("stroke", color)
                    .style("stroke-width", width)
                    .style("stroke-dasharray", dashArray(style))
                );

                // MARKERS
                if (line.marker != "") {
                    var marker_fill = line.marker_fill;
                    if (marker_fill == "color") marker_fill = color;

                    plt.svg.lines.markers.push(plt.svg.lines.group.append("g")
                        .attr("clip-path", "url(#clipPath)")
                        .attr("class", "d3lines-markers"));
                    plt.svg.lines.markers[plt.svg.lines.markers.length - 1]
                        .selectAll(".markersymbols")
                        .data(DATA)
                        .enter().append("path")
                        .attr("d", symbolType(line.marker, line.marker_size))
                        .attr("transform", function(d, i) {return "translate(" + (linegen1.x())(d, i) + "," + (linegen1.y())(d, i) + ")"; })
                        .style("stroke", color)
                        .style("fill", marker_fill)
                        .style("fill-opacity", line.marker_fill_opacity)
                        .style("stroke-width", line.marker_stroke_width);
                } else {
                    plt.svg.lines.markers.push(null);
                }
            });

            if (!objectExists(YLABEL) && plt.svg.lines.lines.length === 1){
                YLABEL = legend_label;
            }

            // AXES
            if (!objectExists(plt.svg.axes.group)) {
                plt.svg.axes.group = svg.append("g")
                    .attr("class", "d3lines-axes")
            }
            if (!HOLD){
                plt.xaxis = XAXIS

                plt.svg.axes.x = plt.svg.axes.group.append("svg:g")
                    .attr("class", "d3lines-axis d3lines-xaxis")
                    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                    .call(XAXIS);

                if (XTICK_ROTATION !== 0) {
                    plt.svg.axes.x.selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", "rotate("+(-(XTICK_ROTATION))+")");
                }

                plt.yaxis = YAXIS
                plt.svg.axes.y = plt.svg.axes.group.append("svg:g")
                    .attr("class", "d3lines-axis d3lines-yaxis")
                    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
                    .call(YAXIS);

                if (YTICK_ROTATION !== 0) {
                    plt.svg.axes.y.selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "0em")
                        .attr("dy", "-0.4em")
                        .attr("transform", "rotate("+(-(YTICK_ROTATION))+")");
                }

                if (objectExists(Y2SCALE)) {
                    plt.y2axis = Y2AXIS
                    plt.svg.axes.y2 = plt.svg.axes.group.append("svg:g")
                        .attr("class", "d3lines-axis d3lines-y2axis")
                        .attr("transform", "translate(" + (WIDTH-MARGINS.right) + ",0)")
                        .call(Y2AXIS);

                    if (Y2TICK_ROTATION !== 0) {
                        plt.svg.axes.y2.selectAll("text")
                            .style("text-anchor", "start")
                            .attr("dx", "0em")
                            .attr("dy", "-0.1em")
                            .attr("transform", "rotate("+((Y2TICK_ROTATION))+")");
                    }
                }

                // Set axes style
                setAxesStyle(svg, original_options);

                // GRID
                createGrid(svg, original_options, objectExists(Y2SCALE));

                // TITLE
                if (objectExists(TITLE)) {
                    plt.svg.axes.title = plt.svg.axes.group.append("text")
                        .attr("text-anchor", "middle")
                        .attr("x", WIDTH / 2)
                        .attr("y", MARGINS.top-10)
                        .text(TITLE)
                        .style("font-size", AXES_FONT_SIZE);

                    if (AXES_FONT_COLOR !== undefined) {
                        plt.svg.axes.title.style("fill", AXES_FONT_COLOR);
                    }
                    if (AXES_FONT_FAMILY !== undefined) {
                        plt.svg.axes.title.style("font-family", AXES_FONT_FAMILY);
                    }
                }

                // XLABEL
                plt.svg.axes.labels.group = plt.svg.axes.group.append("g")
                    .attr("class", "d3lines-label");
                if (objectExists(XLABEL)) {
                    plt.svg.axes.labels.x = plt.svg.axes.labels.group.append("text")
                        .attr("text-anchor", "middle")
                        .attr("x", WIDTH / 2)
                        .attr("y", HEIGHT+XLABEL_OFFSET - 5)
                        .text(XLABEL)
                        .style("font-size", AXES_FONT_SIZE);

                    if (AXES_FONT_COLOR !== undefined) {
                        plt.svg.axes.labels.x.style("fill", AXES_FONT_COLOR);
                    }
                    if (AXES_FONT_FAMILY !== undefined) {
                        plt.svg.axes.labels.x.style("font-family", AXES_FONT_FAMILY);
                    }
                }

                // YLABEL
                if (objectExists(YLABEL)) {
                    plt.svg.axes.labels.y = plt.svg.axes.labels.group.append("text")
                        .attr("text-anchor", "middle")
                        .attr("x", -HEIGHT / 2)
                        .attr("y", -YLABEL_OFFSET)
                        .attr("dy", ".75em")
                        .attr("transform", "rotate(-90)")
                        .text(YLABEL)
                        .style("font-size", AXES_FONT_SIZE);

                    if (AXES_FONT_COLOR !== undefined) {
                        plt.svg.axes.labels.y.style("fill", AXES_FONT_COLOR);
                    }
                    if (AXES_FONT_FAMILY !== undefined) {
                        plt.svg.axes.labels.y.style("font-family", AXES_FONT_FAMILY);
                    }
                }

                // Y2LABEL
                if (objectExists(Y2LABEL)) {
                    plt.svg.axes.labels.y2 = plt.svg.axes.labels.group.append("text")
                        .attr("text-anchor", "middle")
                        .attr("x", HEIGHT / 2)
                        .attr("y", -WIDTH-Y2LABEL_OFFSET)
                        .attr("dy", ".75em")
                        .attr("transform", "rotate(90)")
                        .text(Y2LABEL)
                        .style("font-size", AXES_FONT_SIZE);

                    if (AXES_FONT_COLOR !== undefined) {
                        plt.svg.axes.labels.y2.style("fill", AXES_FONT_COLOR);
                    }
                    if (AXES_FONT_FAMILY !== undefined) {
                        plt.svg.axes.labels.y2.style("font-family", AXES_FONT_FAMILY);
                    }
                }
            }

            if (HOLD) {
                plt.redraw();
                LINES = plt.line_options;
            }

            // INTERACTIVE plot
            plt.svg.interactive.remove();
            if (LINES.length > 0 && INTERACTIVE) {

                var minX = XSCALE.domain()[0];
                var maxX = XSCALE.domain()[1];
                var minY = YSCALE.domain()[0];
                var maxY = YSCALE.domain()[1];

                plt.svg.interactive.group = svg.append("g")
                    .attr("class", "d3lines-interactive");

                // LINE FOR MOUSEOVER
                if (getValue(INTERACTIVE_OPTIONS, "line", false)) {
                    var MOUSETIP_VLINE = vline(plt.svg.interactive.group, minX, XSCALE, YSCALE);
                    MOUSETIP_VLINE.attr("class", "d3lines-interactive-vline")
                        .attr("clip-path", "url(#clipPath)")
                        .style("stroke-dasharray", dashArray(INTERACTIVE_OPTIONS.line_style))
                        .style("stroke", INTERACTIVE_OPTIONS.line_color)
                        .style("stroke-width", INTERACTIVE_OPTIONS.line_width)
                        .style("display", "none");
                    plt.svg.interactive.vline = MOUSETIP_VLINE;
                    var MOUSETIP_HLINE = hline(plt.svg.interactive.group, minY, XSCALE, YSCALE);
                    MOUSETIP_HLINE.attr("class", "d3lines-interactive-hline")
                        .attr("clip-path", "url(#clipPath)")
                        .style("stroke-dasharray", dashArray(INTERACTIVE_OPTIONS.line_style))
                        .style("stroke", INTERACTIVE_OPTIONS.line_color)
                        .style("stroke-width", INTERACTIVE_OPTIONS.line_width)
                        .style("display", "none");
                    plt.svg.interactive.hline = MOUSETIP_HLINE;
                }

                // DOTS FOR MOUSEOVER
                if (getValue(INTERACTIVE_OPTIONS, "dots", false)) {
                    if (!HOLD || !objectExists(plt.svg.interactive.dots)){
                        plt.svg.interactive.dots = [];
                    }
                    var dot_group = plt.svg.interactive.group.append("g")
                        .attr("clip-path", "url(#clipPath)");

                    LINES.forEach(function(line, index){
                        plt.svg.interactive.dots.push(dot_group.append("circle")
                                        .attr("r", INTERACTIVE_OPTIONS.dot_radius)
                                        .style("fill", line.color)
                                        .style("display", "none"));
                    });
                    var MOUSETIP_DOTS = plt.svg.interactive.dots;
                }

                // BOX FOR TEXT
                if (getValue(INTERACTIVE_OPTIONS, "textbox", false)) {

                    var MOUSETIP_BOX = plt.svg.interactive.group.append("rect")
                                        .attr("x", 0)
                                        .attr("y", 0)
                                        .attr("width", 50)
                                        .attr("height", 50)
                                        .style("stroke", INTERACTIVE_OPTIONS.box_border_color)
                                        .style("stroke-width", INTERACTIVE_OPTIONS.box_border_width)
                                        .style("stroke-dasharray", dashArray(INTERACTIVE_OPTIONS.box_border_style))
                                        .style("fill", INTERACTIVE_OPTIONS.box_fill)
                                        .style("fill-opacity", INTERACTIVE_OPTIONS.box_fill_opacity)
                                        .style("display", "none");
                    plt.svg.interactive.box = MOUSETIP_BOX;

                    // TEXT
                    var MOUSETIP_TEXT = plt.svg.interactive.group.append("text")
                                        .attr("x", 0)
                                        .attr("y", 0)
                                        .style("display", "none")
                                        .style("fill", INTERACTIVE_OPTIONS.font_color)
                                        .style("font-size", INTERACTIVE_OPTIONS.font_size)
                                        .style("font-family", INTERACTIVE_OPTIONS.font_family);
                    plt.svg.interactive.text = MOUSETIP_TEXT;
                }

                var MOUSEPOS;

                // Mouse over
                function mouseHasMoved(mousePos){
//                     if (!objectExists(event)) return;
//                     EVENT = event;

                    // Calculate datapoint
//                     var style = getComputedStyle(SVG_ELEMENT);
//                     var offsetLeft = SVG_ELEMENT.parentNode.offsetLeft +
//                         parseFloat(style.marginLeft) +
//                         parseFloat(style.paddingLeft) +
//                         parseFloat(style.borderLeftWidth);
//                     var offsetTop = SVG_ELEMENT.parentNode.offsetTop +
//                         parseFloat(style.marginTop) +
//                         parseFloat(style.paddingTop) +
//                         parseFloat(style.borderTopWidth);
//                     var x0 = event.pageX - offsetLeft;
//                     var y0 = event.pageY - offsetTop;
                    if (!objectExists(mousePos)) {
                        mousePos = d3.mouse(this);
                    }

                    MOUSEPOS = mousePos;
                    var x0 = mousePos[0];
                    var y0 = mousePos[1];

                    var norm_x = (x0 - MARGINS.left) / (WIDTH - MARGINS.left - MARGINS.right);
                    var norm_y = 1 - (y0-MARGINS.top) / (HEIGHT - MARGINS.top - MARGINS.bottom);

                    if (objectExists(MOUSETIP_VLINE)) {
                        MOUSETIP_VLINE.style("display", "none");
                    }
                    if (objectExists(MOUSETIP_HLINE)) {
                        MOUSETIP_HLINE.style("display", "none");
                    }
                    if (objectExists(MOUSETIP_BOX) && objectExists(MOUSETIP_TEXT)) {
                        MOUSETIP_BOX.style("display", "none");
                        MOUSETIP_TEXT.style("display", "none");
                    }
                    if (objectExists(MOUSETIP_DOTS)) {
                        MOUSETIP_DOTS.forEach(function(dot){
                            dot.style("display", "none");
                        });
                    }

                    if (norm_x < 0 || norm_x > 1 || norm_y < 0 || norm_y > 1) {
                        return;
                    }
                    var hlinePos, vlinePos;
                    if (INTERACTIVE_OPTIONS.snap_axis == "x") {

                        var data_x = XSCALE.invert(x0);

                        var closest = closest_in_lines(data_x, LINES,
                            INTERACTIVE_OPTIONS.snap_axis);
                        var datapoint = closest[0];
                        var closest_line = closest[1];
                        var closest_index = closest[2];
                        vlinePos = XSCALE(LINES[closest_line].x[closest_index]);
                        if (objectExists(MOUSETIP_VLINE)) {
                            MOUSETIP_VLINE.attr("x1", vlinePos)
                                         .attr("x2", vlinePos)
                                         .style("display", "block");
                        }
                    } else if (INTERACTIVE_OPTIONS.snap_axis == "y") {

                        var data_y = YSCALE.invert(y0);

                        var closest = closest_in_lines(data_y, LINES, "offset_y");
                        var datapoint = closest[0];
                        var closest_line = closest[1];
                        var closest_index = closest[2];
                        hlinePos = YSCALE(LINES[closest_line].offset_y[closest_index])
                        if (objectExists(MOUSETIP_HLINE)) {
                            MOUSETIP_HLINE.attr("y1", hlinePos)
                                         .attr("y2", hlinePos)
                                         .style("display", "block");
                        }
                    } else if (INTERACTIVE_OPTIONS.snap_axis == "both"){
//                         var data_x = XSCALE.invert(x0);
//                         var data_y = YSCALE.invert(y0);

                        var closest = closest_point(x0, y0, LINES, XSCALE, YSCALE, Y2SCALE);
                        var datapoint = closest[0];
                        var closest_line = closest[1];
                        var closest_index = closest[2];
                        var snap_scale = closest[3];
                        vlinePos = XSCALE(LINES[closest_line].x[closest_index]);
                        if (objectExists(MOUSETIP_VLINE)) {
                            MOUSETIP_VLINE.attr("x1", vlinePos)
                                .attr("x2", vlinePos)
                                .style("display", "block");
                        }
                        if (snap_scale === "y"){
                            hlinePos = YSCALE(LINES[closest_line].offset_y[closest_index])
                        } else if (snap_scale === "y2" && objectExists(Y2SCALE)){
                            hlinePos = Y2SCALE(LINES[closest_line].offset_y2[closest_index])
                        }
                        if (objectExists(MOUSETIP_HLINE)) {
                            if (snap_scale === "y"){
                                MOUSETIP_HLINE.attr("y1", hlinePos)
                                    .attr("y2", hlinePos)
                                    .style("display", "block");
                            } else if (snap_scale === "y2" && objectExists(Y2SCALE)){
                                MOUSETIP_HLINE.attr("y1", hlinePos)
                                    .attr("y2", hlinePos)
                                    .style("display", "block");
                            }
                        }
                    }
                    if (objectExists(MOUSETIP_DOTS)) {

                        for (index = LINES.length-1; index >= 0; index--) {
                            var line = LINES[index];
                            if (datapoint.hasOwnProperty(line.xkey) &&
                                isNaN(datapoint[line.xkey])) {
                                    MOUSETIP_DOTS[index].style("display", "none");
                            } else if (line.hasOwnProperty("ykey") &&
                                datapoint.hasOwnProperty(line.ykey) &&
                                isNaN(datapoint[line.ykey])) {
                                    MOUSETIP_DOTS[index].style("display", "none");
                            } else if (line.hasOwnProperty("y2key") &&
                                datapoint.hasOwnProperty(line.y2key) &&
                                isNaN(datapoint[line.y2key])) {
                                    MOUSETIP_DOTS[index].style("display", "none");
                            } else if (!datapoint.hasOwnProperty(line.ykey) &&
                                !datapoint.hasOwnProperty(line.y2key)){
                                    MOUSETIP_DOTS[index].style("display", "none");
                            } else if (PLOT_TYPE === "stack" &&
                                line.hasOwnProperty("ykey") &&
                                isNaN(line.offset_y[closest_index])) {
                                    MOUSETIP_DOTS[index].style("display", "none");
                            } else if (PLOT_TYPE === "stack" &&
                                line.hasOwnProperty("y2key") &&
                                isNaN(line.offset_y2[closest_index])) {
                                    MOUSETIP_DOTS[index].style("display", "none");
                            } else {
                                if (PLOT_TYPE === "stack"){
                                        MOUSETIP_DOTS[index]
                                            .attr("cx", XSCALE(datapoint[line.xkey]))
                                        if (line.hasOwnProperty("ykey")){
                                            MOUSETIP_DOTS[index]
                                                .attr("cy", YSCALE(line.offset_y[closest_index]));
                                        } else {
                                            MOUSETIP_DOTS[index]
                                                .attr("cy", Y2SCALE(line.offset_y2[closest_index]));
                                        }
                                } else {
                                    MOUSETIP_DOTS[index]
                                        .attr("cx", XSCALE(datapoint[line.xkey]))
                                    if (line.hasOwnProperty("ykey")){
                                        MOUSETIP_DOTS[index]
                                                .attr("cy", YSCALE(datapoint[line.ykey]));
                                    } else {
                                        MOUSETIP_DOTS[index]
                                                .attr("cy", Y2SCALE(datapoint[line.y2key]));
                                    }
                                }
                                MOUSETIP_DOTS[index].style("display", "block");
                            }
                        };
                    }

                    // Set the mousetip text
                    var str = INTERACTIVE_OPTIONS.output_string(datapoint);

                    if (objectExists(MOUSETIP_BOX) && objectExists(MOUSETIP_TEXT)) {
                        MOUSETIP_TEXT.text("");
                        var lineHeight = parseFloat(getComputedStyle(MOUSETIP_TEXT[0][0]).fontSize);
                        var textPosX = objectExists(vlinePos) ? vlinePos : x0;
                        var textPosY = objectExists(hlinePos) ? hlinePos : y0;
                        str.split(new RegExp("<br ?/?>")).forEach(function(line, index){
                            MOUSETIP_TEXT.append("tspan")
                                .text(line)
                                .attr("x", textPosX + 10 + INTERACTIVE_OPTIONS.box_padding)
                                .attr("y", textPosY + 10 + INTERACTIVE_OPTIONS.box_padding + lineHeight)
                                .attr("dy", (index * 1.2) + "em");
                        });
                        MOUSETIP_TEXT.style("display", "block");

                        // Set the width, height and position of the mousetipbox
                        var textbox = MOUSETIP_TEXT[0][0].getBBox();
                        var newHeight = textbox.height + 2 * INTERACTIVE_OPTIONS.box_padding;
                        var newWidth = textbox.width + 2 * INTERACTIVE_OPTIONS.box_padding;
                        if (HEIGHT-newHeight < y0 + 10){
                            MOUSETIP_BOX.attr("y", HEIGHT-newHeight);
                            var tspans = MOUSETIP_TEXT.selectAll("tspan");
                            tspans.each(function(d, i){
                                d3.select(tspans[0][i]).attr("y", HEIGHT-newHeight+INTERACTIVE_OPTIONS.box_padding+lineHeight);
                            });
                        } else {
                            MOUSETIP_BOX.attr("y", textPosY + 10);
                        }
                        if (WIDTH-newWidth < x0+10){
                            MOUSETIP_BOX.attr("x", WIDTH-newWidth);
                            var tspans = MOUSETIP_TEXT.selectAll("tspan");
                            tspans.each(function(d, i){
                                d3.select(tspans[0][i]).attr("x", WIDTH-newWidth+INTERACTIVE_OPTIONS.box_padding);
                            });
                        } else {
                            MOUSETIP_BOX.attr("x", textPosX + 10);
                        }
                        MOUSETIP_BOX.attr("width", newWidth)
                                    .attr("height", newHeight)
                                    .style("display", "block");
                    }
                }

                svg.on("mousemove", mouseHasMoved);

                if (INTERACTIVE_OPTIONS.zoom) {
                    svg.call(d3.behavior.zoom()
                                .x(XSCALE)
                                .y(YSCALE)
                                .on("zoom", function () {
                        if (objectExists(Y2SCALE)){
                            var yd = YSCALE.domain();
                            var yp0 = plt.scale.original_y(yd[0]);
                            var yp1 = plt.scale.original_y(yd[1]);
                            var y2d = []
                            y2d.push(plt.scale.original_y2.invert(yp0))
                            y2d.push(plt.scale.original_y2.invert(yp1))
                            Y2SCALE.domain(y2d);
                        }
                        plt.redraw();
                        mouseHasMoved(MOUSEPOS);
                    }));
                }

            }

            plt.svg.legend.remove();
            // LEGEND
            if (LEGEND && LINES.length > 0) {

                plt.svg.legend.group = svg.append("g")
                                    .attr("class", "d3lines-legend")
                                    .attr("data-style-padding",10)
                                    .style("font-size", LEGEND_FONT_SIZE)
                                    .call(buildLegend);

                plt.svg.legend.group.select("rect")
                                .style("fill", LEGEND_FILL)
                                .style("fill-opacity", LEGEND_FILL_OPACITY)
                                .style("stroke", LEGEND_BORDER_COLOR)
                                .style("stroke-width", LEGEND_BORDER_WIDTH)
                                .style("stroke-dasharray", dashArray(LEGEND_BORDER_STYLE));

                var bbox = plt.svg.legend.group.selectAll("rect")[0][0].getBBox();
                var dx = 0, dy = 0;

                if (isArray(LEGEND_POSITION) && LEGEND_POSITION.length == 2){
                        dx = LEGEND_POSITION[0]
                        dy = LEGEND_POSITION[1]
                }
                else {
                    // String
                    try {
                        var ppos = JSON.parse(LEGEND_POSITION)
                        if (!isArray(ppos)) {
                            var msg = "Invalid legend position (valid values are 'top left', 'top right', ... or 2-element arrays with the position (ex: [100, 200]))";
                            console.log(msg);
                            throw TypeError(msg);
                        }
                        if (ppos.length != 2) {
                            msg = "Invalid legend position (valid values are 'top left', 'top right', ... or 2-element arrays with the position (ex: [100, 200]))";
                            console.log(msg);
                            throw TypeError(msg);
                        }
                        dx = ppos[0]
                        dy = ppos[1]
                    } catch(err) {
                        if (LEGEND_POSITION.indexOf("right") == -1) {
                            dx = MARGINS.left+10
                        } else {
                            dx = WIDTH-MARGINS.right-bbox.width-10
                        }
                        if (LEGEND_POSITION.indexOf("bottom") == -1) {
                            dy = MARGINS.top+10
                        } else {
                            dy = HEIGHT-MARGINS.bottom-bbox.height-10
                        }
                    }
                }
                plt.svg.legend.group.attr("transform", "translate(" + dx + "," + dy + ")")

                if (LEGEND_FONT_COLOR !== undefined) {
                    plt.svg.legend.group.selectAll("text").style("fill", LEGEND_FONT_COLOR);
                }
                if (LEGEND_FONT_FAMILY !== undefined) {
                    plt.svg.legend.group.style("font-family", LEGEND_FONT_FAMILY);
                }
            }

            return plt;

        },

    // End of d3lines.plot

        groupByPlot: function(svg, data, xkey, groupByKey, original_options, renameKeys){

            function usage(){
                str = "Usage:\n"
                str += "    plt = d3lines.groupByPlot(svg, data, groupByKey,"+
                        " renameKeys)\n\n"
                str += "Arguments:\n"
                str += "    svg (d3.selection): a d3 selection of the svg DOM"+
                        " element where you want your plot to be drawn\n"
                str += "    data (Array of objects or Array): the data to plot\n"
                str += "    xkey (string): the name of the key for the x-axis\n"
                str += "    groupByKey (string): the name of the key to group"+
                        " the data by\n\n"
                str += "Optional arguments:\n"
                str += "    renameKeys (function): a function to rename the"+
                        " data keys using the group name"
                str += "\n"
                return str;
            }

            if (!(svg instanceof d3.selection)) throw TypeError("`svg` must be a d3.selection object.")

            if (arguments.length < 4) throw Error("Not enough arguments\n\n"+usage())

            if (arguments.length < 6){
                renameKeys = function(old, groupKey){return old + " ("+groupKey+")"}
            }

            var plt;

            // Throw error if options is defined and is not an object
            if (objectExists(original_options) && typeof(original_options) != "object") {
                throw TypeError("`options` should be an Object");
            }

            // Default configuration
            var options = copyOptions(original_options) || {};

            // ignore data and xkey
            if (options.hasOwnProperty("data")) delete options.data;
            if (options.hasOwnProperty("xkey")) delete options.xkey;

            if (data instanceof Data) data = data.data;

            var groups = d3.nest()
                .key(function(d){return d[groupByKey];})
                .entries(data)

            var LEGEND = getValue(options, "legend", DEFAULT_LEGEND);
            var INTERACTIVE = getValue(options, "interactive",
                DEFAULT_INTERACTIVE);
            var LEGEND_LABELS = getValue(options, "legend_labels");
            if (LEGEND && !objectExists(LEGEND_LABELS)) legend_labels = [];

            groups.forEach(function(group, index){
                data = group.values
                data = new d3lines.Data(data)
                    .ignoreColumns([groupByKey])
                    .data

                data.forEach(function(d, i) {
                    Object.keys(d).forEach(function(key){
                        if (key !== xkey) {
                            d[renameKeys(key, group.key)] = d[key];
                            if (i == 0 && LEGEND && !objectExists(LEGEND_LABELS)) {
                                legend_labels.push(renameKeys(key, group.key))
                            }
                            delete d[key];
                        }
                    });
                });
                add_options = {
                    data: data,
                    legend: false,
                    interactive: false,
                    xkey: xkey,
                }
                if (objectExists(LEGEND_LABELS)){
                    add_options.legend_labels = LEGEND_LABELS;
                }
                Object.keys(options).forEach(function(key){
                    add_options[key] = options[key]
                });
                if (index == 0){
                    plt = d3lines.plot(svg, add_options);
                } else {
                    if (index === groups.length - 1) {
                        if (LEGEND) {
                            if (objectExists(LEGEND_LABELS)){
                                add_options.legend_labels = LEGEND_LABELS;
                            } else {
                                add_options.legend_labels = legend_labels;
                            }
                            add_options.legend = true;
                        } else {
                            add_options.legend = false;
                        }
                        add_options.interactive = INTERACTIVE;

                    }
                    plt = d3lines.plot(svg, add_options, plt);

                }
            });
            return plt;
        },

     // End of d3lines.groupByPlot

    };

})();
