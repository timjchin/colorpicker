var React = require('react');

var ColorwellVertical = React.createClass({ 

  removeAt (e) {
    e.stopPropagation();
    this.props.palette.removeAt(this.props.index);
  },

  addAt (e) {
    e.stopPropagation();
    var color = this.props.color.clone();
    color.darken(0.05);
    var colorObj = color.rgbaArray();
    this.props.palette.insert(this.props.index + 1, { 
      r: colorObj[0],
      g: colorObj[1],
      b: colorObj[2],
      a: colorObj[3],
    });
  },
  
  render() { 
    var style = { 
      backgroundColor: this.props.color.rgbaString(),
      width: this.props.width,
      left: this.props.offset
    };

    var className = "colorwell-hex ";
    var textClass = this.props.color.lightness() < 50 ?
      " light-text" : " dark-text";
    
    return (
      <div 
        className="colorwell-vertical" 
        onClick={this.props.onClick}
        style={style}>
        <h6 className={"colorwell-hex" + textClass}>
          {this.props.color.hexString()} <br/>
          {this.props.color.rgbaString()} <br/>
        </h6>
        <i className={"fa fa-close button delete-item" + textClass} onClick={this.removeAt}/>
        <i className={"fa fa-plus button add-item" + textClass} onClick={this.addAt}/>
      </div>
    );
  }

});
module.exports = ColorwellVertical;
