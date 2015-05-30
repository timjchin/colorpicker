var React = require('react');
var Toggle = require('./toggle');
var InputValidations = require('./input-validations');
var ChooserLine = require('./chooser-line');
var Swatch = require('./swatch');
var Utils = require('animator3d/Utils');
var ChooserBox = require('./chooser-box');
var Color = require('color');

var Chooser = React.createClass({ 
  getDefaultProps () { 
    return {
      parentColor: new Color({r: 50, g: 25, b: 50 })
    }
  },
  getInitialState() { 
    return {
      childColor: this.props.parentColor.clone()
    }
  },

  update (diff) {
    var hsl = this.props.parentColor.hslArray().slice(0);
    hsl[0] = (hsl[0] + diff.h) % 360;
    hsl[1] = (hsl[1] + diff.s) % 100;
    hsl[2] = (hsl[2] + diff.l) % 100;
    
    var color = new Color()
    color.setValues('hsl', hsl);
    this.setState({ 
      childColor: color
    });
  },

  render () {
    return (
      <div className="pad-sm hsl-chooser"> 
        <Swatch />
        <ChooserBox onChange={this.update}/>
        <Swatch color={this.state.childColor} />
      </div>
    );
  }
});
module.exports = Chooser;
