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
