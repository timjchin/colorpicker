var React = require('react');
var Toggle = require('./toggle');
var InputValidations = require('./input-validations');

var ChooserLine = React.createClass({
  getDefaultProps () {
    return {
      name: 'Hue',
      keyId: 'h'
    }
  },

  getInitialState () {
    return {
      input: 0
    }
  },

  inputChange (e) {
    var num = InputValidations.floatOnly(e.target.value)
    this.setState({
      input: num
    });

    num = parseFloat(num);
    if (isNaN(num)) num = 0;

    var index = this.refs.toggle.getIndex();
    if (index == 1) num *= -1;
    
    this.props.onChange(this.props.keyId, num);
  },

  render () {
    return (
      <div className="inline"> 
        <h3 className="line-chooser inline">{this.props.name}</h3>
        <Toggle ref="toggle">
          <i className="fa fa-plus chooser-selection"/>
          <i className="fa fa-minus chooser-selection"/>
        </Toggle>
        <input className="input" onChange={this.inputChange} value={this.state.input} />
      </div>
    );
  }
});
module.exports = ChooserLine
