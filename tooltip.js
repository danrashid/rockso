/* global $, d3 */
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
      data = {
        start: start,
        end: start + interval,
        layers: chart.data.filter(function (d) {
            return !d.hidden;
          }).map(function (d) {
            return {
              guid: d.guid,
              value: d.values[i].y
            };
          })
      };

    $el.html(JSON.stringify(data, null, '  '));
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
