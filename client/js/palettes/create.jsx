var React = require('react');
var Colorwell = require('./colorwell');
var ColorPickerGl = require('./colorpicker-gl');
var ColorpickerData = require('./colorpicker-data');
var ColorDisplay = require('./color-display');
var PaletteData = require('./palette-data');
var RelativityColorDisplay = require('./relativity-color-display');
var RelativeColorChooser = require('./relative-color/chooser');
var PaletteDisplay = require('./palette-display');

var App = React.createClass({
  componentWillMount: function () {
    this._color = new ColorpickerData();
    this._palette = new PaletteData(this._color);
  },
  render () {
    return (
      <div>
        <div className="app-body">
          <div>
            <PaletteDisplay palette={this._palette} color={this._color} />
          </div>
          <div className="col1 colorpicker-box-container"> 
            <div className="colorpicker-container col1">
              <ColorPickerGl color={this._color}/>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = App;
