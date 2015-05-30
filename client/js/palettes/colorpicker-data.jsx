var Model = require('animator3d/Model');
var Base = require('animator3d/Base');
var Events = require('animator3d/Events');
var Color = require('color');

var ColorModel = Base.extend({ 
  mixins: [Events],
  constructor: function (color) {
    if (color) {
      this._color = new Color('#680AF5');
    } else {
      this._color = new Color().rgb(255, 0, 0);
    }
  },
  hue: function () {
    return this._color.hue();
  },
  saturation: function () {
    return this._color.saturation();
  },
  lightness: function () {
    return this._color.lightness();
  },
  _notifyChange () { 
    var rgba = this._color.rgbaArray();
    this.emit('change', { 
      r: rgba[0],
      g: rgba[1],
      b: rgba[2],
      a: rgba[3],
    });
  },
  setHue: function (h) {
    this._color.hue(h);
    this._notifyChange();
  },
  set: function (obj) {
    this._color.setValues('rgb', obj);
    this._notifyChange();
  },
  setSaturation: function (s) {
    this._color.saturation(s);
    this._notifyChange();
  },
  setLightness: function (l) {
    this._color.lightness(l);
    this._notifyChange();
  },
  setHSL: function (h, s, l) {
    this._color.hsl([h, s, l]);
    this._notifyChange();
  },
  getString: function () {
    return this._color.rgbaString();
  }
});

module.exports = ColorModel;
