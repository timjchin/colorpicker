var React = require('react');
var Colorwell = require('./colorwell');
var ColorPickerGl = require('./colorpicker-gl');
var ColorpickerData = require('./colorpicker-data');
var ColorDisplay = require('./color-display');
var PaletteData = require('./palette-data');
var RelativityColorDisplay = require('./relativity-color-display');
var RelativeColorChooser = require('./relative-color/chooser');

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
            <RelativityColorDisplay palette={this._palette} color={this._color} />
          </div>
          <div className="col1 colorpicker-box-container"> 
            <div className="colorpicker-container col1">
              <div className="col1-2 pad-sm">
                <ColorPickerGl color={this._color}/>
              </div>
              <div className="col1-2 pad-sm">
                <ColorDisplay color={this._color} palette={this._palette}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = App;
