/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  202  Andrew F. Maule

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

import React, { useState } from 'react';
import cookie from 'react-cookies';
import PlayCircleOutlineTwoToneIcon from '@material-ui/icons/PlayCircleOutlineTwoTone';
import PauseCircleOutlineTwoToneIcon from '@material-ui/icons/PauseCircleOutlineTwoTone';
import StopTwoToneIcon from '@material-ui/icons/StopTwoTone';
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import {ButtonGroup, Tooltip, IconButton} from '@material-ui/core/';

function RouteToolbar(props) {
    function sendControllerCommand(url) {
        fetchAwesomOJWT(url, 
            method = "PUT",
            headers = {
                "Content-Type": "application/json",
                "Authorization": "Token " + props.token,
            },
        })
        .then(res => { 
            if (res.status === 200) {
                console.log("Succeeded in sending controller command.");
            }
        });
    }

    function moveArmNorth() {
        sendControllerCommand("/controller/move/north/plates/1");
    }

    function moveArmEast() {
        sendControllerCommand("/controller/move/east/plates/1");
    }

    function moveArmSouth() {
        sendControllerCommand("/controller/move/south/plates/1");
    }

    function moveArmWest() {
        sendControllerCommand("/controller/move/west/plates/1");
    }

    function moveArmHome() {
        sendControllerCommand("/controller/home");
    }

    function renderStartPauseButton() {
        if( props.state == "running" ) {
            return(<Tooltip title="Pause Route">
                <IconButton aria-label="pause route">
                    <PauseCircleOutlineTwoToneIcon />
                </IconButton>
            </Tooltip>);
        } else {
            return(<Tooltip title="Start Route">
                <IconButton aria-label="start route">
                    <PlayCircleOutlineTwoToneIcon />
                </IconButton>
            </Tooltip>);
        }
    }

    return(
        <div>
            <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
                {renderStartPauseButton();}
                <Tooltip title="Stop Route">
                    <IconButton aria-label="stop route">
                        <StopTwoToneIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Go Home">
                    <IconButton aria-label="home">
                        <HomeTwoToneIcon />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
        </div>
    )
};

export default RouteToolbar;
