import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'gestalt/dist/gestalt.css';

import Navbar from './components/Navbar';
import App from './components/App';
import Checkout from './components/Checkout';
import Signup from './components/Signup';
import Signin from './components/Signin';
import * as serviceWorker from './serviceWorker';

const Root = () => (
    <Router>
        <React.Fragment>
            <Navbar />
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/signin" component={Signin} />
                <Route path="/signup" component={Signup} />
            </Switch>
        </React.Fragment>
    </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
    module.hot.accept();
}
