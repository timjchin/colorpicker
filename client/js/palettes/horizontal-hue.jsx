var ColorPickerGlThree = require('./colorpicker-gl-three');
var Tween = require('animator3d/Tween');
var Utils = require('animator3d/Utils');
var Base = require('animator3d/Base');
var Tween = require('animator3d/Tween');

var HorizontalHue = ColorPickerGlThree.extend({ 
  _colorpickerEnum: 4,
  _splits: {
    hue: 0.25, 
    fineTune: 0.75
  },
  _splitStateEnum : {
    hue: 0,
    fineTune: 1
  },
  constructor: function (options) {
    if (!options) options = {};
    this._autoSetHue = options.autoSetHue || false;
    this._splits = Utils.clone(this._splits);
    if (!this._autoSetHue) {
      this._splits.hue = 0.0;
    }
    this._hue = options.hue || 0.0;
    this._saturation = options.saturation || 1.0;
    this._lightness = options.lightness || 0.5;
    
    this.callSuper(ColorPickerGlThree, 'constructor', options);
    this._color.setHSL(this._hue, 1.0, this._lightness);

    if (!options.xPos) options.xPos = 0;
    this._selectorPos = options.xPos * this.getContainerSize()[0] - (this._selectorWidth * 0.5);
    
    this._selector.css({
      x: this._selectorPos
    });
  },
  setSelectorPosFromPercent: function (percent) {
    this._selectorPos = percent * this.getContainerSize()[0] - (this._selectorWidth * 0.5);
    
    this._selector.css({
      x: this._selectorPos
    });
  },
  init: function () {
    this.callSuper(ColorPickerGlThree, 'init');
    this._split = this._splits.hue;
    this._splitState = this._splitStateEnum.hue;
    this._hueValue = this._hue;
    this._totalZoom = 0.1;
    this._bindListeners();
  },
  buildSelector: function () {
    this.callSuper(ColorPickerGlThree, 'buildSelector');
    if (this._autoSetHue) {
      var size = this.getContainerSize();
      this._selector.css({ 
        height: size[1] - (size[1] * this._split) + 'px'
      });
    }
  },
  _bindListeners: function () {
    this._checkFlipMouseMove = this._checkFlipMouseMove.bind(this);
    
    if (this._autoSetHue) {
      this._renderer.domElement.addEventListener('mousemove', this._checkFlipMouseMove);
    }
  },
  _setSelectorPosition: function (e) { 
    var size = this.getContainerSize();
    if (e.offsetY > size[1]) return;
    if (e.offsetX < 0) return;
    if (!this._autoSetHue) {
      this.callSuper(ColorPickerGlThree, '_setSelectorPosition', e);
    } else {
      var currY = e.offsetY;
      if (currY < (size[1] - (this._split * size[1]))) {
        this.callSuper(ColorPickerGlThree, '_setSelectorPosition', e);
      } else {
        // originalPosition + % width* totalZoom * size + offset from totalZoom + selectorWidth
        var pos = this._selectorPos + ( ((e.offsetX / size[0]) * this._totalZoom) * size[0]) - 
          (this._split * size[0] * this._totalZoom) + (this._selectorWidth * 0.5);  
        this._selector.css({ 
          x: pos 
        });
      }
    }
  },
  _setHueMouseMove: function (e) {
    if (this._splitState === this._splitStateEnum.hue) {
      var xPercent = e.offsetX / this._size[0];
      this.shader.uniforms.hueValue.value = xPercent;
    }
  },
  onClickDown: function (e) {
    this.callSuper(ColorPickerGlThree, 'onClickDown', e);
    this._setHueMouseMove(e);
  },
  setHueColor: function (x, y, z) {
    this.shader.uniforms.mainHueColor.value.setRGB(x, y, z);
  },
  setHueValue: function (value) {
    if (this._autoSetHue) {
      this.shader.uniforms.hueValue.value = value;
    }
  },
  setSaturation: function (saturation) {
    this.shader.uniforms.saturation.value = saturation;
  },
  setLightness: function (lightness) {
    this.shader.uniforms.lightness.value = lightness;
  },
  _checkFlipMouseMove: function (e) {
    var percent = e.offsetY / this._size[1];
    if (this._splitState == this._splitStateEnum.hue) {
      // 1 minus, gl is reversed
      if (percent > (1 - this._splits.hue)) {
        this.setSplit(this._splitStateEnum.fineTune);
      }
    } else {
      if (percent < (1 - this._splits.fineTune)) {
        this.setSplit(this._splitStateEnum.hue);
      }
    }
  },
  setSplit: function (val) {
    if (val === this._splitState) return;
    
    if (this._splitTween) {
      this._splitTween.halt();
    }
    var self = this;

    var newSplit = val === this._splitStateEnum.hue ? this._splits.hue : this._splits.fineTune;
    this._splitTween = new Tween({ split: this._split}).onUpdate(function (obj) {
      var size = self.getContainerSize();
      self.shader.uniforms.hueSplit.value = obj.split;
      self._split = obj.split;
      self._selector.css({ 
        height: size[1] - (size[1] * obj.split) + 'px'
      });
    }).to({ 
      properties: { split: newSplit },
      duration: 40,
      curve: 'outExpo'
    });

    this._splitState = val;
  },
  destroy: function () {
    this.callSuper(ColorPickerGlThree, 'destroy');
    this._renderer.domElement.removeEventListener('mousemove', this._checkFlipMouseMove);
  },
  _getShaderUniforms: function () {
    return Utils.extend(this.callSuper(ColorPickerGlThree, '_getShaderUniforms'), {
      hueSplit: {
        type: 'f', value: this._split
      },
      hueValue: {
        type: 'f', value: this._hueValue
      },
      totalZoom: {
        type: 'f', value: this._totalZoom
      },
      hue: {
        type: 'f', value: this._hue
      },
      saturation: {
        type: 'f', value: this._saturation
      },
      lightness: {
        type: 'f', value: this._lightness
      },
    });
  },
});

module.exports = HorizontalHue;
