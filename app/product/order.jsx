require('../_scss/base.scss');
require('./order.scss');

var AppComponent = require('../_components/productBox3.jsx');
ReactDom.render(<AppComponent />, document.getElementById('order'));
