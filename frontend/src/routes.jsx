import React from 'react';
import {Route, Router, Redirect} from 'react-router';
import {createBrowserHistory} from 'history';
import App from './App';
import SignInSide from './SignInSide';

const browserHistory = createBrowserHistory();
export const renderRoutes = () => (
    <Router history={browserHistory}>
        <div>
            <Route path="/login" component={SignInSide}/>
            <Route path="/" component={App}/>
        </div>
    </Router>
);
