var PaletteRenderer = require('./palette-renderer');
var Color = require('color');
var React = require('react');
var Router = require('react-router');

var PaletteIndex = React.createClass({
  mixins: [ Router.State],
  getCurrentPalette () {
    var self = this;
    superagent.get('/api/palettes/')
      .end(function (err, res) {
        var palettes = res.body;
        
        if (!palettes) {
          return self.setState({
            loadingError: true
          })
        }

        for (var i = 0; i < palettes.length; i++) { 
          var palette = palettes[i];
          palette.colors = [];
          for (var j = 0; j < palette.color_set.length; j++) { 
            var colors = palette.color_set[j];
            palette.colors.push(new Color(colors));
          }
        }

        self.setState({ 
          loading: false,
          palettes: palettes
        });
      });
  },
  getInitialState () {
    return {
      loading: true
    }
  },
  componentWillMount () {
    this.getCurrentPalette()
  },
  render () {
    if (this.state.loading) {
      return (
        <div>Loading</div>
      );
    } else {
      return (
        <div className="pad-m"> 
          {
            this.state.palettes.map(function (palette, i) {
              return <PaletteRenderer key={i} palette={palette}/>;
            })
          }
        </div>
      );
    }
  }
});

module.exports = PaletteIndex;
