var React = require('react');
var Colorwell = require('./colorwell');

var PaletteRenderer = React.createClass({
  componentDidMount () {
    console.log('colorwell', this.props.palette);
  },
  render () {
    var p = this.props.palette;
    return (
      <div className="col1">
        <h4 className="palette-renderer-title">
          {p.name}
        </h4>
        <div className="col1 pad-m-b">
          { 
            p.colors.map(function (color, i) {
              return <Colorwell key={i} color={color}/>;
            })
          }
        </div>
      </div>
    );
  }

});

module.exports = PaletteRenderer;
