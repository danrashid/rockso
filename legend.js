/* global $ */
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

  function update() {
    var total = data.reduce(function (a, b) {
      return a + b.values.reduce(function (c, d) {
        return c + d.y;
      }, 0);
    }, 0);

    data.forEach(function (layer) {
      var $label = $('[for="' + layer.guid + '"]'),
        layerTotal = layer.values.reduce(function (a, b) {
          return a + b.y;
        }, 0),
        percent = Math.round((layerTotal / total) * 10000) / 100;

      $label.find('.total').html(layerTotal);
      $label.find('.percent').html(percent + '%');
    });
  }

  (function () {
    data.forEach(function (layer) {
      $('<label for="' + layer.guid + '">')
        .css('color', layer.color)
        .append('<input type="checkbox" id="' + layer.guid + '">')
        .append('<span class="percent">')
        .append('<span class="name">' + layer.guid)
        .append('<span class="total">')
        .appendTo($el);
    });
    update();
    setChecked();
  })();

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

  return {
    update: update
  };
};
