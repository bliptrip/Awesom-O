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
import Tooltip from '@material-ui/core/Tooltip';

class TrafficLightIcon extends React.Component {
    const traffic_color_off = '#333333';
    const traffic_color_none = {'red': traffic_color_off, 'yellow': traffic_color_off, 'green': traffic_color_off};
    const traffic_color_map = {'red': '#ab2300', 'yellow': '#ffda44', 'green': '#91cc04'};

    constructor(props) {
        super(props);
        this.state = this.traffic_color_none;
        this.setTrafficLightColor(props.activeStatus);
    }

    setTrafficLightColor(activeStatus) {
        let activeColor;
        var newState = {...traffic_color_none};
        switch( activeStatus ) {
            case AWESOMO_RUNNING_STATUS_RUNNING:
                activeColor = 'green';
                break;
            case AWESOMO_RUNNING_STATUS_PAUSED:
                activeColor = 'yellow';
                break;
            case AWESOMO_RUNNING_STATUS_STOPPED:
                activeColor = 'red';
                break;
            default:
                activeColor = 'none';
                break;
        }
        newState[activeColor] = traffic_color_map[activeColor];
        this.setState(newState);
    }

    componentDidMount() {
        this.setTrafficLightColor(this.props.activeStatus);
    }

    componentDidUpdate(prevProps) {
        if( prevProps.activeStatus != this.props.activeStatus ) {
            this.setTrafficLightColor(this.props.activeStatus);
        }
    }

    render() {
        return(
            <SvgIcon fontSize="large">
                <g id="Traffic_light" data-name="Traffic light">
                    <rect fill="#57565c" height="400" rx="32" width="160" x="176" y="16"/>
                    <circle cx="256" cy="96" fill={this.state['red']} r="48"/>
                    <circle cx="256" cy="216" fill={this.state['yellow']} r="48"/>
                    <circle cx="256" cy="336" fill={this.state['green']} r="48"/>
                    <g fill="#2d2d30">
                        <path d="m232 416h48v80h-48z"/>
                        <path d="m152 48h24a0 0 0 0 1 0 0v96a0 0 0 0 1 0 0h-8a16 16 0 0 1 -16-16v-80a0 0 0 0 1 0 0z"/>
                        <path d="m152 288h24a0 0 0 0 1 0 0v96a0 0 0 0 1 0 0h-8a16 16 0 0 1 -16-16v-80a0 0 0 0 1 0 0z"/>
                        <path d="m152 168h24a0 0 0 0 1 0 0v96a0 0 0 0 1 0 0h-8a16 16 0 0 1 -16-16v-80a0 0 0 0 1 0 0z"/>
                        <path d="m352 48h8a0 0 0 0 1 0 0v96a0 0 0 0 1 0 0h-24a0 0 0 0 1 0 0v-80a16 16 0 0 1 16-16z" transform="matrix(-1 0 0 -1 696 192)"/>
                        <path d="m352 288h8a0 0 0 0 1 0 0v96a0 0 0 0 1 0 0h-24a0 0 0 0 1 0 0v-80a16 16 0 0 1 16-16z" transform="matrix(-1 0 0 -1 696 672)"/>
                        <path d="m352 168h8a0 0 0 0 1 0 0v96a0 0 0 0 1 0 0h-24a0 0 0 0 1 0 0v-80a16 16 0 0 1 16-16z" transform="matrix(-1 0 0 -1 696 432)"/>
                    </g>
                    <path d="m256 160a56 56 0 1 0 56 56 56.064 56.064 0 0 0 -56-56zm0 96a40 40 0 1 1 40-40 40.045 40.045 0 0 1 -40 40z"/>
                    <path d="m256 40a56 56 0 1 0 56 56 56.064 56.064 0 0 0 -56-56zm0 96a40 40 0 1 1 40-40 40.045 40.045 0 0 1 -40 40z"/>
                    <path d="m256 280a56 56 0 1 0 56 56 56.064 56.064 0 0 0 -56-56zm0 96a40 40 0 1 1 40-40 40.045 40.045 0 0 1 -40 40z"/>
                    <path d="m256 64a8 8 0 0 0 0 16 16.019 16.019 0 0 1 16 16 8 8 0 0 0 16 0 32.036 32.036 0 0 0 -32-32z"/>
                    <path d="m256 184a8 8 0 0 0 0 16 16.019 16.019 0 0 1 16 16 8 8 0 0 0 16 0 32.036 32.036 0 0 0 -32-32z"/>
                    <path d="m256 304a8 8 0 0 0 0 16 16.019 16.019 0 0 1 16 16 8 8 0 0 0 16 0 32.036 32.036 0 0 0 -32-32z"/>
                    <path d="m368 128v-80a8 8 0 0 0 -8-8h-16.8a40.067 40.067 0 0 0 -39.2-32h-96a40.067 40.067 0 0 0 -39.195 32h-16.805a8 8 0 0 0 -8 8v80a24.027 24.027 0 0 0 24 24v8h-16a8 8 0 0 0 -8 8v80a24.027 24.027 0 0 0 24 24v8h-16a8 8 0 0 0 -8 8v80a24.027 24.027 0 0 0 24 24h.805a40.067 40.067 0 0 0 39.195 32h16v72a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8v-72h16a40.067 40.067 0 0 0 39.2-32h.8a24.027 24.027 0 0 0 24-24v-80a8 8 0 0 0 -8-8h-16v-8a24.027 24.027 0 0 0 24-24v-80a8 8 0 0 0 -8-8h-16v-8a24.027 24.027 0 0 0 24-24zm-16 0a8.009 8.009 0 0 1 -8 8v-80h8zm-192 0v-72h8v80a8.009 8.009 0 0 1 -8-8zm0 120v-72h8v80a8.009 8.009 0 0 1 -8-8zm0 120v-72h8v80a8.009 8.009 0 0 1 -8-8zm112 120h-32v-64h32zm32-80h-96a24.027 24.027 0 0 1 -24-24v-336a24.027 24.027 0 0 1 24-24h96a24.027 24.027 0 0 1 24 24v336a24.027 24.027 0 0 1 -24 24zm48-112v72a8.009 8.009 0 0 1 -8 8v-80zm0-120v72a8.009 8.009 0 0 1 -8 8v-80z"/>
                </g>
            </SvgIcon>
        );
    }
}


function StatusIndicator({activeUser, activeStatus}) {
    return(
        <React.Fragment>
            <Tooltip title="Active user: "+activeUser+" State: "+activeStatus >
                <TrafficLightIcon activeStatus={activeStatus} />
            </Tooltip>
        </React.Fragment>
    );
};

export default StatusIndicator;
