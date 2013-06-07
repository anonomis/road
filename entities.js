// Generated by CoffeeScript 1.6.2
(function() {
  var Edge, Handle, Node, Road, makeRoad, redrawAll, root, splitRoad;

  root = this;

  redrawAll = function() {
    var ent, entityType, entityTypes, _i, _len, _results;

    layers.main.clear();
    entityTypes = [ents.roads, ents.nodes, ents.handels];
    _results = [];
    for (_i = 0, _len = entityTypes.length; _i < _len; _i++) {
      entityType = entityTypes[_i];
      _results.push((function() {
        var _j, _len1, _results1;

        _results1 = [];
        for (_j = 0, _len1 = entityType.length; _j < _len1; _j++) {
          ent = entityType[_j];
          _results1.push(ent.draw());
        }
        return _results1;
      })());
    }
    return _results;
  };

  Node = (function() {
    function Node(pos, target) {
      this.pos = pos;
      if (target == null) {
        target = null;
      }
      this.handels = [];
      if (target != null) {
        new Handle(this, target);
      }
      layers.nodeSnap.addNodeSnapper(this);
      this.draw();
      ents.nodes.push(this);
    }

    Node.prototype.addHandle = function(handle) {
      if (this.handels.indexOf(handle === -1)) {
        this.handels.push(handle);
      }
      return handle;
    };

    Node.prototype.draw = function() {
      return layers.main.drawNode(this);
    };

    Node.prototype.over = function(e) {
      var _base;

      return typeof (_base = tools.current).over === "function" ? _base.over(this, e) : void 0;
    };

    Node.prototype.out = function(e) {
      var _base;

      if (typeof (_base = tools.current).out === "function") {
        _base.out(this, e);
      }
      return layers.tool.clear();
    };

    return Node;

  })();

  Handle = (function() {
    function Handle(node, pos, inverse) {
      this.node = node;
      this.pos = pos;
      this.inverse = inverse != null ? inverse : null;
      this.line = L(this.node.pos, this.pos);
      this.edges = [];
      if (this.inverse == null) {
        this.inverse = new Handle(this.node, this.line.grow(-1).p1, this);
      }
      this.draw();
      this.node.addHandle(this);
      ents.handels.push(this);
    }

    Handle.prototype.draw = function() {};

    Handle.prototype.addEdge = function(edge) {
      return this.edges.push(edge);
    };

    Handle.prototype.removeEdge = function(edge) {
      return this.edges = _.without(edge);
    };

    return Handle;

  })();

  Edge = (function() {
    function Edge(from, to) {
      this.from = from;
      this.to = to;
      this.line = L(this.from.node.pos, this.to.node.pos);
      this.from.addEdge(this);
      this.to.addEdge(this);
    }

    Edge.prototype.addRoad = function(road) {
      return this.road = road;
    };

    Edge.prototype.destroy = function() {
      this.from.removeEdge(this);
      this.to.removeEdge(this);
      return this.road.destroy();
    };

    return Edge;

  })();

  Road = (function() {
    var defaults;

    defaults = {
      color: "#777"
    };

    function Road(edge, curve) {
      this.edge = edge;
      this.curve = curve;
      this.opt = _.defaults(defaults);
      this.edge.addRoad(this);
      this.elem = this.draw();
      ents.roads.push(this);
    }

    Road.prototype.draw = function() {
      return layers.main.drawRoad(this);
    };

    Road.prototype.destroy = function() {
      ents.roads = _.without(ents.roads, this);
      return redrawAll();
    };

    return Road;

  })();

  makeRoad = function(oldHandle, curve, newNode) {
    var edge, newHandle;

    if (newNode == null) {
      newNode = null;
    }
    if (newNode == null) {
      newNode = new Node(curve.p3);
    }
    newHandle = new Handle(newNode, curve.p2);
    edge = new Edge(oldHandle, newHandle);
    new Road(edge, curve);
    return newHandle.inverse;
  };

  splitRoad = function(intersection) {
    var curve, curveToSplit, curves, edge1, edge2, edgeToSplit, handleIn, handleOut, intersectionPoint, newNode, param;

    edgeToSplit = intersection.road.edge;
    curveToSplit = intersection.road.curve;
    intersectionPoint = intersection._point;
    param = curveToSplit.getParameterOf(intersectionPoint);
    curves = split(curveToSplit, param);
    newNode = new Node(curves.left.p3);
    handleIn = new Handle(newNode, curves.left.p1, "later");
    handleOut = new Handle(newNode, curves.right.p2, "later");
    handleIn.inverse = handleOut;
    handleOut.inverse = handleIn;
    edge1 = new Edge(edgeToSplit.from, handleIn);
    curve = C({
      p0: edgeToSplit.from.node.pos,
      p1: curves.left.p2,
      p2: handleIn.pos,
      p3: newNode.pos
    });
    new Road(edge1, curve);
    edge2 = new Edge(handleOut, edgeToSplit.to);
    curve = C({
      p0: newNode.pos,
      p1: handleOut.pos,
      p2: curves.right.p1,
      p3: edgeToSplit.to.node.pos
    });
    new Road(edge2, curve);
    edgeToSplit.destroy();
    return newNode;
  };

  root.test = function() {
    var c;

    c = C({
      p0: P(0, 0),
      p1: P(50, 0),
      p2: P(100, 50),
      p3: P(100, 100)
    });
    return console.log(split(c, 0.5));
  };

  root.ents = {};

  root.ents.makeRoad = makeRoad;

  root.ents.splitRoad = splitRoad;

  root.ents.Node = Node;

  root.ents.Handle = Handle;

  root.ents.roads = [];

  root.ents.nodes = [];

  root.ents.handels = [];

}).call(this);
