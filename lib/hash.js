/* global $ */
'use strict';

var my = my || {};

my.hash = (function () {
  function getMap() {
    var hash = window.location.hash.substr(1),
      map = {};

    if (hash.length > 0) {
      hash.split('&').forEach(function (seg) {
        var pair = seg.split('='),
          key,
          values;

        if (pair.length > 1) {
          key = pair[0];
          values = pair[1].split(',');
          map[key] = values;
        }
      });
    }
    return map;
  }

  function set(hashMap) {
    var hash = '#',
      segs = [];

    $.each(hashMap, function (key, values) {
      if (values.length > 0) {
        var seg = key + '=' + values.join(',');

        segs.push(seg);
      }
    });
    hash += segs.join('&');
    window.location.hash = hash;
  }

  function add(key, value) {
    var hashMap = getMap();

    if (!hashMap[key]) {
      hashMap[key] = [];
    }
    hashMap[key].push(value);
    set(hashMap);
  }

  function remove(key, value) {
    var hashMap = getMap(),
      values = hashMap[key] || [],
      index = values.indexOf(value);

    if (index > -1) {
      values.splice(index, 1);
    }
    set(hashMap);
  }

  function getValues(key) {
    return getMap()[key] || [];
  }

  return {
    getValues: getValues,
    add: add,
    remove: remove
  };
})();
