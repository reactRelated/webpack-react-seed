require('../_scss/base.scss');

var React = require('react');
var ReactDom = require('react-dom');

var AppComponent = require('../_components/productBox2.jsx');
ReactDom.render(<AppComponent />, document.getElementById('order'));
