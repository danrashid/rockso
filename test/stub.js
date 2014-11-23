/* global d3 */
'use strict';

var my = my || {};

my.stub = function (count) {
  function gen() {
    count = count || 5;

    var now = Math.floor(+(new Date()) / 1000) * 1000,
      colors = d3.scale.category10(),
      res = [],
      layer,
      c,
      i;

    for (c = 0; c < count; c += 1) {
      layer = {
        guid: 'g' + c,
        color: colors(c),
        values: []
      };

      for (i = 60 - 1; i >= 0; i -= 1) {
        layer.values.push([
          now - 1000 * i,
          Math.round(Math.random() * 10 * (count - c))
        ]);
      }

      res.push(layer);
    }

    return res;
  }

  function preprocess(res) {
    res.forEach(function (layer) {
      layer.values = layer.values.map(function (value) {
        return {
          x: value[0],
          y: value[1]
        };
      });
    });

    return res;
  }

  return preprocess(gen());
};
