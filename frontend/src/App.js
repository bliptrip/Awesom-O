import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import cookie from 'react-cookies';
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import Toolbar from './Toolbar/Toolbar';
import Viewport from './Viewport/Viewport';
import ConfigurationPanel from './ConfigurationPanel/ConfigurationPanel';

class Online  extends Component {
    render() {
        return(
            <div>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </div>
        );
    }
}

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { email: props.email,
                       password: "" };
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    }

    updateEmail(e) {
        this.setState({ email: e.target.value });
    }

    updatePassword(e) {
        this.setState({ password: e.target.value });
    }

    handleSubmitLogin() {
        this.props.submitLogin(this.state.email, this.state.password);
    }


    createLogin() {
        axios.post("/api/users/", {
            email: this.state.email,
            password: this.state.password 
            }).then( res => {
                console.log(res);
            });
    }

    isActive(loggedin) {
        return( loggedin ? "" : "is-active" );
    }

    render() {
        return(
            <div class={"modal "+this.isActive(this.props.loggedin)}>
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Login</p>
                    </header>
                    <section class="modal-card-body">
                        <label>Email</label>
                        <input
                            type="text"
                            value={this.state.email}
                            onChange={this.updateEmail}
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={this.updatePassword}
                        />
                        <button onClick={this.handleSubmitLogin}>Submit Login</button>
                    </section>
                </div>
            </div>);
    }
}

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

    handleSubmitLogin(email, password) {
        this.setState( { email: email } );
        cookie.save('email', email, { path: '/' });

        axios.post("/api/users/login", {
              user: {
                email: email,
                password: password 
              }
            }).then( res => {
                if( res.status == 200 ) {
                    console.log("Successfully logged in!");
                    cookie.save('token', res.data.user.token, { path: '/' });
                    this.setState( {token: res.data.user.token, loggedin: true} );
                } else {
                    alert("Failed to login: Status code: " + res.status + ": " + res.statusText);
                    this.setState( {loggedin: false} );
                }
            });
    }

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
                if ((res.status == 401) && (res.statusText == "Unauthorized")) {
                    this.setState( { loggedin: false } );
                } else {
                    this.setState( { loggedin: true } );
                }
                console.log(res);
            });
        return(fetchp);
    }

    render() {
        return (
            <div>
                <div class="container">
                    <Toolbar user={this.state.email} rstatus="running" />
                    <Viewport />
                    <ConfigurationPanel />
                </div>
                <Login loggedin={this.state.loggedin} email={this.state.email} submitLogin={this.handleSubmitLogin} />
            </div>
        );
    }
}

export default App;
