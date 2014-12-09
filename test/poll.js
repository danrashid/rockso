/* global $, chart, legend */
'use strict';

$(document).on('submit', '#push', function () {
  var datum = chart.data[0].values,
    x = datum[datum.length - 1].x,
    factor = +$('#factor').val(),
    length = chart.data.length;

  chart.data.forEach(function (layer, i) {
    layer.values.push({
      x: x + 1000,
      y: Math.round(Math.random() * factor * (length - i))
    });
    layer.values.shift();
  });
  chart.update();
  legend.populate();

  return false;
});
