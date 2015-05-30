var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var Header = require('./header/header');
var PaletteCreate = require('./palettes/create');

var Root = React.createClass({
  render () {
    return (
      <div>
        <Header/>
        <RouteHandler/>
      </div>
    )
  }
});

var routes = (
  <Route handler={Root}>
    <DefaultRoute handler={PaletteCreate}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root/>, document.getElementById('application'));
});
