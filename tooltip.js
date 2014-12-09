/* global $, d3, tooltipTemplate */
'use strict';

var my = my || {};

my.tooltip = function (sel, chart) {
  var $el = $(sel);

  function populate(hotspot) {
    var i = $(hotspot.node()).index(),
      times = chart.data[0].values.map(function (value) {
        return value.x;
      }),
      interval = times[1] - times[0],
      start = times[i],
      layers = chart.data.filter(function (d) {
        return !d.hidden;
      }),
      total = layers.reduce(function (a, b) {
        return a + b.values[i].y;
      }, 0);

    $el.html(tooltipTemplate({
      start: (new Date(start)).toLocaleString(),
      end: (new Date(start + interval)).toLocaleString(),
      total: total,
      layers: layers.map(function (layer) {
        var value = layer.values[i].y;

        return {
          guid: layer.guid,
          color: layer.color,
          value: value,
          percent: Math.round((value / total) * 10000) / 100
        };
      })
    }));
  }

  $(chart.svg.node()).on('click', '.hotspots rect', function () {
    var hotspot = d3.select(this);

    chart.svg.selectAll('.hotspots rect').classed('active', false);
    hotspot.classed('active', true);
    populate(hotspot);
  });

  $(window).on('hashchange', function () {
    var activeHotspot = chart.svg.select('.hotspots .active');

    if (activeHotspot.size()) {
      populate(activeHotspot);
    }
  });
};
