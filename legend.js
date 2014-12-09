/* global $, legendTemplate */
'use strict';

var my = my || {};

my.legend = function (sel, data) {
  var $el = $(sel);

  function setChecked() {
    var $checkedInputs;

    data.forEach(function (layer) {
      $('#' + layer.guid).prop('checked', !layer.hidden);
    });

    $checkedInputs = $el.find('input:checked');
    $checkedInputs.prop('disabled', $checkedInputs.length === 1);
  }

  function populate() {
    var total = data.reduce(function (a, b) {
      return a + b.values.reduce(function (c, d) {
        return c + d.y;
      }, 0);
    }, 0);

    $el.html(legendTemplate({
      total: total,
      layers: data.map(function (layer) {
        var layerTotal = layer.values.reduce(function (a, b) {
          return a + b.y;
        }, 0);

        return {
          color: layer.color,
          guid: layer.guid,
          percent: Math.round((layerTotal / total) * 10000) / 100,
          total: layerTotal
        };
      })
    }));
    setChecked();
  }

  $el.on('click', 'input', function () {
    var $input = $(this),
      guid = $input.attr('id');

    if ($input.is(':checked')) {
      my.hash.remove('hidden', guid);
    } else {
      my.hash.add('hidden', guid);
    }
  });

  $(window).on('hashchange', setChecked);

  populate();

  return {
    populate: populate
  };
};
