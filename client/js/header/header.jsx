var React = require('react');

var Header = React.createClass({ 
  render () {
    return (
      <div className="col1 header">
        <div className="col1-3">
          <h6>RGBA.space</h6>
        </div>

        <div className="col2-3">
          <div className="col1-3">
            <h6>Relative Colorpicker</h6>
          </div>
          <div className="col1-3">
            <h6>Hue Colorpicker</h6>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Header;
