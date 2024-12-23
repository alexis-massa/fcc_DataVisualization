# 💻 Project : Scatterplot Graph

Build an app that is functionally similar to this: https://scatterplot-graph.freecodecamp.rocks.

[**View on CodePen**](https://codepen.io/alexis-massa/pen/wBwBbdL)

## User stories :
- [x] I can see a title element that has a corresponding `id="title"`.
- [x] I can see an x-axis that has a corresponding `id="x-axis"`.
- [x] I can see a y-axis that has a corresponding `id="y-axis`".
- [x] I can see dots, that each have a class of `dot`, which represent the data being plotted.
- [x] Each dot should have the properties `data-xvalue` and `data-yvalue` containing their orresponding `x` and `y` values.
- [x] The `data-xvalue` and `data-yvalue` of each dot should be within the range of the actual data and n the correct data format. For `data-xvalue`, integers (full years) or `Date` objects are acceptable for test evaluation. For `data-yvalue` (minutes), use `Date` objects.
- [x] The `data-xvalue` and its corresponding dot should align with the corresponding point/value on he x-axis.
- [x] The `data-yvalue` and its corresponding dot should align with the corresponding point/value on he y-axis.
- [x] I can see multiple tick labels on the y-axis with `%M:%S` time format.
- [x] I can see multiple tick labels on the x-axis that show the year.
- [x] I can see that the range of the x-axis labels are within the range of the actual x-axis data.
- [x] I can see that the range of the y-axis labels are within the range of the actual y-axis data.
- [x] I can see a legend containing descriptive text that has `id="legend"`.
- [x] I can mouse over an area and see a tooltip with a corresponding `id="tooltip"` which displays ore information about the area.
- [x] My tooltip should have a `data-year` property that corresponds to the `data-xvalue` of the active rea.
