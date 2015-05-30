var React = require('react');
var Colorwell = require('./colorwell');
var ColorwellVertical = require('./colorwell-vertical');
var Color = require('color');

var PaletteDisplay = React.createClass({ 

  componentWillMount () {
    this.props.palette.reset({
      limit: 5,
      defaults: [
        { r: 107, g: 172, b: 245, a: 1 },
        { r: 27, g: 61, b: 133, a: 1 },
      ]
    });

    this.props.palette.on('change', this._handlePaletteChange);
    window.addEventListener('resize', this.resize);
  },

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize);
  },
  resize () {
    this.forceUpdate();
  },

  _handlePaletteChange () {
    this.forceUpdate();
  },

  clickIndex (index) {
    return (e) => {
      e.stopPropagation();
      this.props.palette.setIndex(index);
    }
  },
  render() {
    var divs = [];
    var width = ~~(window.innerWidth / this.props.palette.getLength());
    var height = window.innerHeight - 40 - 130;
    var offset = 0;
    for (var i = 0; i < this.props.palette.getLength(); i++) { 
      divs.push( 
        <ColorwellVertical
          key={i}
          index={i}
          offset={offset}
          palette={this.props.palette}
          color={new Color(this.props.palette.getColorAt(i))}
          onClick={this.clickIndex(i)}
          width={width}/>
      );
      offset += width;
    }
    return (
      <div className="palette-display col1" style={{height: height}}>
        { divs }
      </div>
    );
  }
});

module.exports = PaletteDisplay;
