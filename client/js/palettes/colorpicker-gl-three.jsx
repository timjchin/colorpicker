var THREE = require('three');
var ThreeBase = require('../threex/ThreeBase');
var ColorPickerVert = require('./colorpicker.vert.glsl');
var ColorPickerFrag = require('./colorpicker.frag.glsl');
var Tween = require('animator3d/Tween');
var Utils = require('animator3d/Utils');
var fboRendererMixin = require('./fbo-renderer.mixin');
var ClickDownListener = require('./clickdown-listener');
var DOM = require('animator3d/DOM');

var ColorPicker = ThreeBase.extend({ 
  _trackball: false,
  _colorpickerEnum: 4,
  _selectorWidth: 16,
  mixins: [fboRendererMixin],

  constructor: function (options) {
    this.callSuper(ThreeBase, 'constructor', options);
    this._colorpickerEnum = options.isHue || this._colorpickerEnum;

    this._renderer.setClearColor(0xeeeeee);
    this._renderer.domElement.className = 'colorpicker-canvas';

    this.init();
    this.buildPlane();
    this.initFBORenderer();
    this.buildSelector();
  },
  init: function () {
    this._clickDownListener = ClickDownListener(this._renderer.domElement, this.onClickDown, this);
  },
  onClickDown: function (e) {
    this._setSelectorPosition(e);
  },
  isClickDown: function () {
    return this._clickDownListener.isDown();
  },
  _setSelectorPosition: function (e) {
    var size = this.getContainerSize();
    this._selectorPos = e.offsetX - this._selectorWidth * 0.5;
    this._selector.css({ 
      x: this._selectorPos
    });
  },
  tweenColor: function (color) {
    var self = this;
    var currHSL = self._color.getHSL();
    var futureHSL = color.getHSL();
    var tween = new Tween(currHSL).onUpdate(function (obj) {
      self._color.setHSL(obj.h, obj.s, obj.l);
    }).to({
      properties: futureHSL,
      duration: 200,
      curve: 'linear',
    });
  },
  _createCamera: function () {
    var size = this.getContainerSize();
    var width = size[0], height = size[1];
    this._camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    this._camera.position.z = -1000;
    this._camera.lookAt( this._scene.position );
  },
  buildPlane: function () {
    var size = this.getContainerSize();
    var geometry = new THREE.PlaneBufferGeometry( size[0], size[1], 32 );

    this._windowSize = new THREE.Vector2(size[0], size[1]);

    this._color = new THREE.Color(0xff0000);

    this.shader = new THREE.ShaderMaterial({ 
      vertexShader: ColorPickerVert,
      fragmentShader: ColorPickerFrag,
      uniforms: this._getShaderUniforms()
    });
    var plane = new THREE.Mesh( geometry, this.shader );
    plane.lookAt(this._camera.position);
    this.add(plane);
  },
  _getShaderUniforms: function () {
    return {
      windowSize: {
        type: 'v2', value: this._windowSize
      },
      mainHueColor: {
        type: 'c', value: this._color
      },
      isHueComponent: {
        type: 'i', value: this._colorpickerEnum
      } 
    }
  },
  buildSelector: function () {
    var size = this.getContainerSize();
    this._selectorDiv = document.createElement('div');
    this._selectorDiv.style.height = size[1] + 'px';
    this._selectorDiv.style.width = this._selectorWidth + 'px';
    this._selectorDiv.style.position = 'absolute';
    this._selectorDiv.className = 'selector';
    this._selectorDiv.style.top = 2;
    this._selector = new DOM(this._selectorDiv);
    this._container.appendChild(this._selectorDiv);
  },
  _onResize: function () {
    var size = this.callSuper(ThreeBase, '_onResize');
    if (this._windowSize) {
      this._windowSize.set(this._size[0], this._size[1]);
    }
    this.fboRendererResize();
  },
  render: function () {
    this.fboRendererRender(); 
  },
  destroy: function () {
    this.callSuper(ThreeBase, 'destroy');
    this._clickDownListener.off();
  },
  update: function () { 
  },
});


module.exports = ColorPicker;
