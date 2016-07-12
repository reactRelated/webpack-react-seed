require('../_scss/base.scss');
require('./index.scss');


var AppComponent = require('../_components/productBox.jsx');
ReactDom.render(<AppComponent />, document.getElementById('app'));
