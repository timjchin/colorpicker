var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var PaletteIndex = require('./palettes/palette-index');

var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var Root = React.createClass({
  render () {
    return (
      <div>
        <RouteHandler/>
      </div>
    )
  }
});

var routes = (
  <Route handler={Root}>
    <Route path="/accounts/profile" handler={PaletteIndex}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root/>, document.getElementById('application'));
});
