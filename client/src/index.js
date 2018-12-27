import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import 'gestalt/dist/gestalt.css';
import { getToken } from './utils';

import Navbar from './components/Navbar';
import App from './components/App';
import Checkout from './components/Checkout';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Brews from './components/Brews';

import * as serviceWorker from './serviceWorker';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        getToken() !== null ? 
            <Component {...props} /> : <Redirect to={{
                pathname: '/signin',
                state: { from: props.location }
            }} />
    )} />
)

const Root = () => (
    <Router>
        <React.Fragment>
            <Navbar />
            <Switch>
                <Route exact path="/" component={App} />
                <PrivateRoute path="/checkout" component={Checkout} />
                <Route path="/signin" component={Signin} />
                <Route path="/signup" component={Signup} />
                <Route path="/:brandId" component={Brews} />
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
