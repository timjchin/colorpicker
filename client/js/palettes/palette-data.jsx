var Model = require('animator3d/Model');
var Base = require('animator3d/Base');
var Events = require('animator3d/Events');
var Utils = require('animator3d/Utils');
var Color = require('color');

function rgbaString(obj) {
   return "rgba(" + obj.r + ", " + obj.g + ", " + obj.b + ", " + obj.a + ")";
}

var PaletteData = Base.extend({ 
  mixins: [Events],
  constructor: function (color) {
    this._color = color;
    this._colors = [];
    this._colorStrings = [];
    this._colorLimit;
    this._index = 0;

    this._color.on('change', (e) => {
      this._colors[this._index] = e;
      this._colorStrings[this._index] = rgbaString(this._colors[this._index]);
      this.emit('change', this._index);
    });
  },
  getLength: function () {
    return this._colors.length;
  },
  getColorAt: function (i) {
    return this._colors[i];
  },
  getStringAt: function (i) {
    return this._colorStrings[i];
  },
  setIndex: function (i) {
    this._index = i;
    this._color.set(this._colors[i]);
  },
  reset: function (def) {
    this._colorLimit = def.colorLimit;
    this._colors = Utils.clone(def.defaults);
    for (var i = 0; i < this._colors.length; i++) { 
      this._colorStrings[i] = rgbaString(this._colors[i]);
    }
    this.setIndex(def.index || 0);
    this.emit('change');
  },
  add: function (obj) {
    this._colors.push(obj);
    this.emit('change');
  },
  insert: function (i, obj) {
    this._colors.splice(i, 0, obj);
    this.emit('change');
  },
  removeAt: function (i) {
    if (this._colors.length === 1) return;
    this._colors.splice(i, 1);
    this.emit('change');
  },
  remove: function (obj) {
    var index = this._colors.indexOf(obj);
    if (index >= 0) {
      this._colors.splice(index, 1);
    }
  },
});

module.exports = PaletteData;
