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
