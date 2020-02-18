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

import React, { Component } from 'react';
import {Redirect} from 'react-router-dom/Redirect';
import cookie from 'react-cookies';
import Toolbar from './components/Toolbar';
import fetch from 'cross-fetch'; //Backwards-compatibility if fetch not supported by browser
//import VisibleViewport from './Viewport/Viewport';
//import ConfigurationPanel from './ConfigurationPanel/ConfigurationPanel';
import ConnectedWsEventHandler from './WsEventHandler/WsEventHandler';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedin: false,
            email: cookie.load('email'),
            token: cookie.load('token')
        }
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    };

    handleTokenChange(token) {
        cookie.save('token', token, { path: '/' });
        this.setState({token});
    };

    handleEmailChange(email) {
        cookie.save('email', email, { path: '/' });
        this.setState({email});
    };

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin() {
        var fetchp = fetch("/api/users/current", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + this.state.token,
                }
            })
            .then(res => {
                if ((res.status === 401) && (res.statusText === "Unauthorized")) {
                    this.setState( { loggedin: false } );
                } else {
                    this.setState( { loggedin: true } );
                }
                console.log(res);
            });
        return(fetchp);
    }

    renderLogin() {
        if(!this.state.loggedin)
            return <Redirect url='/login' />
    }

    render() {
        return (
            <div>
                <ConnectedWsEventHandler />
                {this.renderLogin()}
                <div class="container">
                    <Toolbar />
                </div>
            </div>
        );
    }
}

export default App;
