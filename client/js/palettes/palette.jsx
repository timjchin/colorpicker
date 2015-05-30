var Base = require('animator3d/Base');
var Events = require('animator3d/Events');
var color = require('color');

var Palette = Base.extend({
  mixins: [Events],
  constructor(palette) { 
    this.colors = [];
    this.strings = [];
  },
  addColor (colorVal) {
    this.colors.push(new Color(colorVal));
    this.emit('changed');
  },
  getColor (index, color) {
    return this.colors[i];
  },
  setColor (index, space, vals) {
    this.colors[i].setValues(space, vals)
    this.emit('changed');
  },
  removeColor (index) {
    this.colors[i].splice(index, 1);
  }
});

module.exports = Palette;
