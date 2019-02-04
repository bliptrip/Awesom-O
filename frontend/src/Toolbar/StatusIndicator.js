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

import './StatusIndicator.scss'
import React, { useState } from 'react';

function StatusIndicator(props) {
    var status_color = "red";
    const [rstatus, setRStatus] = useState(props.rstatus);

    switch( rstatus ) {
        case "running":
            status_color = "green";
            break;
        case "paused":
            status_color = "yellow";
            break;
        case "stopped":
        default:
            status_color = "red";
            break;
    }

    return(
        <React.Fragment>
            <span class="icon is-large tooltip" data-tooltip="Route Status">
                <svg aria-hidden="true" data-prefix="far" data-icon="circle" class="svg-inline--fa fa-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill={status_color} d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg>
            </span>
        </React.Fragment>
    );
};

export default StatusIndicator;
