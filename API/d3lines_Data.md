## <a name="Data"></a>`d3lines.Data(data)`

`d3lines.Data` is a prototype built for handling simple data-related tasks.

Arguments:

- **`data`**: the data.

`d3lines.plot` accepts several data types:

1. An array of dictionaries

Example:

```javascript
var data = [{In: 67.3, Out: 56.5},
            {In: 73.1, Out: 59.1},
            {In: 71.9, Out: 58.7},
            {In: 74.3, Out: 53.3},
            {In: 77.7, Out: 49.2}];

var D = d3lines.Data(data);
```

2. A dictionary of arrays

Example:

```js
var data = {In: [67.3, 73.1, 71.9, 74.3, 77.7],
            Out: [56.5, 59.1, 58.7, 53.3, 49.2]};

var D = d3lines.Data(data);
```

3. An array (or an array of arrays)

Example:

```js
var data = [[67.3, 56.5],
            [73.1, 59.1],
            [71.9, 58.7],
            [74.3, 53.3],
            [77.7, 49.2]];

var D = d3lines.Data(data);
```

### Properties

- **`data`**: the data in the form of an array of dictionaries:

```js
var data = {In: [67.3, 73.1, 71.9, 74.3, 77.7],
            Out: [56.5, 59.1, 58.7, 53.3, 49.2]};

var D = d3lines.Data(data);
// D.data = [{In: 67.3, Out: 56.5},
//          {In: 73.1, Out: 59.1},
//          {In: 71.9, Out: 58.7},
//          {In: 74.3, Out: 53.3},
//          {In: 77.7, Out: 49.2}]
```

### Methods

- **`filterColumns(filterFunc)`**: filters the columns based on a function.
- **`ignoreColumns(columns)`**: ignores columns based on the provided array of column names.
- **`selectColumns(columns)`**: keeps columns based on the provided array of column names.
- **`sample([start, end])`**: keeps columns based on column numbers.
- **`sanitize()`**: cleans up the data in order to be able to plot it.
- **`transpose([xkey])`**: transposes a data matrix.
