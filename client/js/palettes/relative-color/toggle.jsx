var React = require('react');

/**
 * On click, toggle to the next transcluded element.
 * @class Toggle
 */
var Toggle = React.createClass({

  getDefaultProps () {
    return { 
      index: 0
    }
  },

  getInitialState () { 
    return {
      index: this.props.index
    }
  },

  getIndex () {
    return this.state.index;
  },

  onClick: function (i) {
    this.setState({ 
      index: (this.state.index + 1) % this.props.children.length
    });
  },

  render () {
    return (
      <div className='toggle-container' onClick={this.onClick}> 
        { this.props.children[this.state.index] }
      </div>
    );
  }
});

module.exports = Toggle;
