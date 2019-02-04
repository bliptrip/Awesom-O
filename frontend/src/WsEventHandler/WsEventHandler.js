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
import WebSocket from 'react-websocket';
import { connect } from 'react-redux';

class WsEventHandler extends React.Component {
    constructor(props) {
        super();
        this.cbs = {}; //Callbacks
    }

    eventHandler(message) {
        //Message is a redux action with a type field and parameters that go with action type.
        console.log("Received an event from websocket callback.");
        const action = JSON.parse(message);
        this.props.wsdispatch(action);
    }

    render() {
        return (
            <React.Fragment>
                <WebSocket url='ws://localhost:3001/' onMessage={this.eventHandler.bind(this)} />
            </React.Fragment>
        );
    };
};


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    wsdispatch: (action) => dispatch(action),
});

const ConnectedWsEventHandler = connect(mapStateToProps,mapDispatchToProps)(WsEventHandler);
export default ConnectedWsEventHandler;
