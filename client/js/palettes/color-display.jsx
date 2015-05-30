var React = require('react');
var ColorpickerData = require('./colorpicker-data');

var ColorDisplay = React.createClass({
  getDefaultProps () {
    return {
      color: new ColorpickerData()
    };
  },
  componentWillMount () {
    this.props.color.on('change', this._forceUpdate);
    this.props.palette.on('change', this._forceUpdate);
  },
  componentWillUnmount () {
    this.props.color.off('change', this._forceUpdate);
    this.props.palette.off('change', this._forceUpdate);
  },
  _forceUpdate () {
    this.forceUpdate();
  },
  render () {
    var paletteColors = [];
    for (var i = 0; i < this.props.palette.getLength(); i++) { 
      paletteColors.push(
        <div className="palettecolor"
          style={{
            backgroundColor: this.props.palette.getStringAt(i)
          }}
          key={i}
          />
      );
    }
    return (
      <div className="color-display-container">
        <div className="col1-2">
          <div className="display-colorwell" style={{width: 30, height: 30, backgroundColor: this.props.color.getString() }}></div>
          <h6>{this.props.color.getString()}</h6>
        </div>
        <div className="col1-2 pad-sm">
          {paletteColors}
        </div>
      </div>
    );
  },
});

module.exports = ColorDisplay;
