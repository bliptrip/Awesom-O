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

import './RouteToolbar.scss'
import React, { useState } from 'react';
import cookie from 'react-cookies';

function RouteToolbar(props) {
    const [token, setToken]      = useState(cookie.load('token'));

    function sendControllerCommand(url) {
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token,
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

    return(
        <div>
            <div class="level">
                <div class="level-item">
                    <a href="#" class="button tooltip" data-tooltip="Start/Pause Route">
                        <span class="icon is-large">
                            <i class="fas fa-2x fa-play-circle"></i>
                        </span>
                    </a>
                </div>
                <div class="level-item">
                    <a href="#" class="button tooltip" data-tooltip="Stop Route">
                        <span class="icon is-large">
                            <i class="fas fa-2x fa-stop-circle"></i>
                        </span>
                    </a>
                </div>
                <div class="is-divider" data-content=""></div>
                <div class="level-item">
                    <div class="tile is-ancestor">
                        <div class="tile is-vertical">
                            <div class="tile is-parent">
                                <div class="tile is-child" />
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm Up" onClick={moveArmNorth}>
                                        <span class="icon is-medium">
                                            <i class="fas fa-caret-up"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="tile is-child" />
                            </div>
                            <div class="tile is-parent">
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm Left" onClick={moveArmWest}>
                                        <span class="icon is-medium tooltip">
                                            <i class="fas fa-caret-left"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm to Home Position" onClick={moveArmHome}>
                                        <span class="icon is-medium">
                                            <i class="fas fa-home"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm Right" onClick={moveArmEast}>
                                        <span class="icon is-medium">
                                            <i class="fas fa-caret-right"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div class="tile is-parent">
                                <div class="tile is-child" />
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm Down" onClick={moveArmSouth}>
                                        <span class="icon is-medium">
                                            <i class="fas fa-caret-down"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="tile is-child" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default RouteToolbar;
