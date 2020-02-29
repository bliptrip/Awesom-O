/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2020  Andrew F. Maule

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

import 'babel-polyfill';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom/Redirect';
import cookie from 'react-cookies';
import Mainview from './components/Mainview';
import fetch from 'cross-fetch'; //Backwards-compatibility if fetch not supported by browser
//import VisibleViewport from './Viewport/Viewport';
//import ConfigurationPanel from './ConfigurationPanel/ConfigurationPanel';
import ConnectedWsEventHandler from './WsEventHandler/WsEventHandler';
import SignIn from './SignIn';

import {viewportGetCurrentPicture} from './actions';

function App({loggedin, getCurrentPicture}) {
    if(loggedin !== true) {
        return(<SignIn />);
    } else {
        getCurrentPicture(); /* Retrieve current picture off backend server, if available. */
        return(
            <div>
                <ConnectedWsEventHandler />
                <Mainview />
            </div>
        );
    }
}

export const mapStateToProps = (state) => ({
    loggedin: state.user.loggedin
});

export const mapDispatchToProps = (dispatch) => ({
    getCurrentPicture: () => dispatch(viewportGetCurrentPicture())
});

export default connect(mapStateToProps,mapDispatchToProps)(App);
