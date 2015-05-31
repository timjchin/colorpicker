var React = require('react');
var ColorPickerGlThree = require('./colorpicker-gl-three');
var HorizontalHue = require('./horizontal-hue');
var ColorpickerData = require('./colorpicker-data');
var ClickDownListener = require('./clickdown-listener');
var Color = require('color');
var Utils = require('animator3d/Utils');

var _scratchColor = new Color();
var ColorPickerGl = React.createClass({
  getInitialState () {
    return {
      pickerVisible: true,
      color: this.props.color || '#680AF5'
    };
  },
  getDefaultProps () {
    return {
      color: new ColorpickerData(),
      barHeight: 40
    };
  },
  componentDidMount () {
    var self = this;
    this._hsl = this.props.color.getHSL();
    if (this.state.pickerVisible) {
      this.buildGl();
    }
    this.props.color.on('change', this._onColorChange);
  },
  componentWillUpdate (prevProps, prevState) {
    if (prevState.pickerVisible !== this.state.pickerVisible && !this.pickerVisible) {
      this.destroyGl();
    }
  },
  componentDidUpdate (prevProps, prevState) {
    if (prevState.pickerVisible !== this.state.pickerVisible) {
      if (this.pickerVisible) {
        this.buildGl();
      }
    }
  },
  componentWillUnmount () {
    if (this.pickerVisible) {
      this.destroyGl();
    }
    this.props.color.off('change', this._onColorChange);
  },
  _onColorChange (e) {
    // sat
    var s = this.props.color.saturation() / 100;
    this._hue.setSaturation(s);
    this._lightness.setSaturation(s);

    // lightness
    var l = this.props.color.lightness() / 100;
    this._hue.setLightness(l);
    this._sat.setLightness(l);

    // hue
    var color = _scratchColor;
    var h = this.props.color.hue();
    
    if (h !== this._hsl[0]) {
      color.setValues('rgb', e);
      color.saturate(100);
      color.lightness(50);
      var colorArray = color.rgbArray().slice(0);
      colorArray[0] /= 255;
      colorArray[1] /= 255;
      colorArray[2] /= 255;
      this._hue.setHueColor(colorArray[0], colorArray[1], colorArray[2]);
      this._sat.setHueColor(colorArray[0], colorArray[1], colorArray[2]);
      this._lightness.setHueColor(colorArray[0], colorArray[1], colorArray[2]);
    }

    this._hsl[0] = h;
    this._hsl[1] = s * 100;
    this._hsl[2] = l * 100;

    // on color set, keep selectors in sync
    if (!this._hue.isClickDown() && !this._sat.isClickDown() && !this._lightness.isClickDown()) {
      var h = color.hue() / 360;
      this._hue.setSelectorPosFromPercent(h);
      this._hue.setHueValue(h);
      this._sat.setSelectorPosFromPercent(s);
      this._lightness.setSaturation(l);
    }
    
  },
  buildGl () {
    var h = this.props.color.hue() / 360;
    var s = this.props.color.saturation() / 100;
    var l = this.props.color.lightness() / 100;

    this._hue = new HorizontalHue({
      element: this.refs.hue.getDOMNode(),
      autoSetHue: true,
      isHue: 4,
      hue: h,
      saturation: s,
      lightness: l,
      xPos: h
    });
    this._sat = new HorizontalHue({ 
      element: this.refs.sat.getDOMNode(),
      isHue: 5,
      hue: h,
      saturation: s,
      lightness: l,
      xPos: s
    });
    this._lightness = new HorizontalHue({ 
      element: this.refs.light.getDOMNode(),
      hue: h,
      saturation: s,
      lightness: l,
      isHue: 6,
      xPos: l
    }); 
    this._hueListener = ClickDownListener(this.refs.hue.getDOMNode(), this._onHueDown);
    this._satListener = ClickDownListener(this.refs.sat.getDOMNode(), this._onSatDown);
    this._lightnessListener = ClickDownListener(this.refs.light.getDOMNode(), this._onLightnessDown);
  },
  destroyGl () {
    this._hueListener();
    this._satListener();
    this._lightnessListener();
    this._hue.destroy();
    this._sat.destroy();
    this._lightness.destroy();
  },
  _onHueDown (e) {
    var color = this._readColorToColor('_hue', e);
    this.props.color.setHue(color.hue());
  },
  _onSatDown (e) {
    var color = this._readColorToColor('_sat', e);
    this.props.color.setSaturation(color.saturation());
  },
  _onLightnessDown (e) {
    var color = this._readColorToColor('_lightness', e);
    this.props.color.setLightness(color.lightness());
  },
  _readColorToColor (key, e) {
    var x = Utils.clamp(e.offsetX, 5, this[key]._size[0] -1); 
    var y = Utils.clamp(e.offsetY, 1, this[key]._size[1] -1);

    var colorsRead = this[key].readPixel(x, this[key]._size[1] - y);
    return Color().rgb([colorsRead[0], colorsRead[1], colorsRead[2]]);
  },
  _setHueColors (color) {
    var normalized = this._getNormalized(color);
    this._sat.setHueColor(normalized[0], normalized[1], normalized[2]);
    this._lightness.setHueColor(normalized[0], normalized[1], normalized[2]);
  },
  _getNormalized (color) {
    return [color[0]/255, color[1]/255, color[2]/255];
  },
  render () {
    var barStyle = {
      height: this.props.barHeight
    };

    var colorPicker;
    if (this.state.pickerVisible) {
      colorPicker = (
        <div>
          <div className="canvas-container" ref="hue" style={barStyle}></div>
          <div className="canvas-container" ref="sat" style={barStyle}></div>
          <div className="canvas-container" ref="light" style={barStyle}></div>
        </div>
      );
    }

    var containerStyle = {
      width: this.props.width 
    };

    return (<div>{ colorPicker }</div>);
  }
});

module.exports = ColorPickerGl;
