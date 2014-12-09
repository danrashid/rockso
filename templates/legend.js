function legendTemplate(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (layers, total) {
buf.push("<table>");
// iterate layers
;(function(){
  var $$obj = layers;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var layer = $$obj[$index];

buf.push("<tr><td" + (jade.attr("style", "color:" + (layer.color) + "", true, false)) + "><label><input type=\"checkbox\"" + (jade.attr("id", layer.guid, true, false)) + "/> " + (jade.escape((jade_interp = layer.guid) == null ? '' : jade_interp)) + "</label></td><td align=\"right\">" + (jade.escape((jade_interp = layer.percent) == null ? '' : jade_interp)) + "%</td><td>" + (jade.escape(null == (jade_interp = layer.total) ? "" : jade_interp)) + "</td></tr>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var layer = $$obj[$index];

buf.push("<tr><td" + (jade.attr("style", "color:" + (layer.color) + "", true, false)) + "><label><input type=\"checkbox\"" + (jade.attr("id", layer.guid, true, false)) + "/> " + (jade.escape((jade_interp = layer.guid) == null ? '' : jade_interp)) + "</label></td><td align=\"right\">" + (jade.escape((jade_interp = layer.percent) == null ? '' : jade_interp)) + "%</td><td>" + (jade.escape(null == (jade_interp = layer.total) ? "" : jade_interp)) + "</td></tr>");
    }

  }
}).call(this);

buf.push("<tr><td align=\"right\" colspan=\"2\">Total</td><td>" + (jade.escape(null == (jade_interp = total) ? "" : jade_interp)) + "</td></tr></table>");}.call(this,"layers" in locals_for_with?locals_for_with.layers:typeof layers!=="undefined"?layers:undefined,"total" in locals_for_with?locals_for_with.total:typeof total!=="undefined"?total:undefined));;return buf.join("");
}