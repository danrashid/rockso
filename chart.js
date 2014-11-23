/* global $, d3 */
'use strict';

var my = my || {};

my.chart = function (sel, data, opts) {
  opts = $.extend({
    rightMargin: 48,
    verticalMargin: 16,
    barSpacing: 0.2,
  }, opts);

  var svg = d3.select(sel),
    $svg = $(svg.node()),
    chartHeight = $svg.height() - opts.verticalMargin * 2,
    xScale = d3.scale.ordinal()
      .domain(d3.range(data[0].values.length)),
    yScale = d3.scale.linear()
      .range([chartHeight, 0]),
    axisFn = d3.svg.axis()
      .orient('right')
      .tickSize(0)
      .tickPadding(0),
    stack = d3.layout.stack()
      .values(function (d) {
        return d.values;
      }),
    chartWidth,
    layersGroup,
    clipPath,
    axis,
    hotSpots;

  function setClipPathWidth(clipPath) {
    clipPath.attr('width', chartWidth - xScale(0));
  }

  function appendClippingPath(svg) {
    clipPath = svg.append('clipPath')
      .attr('id', 'clip')
      .append('rect')
        .attr('height', chartHeight)
        .call(setClipPathWidth);
  }

  function positionGroup(g, x) {
    x = x || 0;

    var translate = [
      x - xScale(0),
      opts.verticalMargin
    ].join(',');

    g.attr('transform', 'translate(' + translate + ')');
  }

  function appendHotspots(svg) {
    hotSpots = svg.append('g')
      .classed('hotspots', true)
      .call(positionGroup);

    data[0].values.forEach(function (d, i) {
      hotSpots.append('rect')
        .attr('height', chartHeight)
        .call(setRectX, xScale(i));
    });
  }

  function positionAxis(axis) {
    axis.call(positionGroup, getRightEdge());
  }

  function appendAxis(svg) {
    axis = svg.append('g')
      .classed('axis', true)
      .call(positionAxis);
  }

  function setRectX(rect, x) {
    x = x || function (d, i) {
      return xScale(i);
    };

    rect.attr({
      x: x,
      width: xScale.rangeBand()
    });
  }

  function setRectY(rect) {
    rect.attr({
      y: function (d) {
        return yScale(d.y) - (chartHeight - yScale(d.y0));
      },
      height: function (d) {
        return chartHeight - yScale(d.y);
      }
    });
  }

  function setRectAttributes(rect, x) {
    rect
      .call(setRectX, x)
      .call(setRectY);
  }

  function getRightEdge() {
    var barOffset = xScale(1) - xScale(0);

    return xScale(data[0].values.length - 1) + barOffset;
  }

  function appendRect(selection) {
    selection.append('rect')
      .call(setRectAttributes, getRightEdge());
  }

  function joinRects(layer, animate) {
    var rect = layer.selectAll('rect')
      .data(function (d) {
        return d.values;
      }, function (d) {
        return d.x;
      });

    rect.enter().call(appendRect);
    setRectAttributes(animate ? rect.transition() : rect);

    rect.exit()
      .transition()
        .attr('x', -xScale.rangeBand())
      .remove();
  }

  function appendLayer(selection) {
    selection.append('g')
      .classed('layer', true)
      .attr('fill', function (d) { return d.color; })
      .call(joinRects);
  }

  function setXScale() {
    chartWidth = $svg.width() - opts.rightMargin;
    xScale.rangeRoundBands([0, chartWidth], opts.barSpacing);
  }

  function setYScale() {
    var lastShownLayerValues = data.filter(function (d) {
        return !d.hidden;
      }).pop().values,
      domain = [
        0,
        d3.max(lastShownLayerValues.map(function (d) {
          return d.y + d.y0;
        }))
      ];

    yScale.domain(domain);

    axisFn
      .scale(yScale)
      .tickValues(domain);

    axis.call(axisFn);
  }

  function joinLayers(layersGroup, animate) {
    var layer = layersGroup.selectAll('g')
      .data(stack(data.filter(function (d) {
        return !d.hidden;
      })), function (d) {
        return d.guid;
      });

    setYScale();
    layer.enter().call(appendLayer);
    joinRects(layer, animate);
    layer.exit().remove();
  }

  function appendLayers(svg) {
    layersGroup = svg.append('g')
      .classed('layers', true)
      .attr('clip-path', 'url(#clip)')
      .call(positionGroup)
      .call(joinLayers);
  }

  function resize() {
    setXScale();
    clipPath.call(setClipPathWidth);
    axis.call(positionAxis);

    layersGroup
      .call(positionGroup)
      .selectAll('g')
        .selectAll('rect').call(setRectX);

    hotSpots
      .call(positionGroup)
      .selectAll('rect').call(setRectX);
  }

  function update() {
    joinLayers(layersGroup, true);
  }

  function setHidden() {
    var hiddenGuids = my.hash.getValues('hidden');

    data.forEach(function (d) {
      d.hidden = hiddenGuids.indexOf(d.guid) > -1;
    });
  }

  (function () {
    setHidden();
    setXScale();

    svg
      .call(appendClippingPath)
      .call(appendAxis)
      .call(appendLayers)
      .call(appendHotspots);
  })();

  $(window)
    .on('resize', resize)
    .on('hashchange', function () {
      setHidden();
      update();
    });

  return {
    data: data,
    svg: svg,
    update: update
  };
};
