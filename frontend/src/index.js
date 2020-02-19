/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2019  Andrew F. Maule

Awesom-O is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Awesom-O is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this Awesom-O.  If not, see <https://www.gnu.org/licenses/>.
**************************************************************************************/

import React from 'react';
import ReactDOM from 'react-dom';
import rootReducer from './reducers';
import {createStore, applyMiddleware} from 'redux';
import {connect, Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk'; //Needed to dispatch thunk actions
import * as serviceWorker from './serviceWorker';
import {userCheckCurrent} from './actions';
import {Route, Router} from 'react-router';
import {createBrowserHistory} from 'history';
import App from './App';
import SignIn from './SignIn';
import SignUp from './SignUp';

const store = createStore( rootReducer,
                           applyMiddleware(thunkMiddleware) );
const browserHistory = createBrowserHistory();

function ProviderWrapper({checkLogState}) {
    checkLogState(); //Dispatch a request to check current login state
    return (
        <Router history={browserHistory}>
            <div>
                <Route path="/signup" component={SignUp}/>
                <Route path="/login" component={SignIn}/>
                <Route exact path="/" component={App}/>
            </div>
        </Router>
    );
}

const mapDispatchToProps = (dispatch) => ({
    checkLogState: () => dispatch(userCheckCurrent())
});

const VisibleProviderWrapper = connect(null, mapDispatchToProps)(ProviderWrapper);

export default function Root() {
    return (
        <Provider store={store}>
            <VisibleProviderWrapper />
        </Provider>
    );
}

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
