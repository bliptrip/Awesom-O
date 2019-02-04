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

import './ScheduleConfigurationPanel.scss';
import React, {useState} from 'react';

function makeRange(max) {
    const arr=[];

    for(let i = 0; i < max; i++) {
        arr.push(i);
    }

    return(arr);
}

function ScheduleEntryHeader(props) {
    return(
        <div class="columns is-1">
            <div class="column is-1">
            </div>
            <div class="column is-1">
                <strong>HH</strong>
            </div>
            <div class="column is-1">
                <strong>:</strong>
            </div>
            <div class="column is-1">
                <strong>MM</strong>
            </div>
            <div class="column is-1">
                <strong>:</strong>
            </div>
            <div class="column is-1">
                <strong>SS</strong>
            </div>
        </div>
    )
}

function ScheduleEntry(props) {
    const hours = makeRange(24);
    const minutes = makeRange(60);
    const seconds = makeRange(60);

    return(
        <div class="columns is-1">
            <div class="column is-1">
                <button class="button tooltip" data-tooltip="Delete">
                    <span class="icon is-large">
                        <i class="fas fa-times-circle"></i>
                    </span>
                </button>
            </div>
            <div class="column is-1">
                <div class="select">
                    <select>
                        {hours.map((h) => (<option value="{h}">{h}</option>))}
                    </select>
                </div>
            </div>
            <div class="column is-1">
                <strong>:</strong>
            </div>
            <div class="column is-1">
                <div class="select">
                    <select>
                        {minutes.map((m) => (<option value="{m}">{m}</option>))}
                    </select>
                </div>
            </div>
            <div class="column is-1">
                <strong>:</strong>
            </div>
            <div class="column is-1">
                <div class="select">
                    <select>
                        {seconds.map((s) => (<option value="{s}">{s}</option>))}
                    </select>
                </div>
            </div>
        </div>
    )
}

function HookScriptHeader(props) {
    return(
        <div class="columns is-1">
            <div class="column is-1">
            </div>
            <div class="column">
                <strong>Hook Script</strong>
            </div>
            <div class="column">
                <strong>Parameters</strong>
            </div>
        </div>
    )
}

function HookScriptEntry(props) {
    return(
        <div class="columns is-1">
            <div class="column is-1">
                <button class="button tooltip" data-tooltip="Delete">
                    <span class="icon is-large">
                        <i class="fas fa-times-circle"></i>
                    </span>
                </button>
            </div>
            <div class="column">
                <input type="button" class="input" />
            </div>
            <div class="column">
                <input type="text" class="input" />
            </div>
        </div>
    )
}

function ScheduleConfigurationPanel(props) {
    const [scheduleEntries, setScheduleEntries] = useState([]);

    return(
        <React.Fragment>
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <strong>Loop Count:</strong>
                    </div>
                    <div class="level-item">
                        <input type="text" class="input" value="0" readonly />
                    </div>
                </div>
            </div>
            <label>
                <button class="button" onClick={() => alert("Clicked Icon")}>
                    <span class="icon is-large" >
                        <i class="fas fa-plus-circle"></i>
                    </span>
                </button>
                <strong>Add Schedule Entry</strong>
            </label>
            <div class="box">
                <ScheduleEntryHeader />
                <ScheduleEntry />
            </div>
            <label>
                <button class="button" onClick={() => alert("Clicked Icon")}>
                    <span class="icon is-large" >
                        <i class="fas fa-plus-circle"></i>
                    </span>
                </button>
                <strong>Add Preview Hook Script</strong>
            </label>
            <div class="box">
                <HookScriptHeader />
                <HookScriptEntry />
            </div>
            <label>
                <button class="button" onClick={() => alert("Clicked Icon")}>
                    <span class="icon is-large" >
                        <i class="fas fa-plus-circle"></i>
                    </span>
                </button>
                <strong>Add Capture Hook Script</strong>
            </label>
            <div class="box">
                <HookScriptHeader />
                <HookScriptEntry />
            </div>
        </React.Fragment>
    )
};

export default ScheduleConfigurationPanel;
