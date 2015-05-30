var React = require('react');

var RelativityColorDisplay = React.createClass({ 

  componentWillMount () {
    this.props.palette.reset({
      limit: 5,
      defaults: [
        { r: 107, g: 172, b: 245, a: 1 },
        { r: 27, g: 61, b: 133, a: 1 },
        { r: 250, g: 248, b: 103, a: 1 },
        { r: 246, g: 157, b: 90, a: 1 },
        { r: 227, g: 154, b: 77, a: 1 }
      ]
    });

    this.props.palette.on('change', this._handlePaletteChange);
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
    var styles = [];
    for (var i = 0; i < this.props.palette.getLength(); i++) { 
      styles[i] = { 
        backgroundColor: this.props.palette.getStringAt(i)
      }
    }
    return (
      <div className="relativity-display col1">
        <div 
          onClick={this.clickIndex(0)} 
          className="box-1 col1 selectable" 
          style={styles[0]}>
            <div 
              onClick={this.clickIndex(4)} 
              className="box-main selectable" 
              style={styles[4]}>
            </div>
        </div>
        <div 
          className="box-2 col1 selectable" 
          style={styles[1]}
          onClick={this.clickIndex(1)} />
        <div 
          className="box-2 col1 selectable"
          style={styles[2]}
          onClick={this.clickIndex(2)} />
        <div 
          className="box-1 col1 bottom selectable" 
          style={styles[3]}
          onClick={this.clickIndex(3)}>
          <div 
            className="box-main selectable" 
            style={styles[4]}
            onClick={this.clickIndex(4)} />
        </div>
      </div>
    );
  }
});

module.exports = RelativityColorDisplay;
