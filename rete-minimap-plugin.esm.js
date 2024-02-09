/*!
* rete-minimap-plugin v2.0.2
* (c) 2024 Vitaliy Stoliarov
* Released under the MIT license.
* */
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _get from '@babel/runtime/helpers/get';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import { NodeEditor, Scope } from 'rete';
import { AreaPlugin } from 'rete-area-plugin';

function nodesBoundingBox(nodes) {
  var lefts = nodes.map(function (n) {
    return n.left;
  });
  var rights = nodes.map(function (n) {
    return n.left + n.width;
  });
  var tops = nodes.map(function (n) {
    return n.top;
  });
  var bottoms = nodes.map(function (n) {
    return n.top + n.height;
  });
  var left = Math.min.apply(Math, _toConsumableArray(lefts)),
    right = Math.max.apply(Math, _toConsumableArray(rights)),
    top = Math.min.apply(Math, _toConsumableArray(tops)),
    bottom = Math.max.apply(Math, _toConsumableArray(bottoms));
  return {
    left: left,
    right: right,
    top: top,
    bottom: bottom,
    width: right - left,
    height: bottom - top
  };
}

function useBoundingCoordinateSystem(rects, minDistance, ratio) {
  var boundingBox = nodesBoundingBox(rects);
  var distance = Math.max(minDistance, Math.max(boundingBox.width, boundingBox.height * ratio));
  var originX = (distance - boundingBox.width) / 2 - boundingBox.left;
  var originY = (distance / ratio - boundingBox.height) / 2 - boundingBox.top;
  var scale = function scale(v) {
    return v / distance;
  };
  var invert = function invert(v) {
    return v * distance;
  };
  return {
    origin: {
      x: originX,
      y: originY
    },
    scale: scale,
    invert: invert
  };
}

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Extra signal types for minimap rendering
 * @priority 10
 */

/**
 * Minimap plugin, triggers rendering of the minimap
 * @priority 9
 * @listens nodetranslated
 * @listens nodecreated
 * @listens noderemoved
 * @listens translated
 * @listens resized
 * @listens noderesized
 * @listens zoomed
 * @emits render
 */
var MinimapPlugin = /*#__PURE__*/function (_Scope) {
  _inherits(MinimapPlugin, _Scope);
  var _super = _createSuper(MinimapPlugin);
  /**
   * @constructor
   * @param props Plugin properties
   * @param props.ratio minimap ratio. Default is `1`
   * @param props.minDistance minimap minimum distance. Default is `2000`
   * @param props.boundViewport whether to bound the mini-viewport to the minimap. Default is `false`
   */
  function MinimapPlugin(props) {
    var _this$props, _this$props2, _this$props3;
    var _this;
    _classCallCheck(this, MinimapPlugin);
    _this = _super.call(this, 'minimap');
    _this.props = props;
    _this.ratio = ((_this$props = _this.props) === null || _this$props === void 0 ? void 0 : _this$props.ratio) || 1;
    _this.minDistance = ((_this$props2 = _this.props) === null || _this$props2 === void 0 ? void 0 : _this$props2.minDistance) || 2000;
    _this.boundViewport = Boolean((_this$props3 = _this.props) === null || _this$props3 === void 0 ? void 0 : _this$props3.boundViewport);
    _this.getNodesRect = _this.getNodesRect.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(MinimapPlugin, [{
    key: "setParent",
    value: function setParent(scope) {
      var _this2 = this;
      _get(_getPrototypeOf(MinimapPlugin.prototype), "setParent", this).call(this, scope);
      this.area = this.parentScope(AreaPlugin);
      this.editor = this.area.parentScope(NodeEditor);
      this.element = document.createElement('div');
      this.area.container.appendChild(this.element);

      // eslint-disable-next-line complexity
      this.addPipe(function (context) {
        if (!('type' in context)) return context;
        if (context.type === 'render' && context.data.type === 'node') {
          _this2.render();
        } else if (context.type === 'nodetranslated') {
          _this2.render();
        } else if (context.type === 'nodecreated') {
          _this2.render();
        } else if (context.type === 'noderemoved') {
          _this2.render();
        } else if (context.type === 'translated') {
          _this2.render();
        } else if (context.type === 'resized') {
          _this2.render();
        } else if (context.type === 'noderesized') {
          _this2.render();
        } else if (context.type === 'zoomed') {
          _this2.render();
        }
        return context;
      });
    }
  }, {
    key: "getNodesRect",
    value: function getNodesRect() {
      var _this3 = this;
      return this.editor.getNodes().map(function (node) {
        var view = _this3.area.nodeViews.get(node.id);
        if (!view) return null;
        return {
          width: node.width,
          height: node.height,
          left: view.position.x,
          top: view.position.y,
          id: node.id
        };
      }).filter(Boolean);
    }
  }, {
    key: "getCurrNodes",
    value: function getCurrNodes() {
      var nodes = this.getNodesRect();
      var transform = this.area.area.transform;
      var _this$area$container = this.area.container,
        width = _this$area$container.clientWidth,
        height = _this$area$container.clientHeight;
      var minDistance = this.minDistance,
        ratio = this.ratio;
      var viewport = {
        left: -transform.x / transform.k,
        top: -transform.y / transform.k,
        width: width / transform.k,
        height: height / transform.k
      };
      var rects = this.boundViewport ? [].concat(_toConsumableArray(nodes), [viewport]) : nodes;
      var _useBoundingCoordinat = useBoundingCoordinateSystem(rects, minDistance, ratio),
        origin = _useBoundingCoordinat.origin,
        scale = _useBoundingCoordinat.scale;
      return nodes.map(function (node) {
        return {
          left: scale(node.left + origin.x),
          top: scale(node.top + origin.y),
          width: scale(node.width),
          height: scale(node.height),
          id: node.id
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var parent = this.parentScope();
      var nodes = this.getNodesRect();
      var transform = this.area.area.transform;
      var _this$area$container2 = this.area.container,
        width = _this$area$container2.clientWidth,
        height = _this$area$container2.clientHeight;
      var minDistance = this.minDistance,
        ratio = this.ratio;
      var viewport = {
        left: -transform.x / transform.k,
        top: -transform.y / transform.k,
        width: width / transform.k,
        height: height / transform.k
      };
      var rects = this.boundViewport ? [].concat(_toConsumableArray(nodes), [viewport]) : nodes;
      var _useBoundingCoordinat2 = useBoundingCoordinateSystem(rects, minDistance, ratio),
        origin = _useBoundingCoordinat2.origin,
        scale = _useBoundingCoordinat2.scale,
        invert = _useBoundingCoordinat2.invert;
      parent.emit({
        type: 'render',
        data: {
          type: 'minimap',
          element: this.element,
          ratio: ratio,
          start: function start() {
            return transform;
          },
          nodes: nodes.map(function (node) {
            return {
              left: scale(node.left + origin.x),
              top: scale(node.top + origin.y),
              width: scale(node.width),
              height: scale(node.height),
              id: node.id
            };
          }),
          viewport: {
            left: scale(viewport.left + origin.x),
            top: scale(viewport.top + origin.y),
            width: scale(viewport.width),
            height: scale(viewport.height)
          },
          translate: function translate(dx, dy) {
            var x = transform.x,
              y = transform.y,
              k = transform.k;
            _this4.area.area.translate(x + invert(dx) * k, y + invert(dy) * k);
          },
          point: function point(x, y) {
            var areaCoordinatesPoint = {
              x: (origin.x - invert(x)) * transform.k,
              y: (origin.y - invert(y)) * transform.k
            };
            var center = {
              x: areaCoordinatesPoint.x + width / 2,
              y: areaCoordinatesPoint.y + height / 2
            };
            _this4.area.area.translate(center.x, center.y);
          }
        }
      });
    }
  }]);
  return MinimapPlugin;
}(Scope);

export { MinimapPlugin };
//# sourceMappingURL=rete-minimap-plugin.esm.js.map
