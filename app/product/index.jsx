require('../_scss/base.scss');
var ReactDom = require('react-dom');

var AppComponent = require('../_components/productBox.jsx');
ReactDom.render(<AppComponent />, document.getElementById('content'));
