var React = require('react');
var Toggle = require('./toggle');
var InputValidations = require('./input-validations');
var ChooserLine = require('./chooser-line');
var Swatch = require('./swatch');
var Utils = require('animator3d/Utils');

var ChooserBox = React.createClass({ 

  getDefaultProps () {
    return { 
      mod: {
        h: 0,
        s: 0,
        l: 0
      }
    }
  },

  componentWillMount () {
    this._mod = Utils.clone(this.props.mod);
  },

  inputChange (e) {
    this.setState({
      input: InputValidations.floatOnly(e.target.value)
    });
  },

  onChange (key, val) {
    this._mod[key] = val;
    if (this.props.onChange) this.props.onChange(this._mod);
  },

  render () {
    return (
      <div className="chooser-container">
        <ChooserLine name="H" keyId='h' onChange={this.onChange}/>
        <ChooserLine name="S" keyId='s' onChange={this.onChange}/>
        <ChooserLine name="L" keyId='l' onChange={this.onChange}/>
      </div>
    );
  }
});
module.exports = ChooserBox;
