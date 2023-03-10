(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'splice', 'sort'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      var ob = this.__ob__;
      console.log(ob, 'ob');
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          //arr.splice(0, 1, {a: 1})
          inserted = arr.slice(2);
          break;
      }
      if (inserted) {
        //?????????????????????????????????????????????
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      //??????data??????????????? ????????????????????????????????? ??????????????????????????? __ob__ enumerable?????????false
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });
      // data.__ob__ = this  //?????????????????????????????? ??????????????????????????? ?????????????????????????????????????????????????????????????????????
      if (Array.isArray(data)) {
        data.__proto__ = newArrayProto;
        //???????????????????????????
        this.observeArray(data);
      } else {
        //???data???????????????????????????????????? ????????????????????????????????? ????????????$set $delete
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        //????????????????????????
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }]);
    return Observer;
  }();
  function defineReactive(target, key, value) {
    //????????????value ??????????????? ???????????????????????????
    observe(value);
    Object.defineProperty(target, key, {
      get: function get() {
        console.log('??????????????????', key);
        return value;
      },
      set: function set(newValue) {
        console.log('??????????????????');
        if (newValue === value) return;
        value = newValue;
      }
    });
  }
  function observe(data) {
    //?????? ??????????????????
    if (_typeof(data) !== 'object' || data === null) return;
    if (data.__ob__ instanceof Observer) return; //???????????????????????????
    return new Observer(data);
  }

  //???????????????
  function initState(vm) {
    var ops = vm.$options;
    if (ops.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data; //data????????????????????????

    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;

    //????????????????????? vue2????????????Object.defineProperty
    observe(data);

    //???vm._data???????????? ????????????
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // ?????????????????????????????? ?????????  <xxx ????????????????????? ???????????????
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // ????????????</xxxx>  ???????????????????????????????????????????????????
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // ????????????
  // ??????????????????????????????key value ?????? ??????3/??????4/?????????
  var startTagClose = /^\s*(\/?)>/; // <div> <br/>

  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var currentParent; //???????????????????????????????????????
    var root;

    //?????????????????????AST?????????
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    function start(tag, attrs) {
      var node = createASTElement(tag, attrs);
      if (!root) {
        //???????????????
        root = node;
      }
      if (currentParent) {
        node.parent = currentParent;
        // ????????????????????????????????????
        currentParent.children.push(node);
      }
      stack.push(node);
      currentParent = node; //curentParent?????????????????????
    }

    function _char(text) {
      // ????????????
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }
    function end(tag) {
      stack.pop(); //??????????????????????????????
      currentParent = stack[stack.length - 1];
    }
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        var attr, endMatch;
        while (!(endMatch = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }
        if (endMatch) {
          advance(endMatch[0].length);
        }
        return match;
      }
      //????????????

      return false;
    }
    while (html) {
      var textEnd = html.indexOf('<'); //??????indexof???????????????0 ????????????????????? textEnd???0 ?????????????????????????????????
      if (textEnd === 0) {
        var startTagMatch = parseStartag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagName = html.match(endTag);
        if (endTagName) {
          advance(endTagName[0].length);
          end(endTagName[1]);
          continue;
        }
        break;
      }
      if (textEnd > 0) {
        var text = html.substring(0, textEnd);
        if (text) {
          _char(text);
          advance(text.length);
        }
      }
    }
    return root;
  }

  //????????????
  function genprops(attrs) {
    var str = '';
    var _loop = function _loop() {
      if (attrs[i].name === 'style') {
        var obj = {};
        attrs[i].value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          key = key.trim();
          value = value.trim();
          obj[key] = value;
        });
        attrs[i].value = obj;
      }
      str += "".concat(attrs[i].name, ":").concat(JSON.stringify(attrs[i].value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    //????????????????????????
    return "{".concat(str.slice(0, -1), "}");
  }

  //???????????????children
  function genChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(',');
  }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  ????????????????????????????????????????????????
  function gen(node) {
    if (node.type === 1) {
      return codegen(node);
    } else {
      // ????????????
      var text = node.text;
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        // _v(_s(name)+ 'hello' + _s(name))
        var tokens = [];
        var match;
        //?????????g ??????????????? ?????????????????????????????? ????????????lastIndex??????
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;
        while (match = defaultTagRE.exec(text)) {
          // hello  {{ name }} hello {{age}} hi
          //????????????????????? ????????????????????? ??? ????????????
          var index = match.index;
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        //???????????????????????????
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  //??????????????????
  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "', \n    ").concat(ast.attrs.length ? genprops(ast.attrs) : 'null', "\n    ").concat(ast.children.length ? ",".concat(children) : '', "\n    )");
    return code;
  }
  // ???????????????????????????
  function compileToFunction(template) {
    // 1. ???template?????????AST?????????
    var ast = parseHTML(template);
    //2. ??????render??????  ???render????????????????????????????????????DOM???
    var code = codegen(ast);

    //??????????????????????????? ?????? with + new Function
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code);
    return render;
  }

  function createElementVnode(vm, tag, data) {
    var key = data === null || data === void 0 ? void 0 : data.key;
    key ? delete data.key : '';
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }
  function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  /*
  * ast ???????????????????????? ???????????????????????????js css html???
  *   ?????????DOM????????????DOM?????? ?????????????????????????????????*/
  function vnode(vm, tag, key, props, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      props: props,
      children: children,
      text: text
    };
  }

  function initLifeCycle(Vue) {
    //????????????DOM????????????DOM
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      //????????????????????? ?????????????????????
      vm.$el = patch(el, vnode);
    };
    //_c('div',{},children)  div null undefined
    Vue.prototype._c = function () {
      return createElementVnode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };
    Vue.prototype._v = function () {
      return createTextVnode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    //????????????DOM ????????????
    Vue.prototype._render = function () {
      return this.$options.render.call(this);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;
    //1. ??????render???????????????????????? ??????DOM
    vm._update(vm._render());
    //2. ????????????DOM????????????DOM

    //3. ?????????el?????????
  }

  function createElm(vnode) {
    var tag = vnode.tag,
      props = vnode.props,
      children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      genProps(vnode.el, props);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function genProps(el, props) {
    // style: { color: 'red', backgroundColor: yellow }
    for (var key in props) {
      if (key === 'style') {
        for (var styleName in props[key]) {
          el[styleName] = props[key][styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }
  function patch(oldNode, vnode) {
    var isRealElement = oldNode.nodeType;
    if (isRealElement) {
      var elm = oldNode; //??????????????????

      var parentElm = elm.parentNode;
      var newElm = createElm(vnode);
      //??????????????? ???????????????
      parentElm.insertBefore(newElm, oldNode.nextSibling);
      parentElm.removeChild(elm);
      return newElm;
    }
  }

  // vue???????????? 1??? ????????????????????????  2??? ???????????????ast?????????
  // 3) ???ast??????????????????render?????? 4) ???????????????????????????????????????render?????? (??????????????????ast???????????????)
  // render?????????????????????????????????????????????????????????
  // ??????????????????????????????????????????DOM

  //??????vue????????????
  var initMixin = function initMixin(Vue) {
    //?????????????????????
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      //???????????????
      initState(vm);
      if (options.el) {
        vm.$mount(options.el);
      }
    };
    //????????????
    Vue.prototype.$mount = function (el) {
      var vm = this;
      var ops = vm.$options;
      el = document.querySelector(el);
      if (!ops.render) {
        var template;
        if (!ops.template && el) {
          //??????template ????????????el
          template = el.outerHTML;
        } else {
          // ???template ??????template
          if (el) template = ops.template;
        }
        if (template) {
          //?????????????????????
          var render = compileToFunction(template);
          ops.render = render;
        }
      }

      //????????????
      mountComponent(vm, el);
    };
  };

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);
  initLifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
