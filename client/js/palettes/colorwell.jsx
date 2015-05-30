var React = require('react');
var Color = require('color');
var Colorwell = React.createClass({
  propTypes: {
    color: React.PropTypes.instanceOf(Color)
  },
  getDefaultProps() {
    return {
      width: 100,
      height: 100,
      text: 'rgba'
    }
  },
  render () {
    var bgStyle = {
      backgroundColor: this.props.color.rgbaString(),
      width: this.props.width,
      height: this.props.height
    }

    if (this.props.text === 'rgba') {
      var arr = this.props.color.rgbaArray();
      var text = (
        <div>
          <h6 className="pad-sm"><span className="bold pad-sm-r">R</span><span className="alt-font"> {arr[0]} </span></h6>
          <h6 className="pad-sm"><span className="bold pad-sm-r">G</span><span className="alt-font"> {arr[1]} </span></h6>
          <h6 className="pad-sm"><span className="bold pad-sm-r">B</span><span className="alt-font"> {arr[2]} </span></h6>
          <h6 className="pad-sm"><span className="bold pad-sm-r">A</span><span className="alt-font"> {arr[3]} </span></h6>
        </div>
      );
    }

    return (
      <div className="colorwell-container">
        <div className="colorwell-color" style={bgStyle} />
        <h5 className="colorwell-text pad0">
          {text}
        </h5>
      </div>
    );
  }

});

module.exports = Colorwell;

