// Generated by CoffeeScript 1.6.2
(function() {
  var Layer, layer, root, zIndex, _i, _len, _ref;

  root = this;

  zIndex = 0;

  Layer = (function() {
    function Layer(id) {
      var div, height, width;

      this.w = width = $('body').width();
      this.h = height = $('body').height();
      div = $("<div id='" + id + "'></div>");
      div.css({
        "border": "1px solid #aaa",
        "background-color": "rgba(0,0,0,0)",
        "position": "absolute"
      }, "left: 0", "top: 0", {
        "z-index": zIndex++,
        "width": width + "px",
        "height": height + "px"
      });
      $('body').append(div);
      this.ctx = new Raphael(id, 10000, 10000);
      this.clear();
    }

    Layer.prototype.clear = function() {
      return this.ctx.clear();
    };

    Layer.prototype.drawLine = function(line) {
      var c;

      c = this.ctx.path("M " + line.p0.x + " " + line.p0.y + " L " + line.p1.x + " " + line.p1.y);
      c.attr("stroke", "#eee");
      return c.attr("stroke-width", "9");
    };

    Layer.prototype.drawBeizer = function(beizer) {
      var c;

      c = this.ctx.path("M " + beizer.p0.x + " " + beizer.p0.y + "\nC " + beizer.p1.x + " " + beizer.p1.y + "\n  " + beizer.p2.x + " " + beizer.p2.y + "\n  " + beizer.p3.x + " " + beizer.p3.y);
      c.attr("stroke-width", "9");
      return c.attr("stroke", "#eee");
    };

    Layer.prototype.drawDot = function(pos, color) {
      var c;

      if (color == null) {
        color = "#505";
      }
      c = this.ctx.circle(pos.x, pos.y, 4);
      return c.attr("fill", color);
    };

    Layer.prototype.drawRoad = function(line) {
      var c;

      c = this.ctx.path("M" + line.p0.x + " " + line.p0.y + " L" + line.p1.x + " " + line.p1.y + " ");
      c.attr("stroke-width", "9");
      return c.attr("stroke", "#eee");
    };

    Layer.prototype.drawNode = function(node, large) {
      var c, t;

      if (large == null) {
        large = false;
      }
      if (large) {
        c = this.ctx.circle(node.pos.x, node.pos.y, 8);
      } else {
        c = this.ctx.circle(node.pos.x, node.pos.y, 4);
      }
      c.attr("fill", "#500");
      c.attr("stroke", "#eee");
      t = this.ctx.circle(node.ctrl.x, node.ctrl.y, 1);
      t.attr("fill", "#500");
      return t.attr("stroke", "#eee");
    };

    Layer.prototype.addNodeSnapper = function(node) {
      var c,
        _this = this;

      c = this.ctx.circle(node.pos.x, node.pos.y, 10);
      c.attr("fill", "#555");
      c.mouseover(function() {
        return node.over();
      });
      return c.mouseout(function() {
        return node.out();
      });
    };

    Layer.prototype.drawImpasse = function(pos) {
      var c;

      c = this.ctx.circle(pos.x, pos.y, 10);
      c.attr("fill", "#555");
      return c.attr("stroke", "#999");
    };

    return Layer;

  })();

  root.layers = {};

  _ref = ['main', 'node', 'tool', 'nodeSnap'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    layer = _ref[_i];
    root.layers[layer] = new Layer(layer);
  }

}).call(this);

/*
//@ sourceMappingURL=layers.map
*/