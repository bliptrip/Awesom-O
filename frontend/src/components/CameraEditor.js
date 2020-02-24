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
import React from 'react';
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
      list: {
              width: 250,
            },
      fullList: {
              width: 'auto',
            },
});


function CameraConfigurationSettingsToggle(props) {
    let disabled = props.entry.readonly ? {"disabled": "disabled"} : {};

    function toggleCheckbox(event, entry) {
        entry.value = (event.target.checked) ? 2 : 0;
        props.setValue(entry.id, entry.value);
    }

    return (
        <div class={props.entry.changed ? "has-background-warning" : ""}>
            <label class="checkbox">
                <input type="checkbox" checked={props.entry.value} onChange={(e) => {toggleCheckbox(e, props.entry)}} {...disabled}/>
                <strong>{props.entry.label}</strong>
            </label>
        </div>
    );
}

function CameraConfigurationSettingsChoice(props) {
    let disabled = props.entry.readonly ? {"disabled": "disabled"} : {};

    function changeSelectChoice(event, entry) {
        entry.value = event.target.value;
        props.setValue(entry.id, entry.value);
    }

    return (
        <div class={props.entry.changed ? "has-background-warning" : ""}>
            <label><strong>{props.entry.label}</strong>:</label>
            <div class="select">
                <select value={props.entry.value} onChange={(e) => {changeSelectChoice(e, props.entry)}} {...disabled}>
                    {props.entry.choices.map((c) => (<option>{c}</option>))}
                </select>
            </div>
        </div>
    );
}

function CameraConfigurationSettingsString(props) {
    let disabled = props.entry.readonly ? {"disabled": "disabled"} : {};

    function changeText(event, entry) {
        entry.value = event.target.value;
        props.setValue(entry.id, entry.value);
    }

    return (
        <div class={props.entry.changed ? "has-background-warning" : ""}>
            <label><strong>{props.entry.label}</strong>:</label>
            <input type="text" placeholder={props.entry.value} value={props.entry.value} onInput={(e) => changeText(e,props.entry)} {...disabled} />
        </div>
    );
}


function CameraConfigurationSettingsDateTime(props) {
    let disabled = props.entry.readonly ? {"disabled": "disabled"} : {};

    function changeDateTime(event, entry) {
        entry.value = event.target.value;
        props.setValue(entry.id, event.target.value);
    }

    return (
        <div class={props.entry.changed ? "has-background-warning" : ""}>
            <label><strong>{props.entry.label}</strong>:</label>
            <input type="datetime-local" value={props.entry.value} onInput={(e) => {changeDateTime(e,props.entry)}} {...disabled} />
        </div>
    );
}

function CameraConfigurationSettings({config, setValue}) {
    function generateCameraSettingsTag(entry) {
        switch(entry.type) {
            case 'toggle':
                return(
                    <CameraConfigurationSettingsToggle entry={entry} setValue={setValue} />
                );
                break;
            case 'choice':
                return(
                    <CameraConfigurationSettingsChoice entry={entry} setValue={setValue} />
                );
                break;
            case 'string':
                return( 
                    <CameraConfigurationSettingsString entry={entry} setValue={setValue} />
                );
                break;
            case 'date':
                return(
                    <CameraConfigurationSettingsDateTime entry={entry} setValue={setValue} />
                );
            case 'section':
                return(
                    <React.Fragment>
                        <h1 class="is-1">{entry.label}</h1>
                        <div class="box">
                            { (entry.children).map(id => (generateCameraSettingsTag(config.entries[id]))) }
                        </div>
                    </React.Fragment>
                );
                break;
            default:
                return(
                    <div>
                        <p>Invalid Entry</p>
                    </div>
                );
                break;
        }
    }

    return( 
        <div class="container">
            { config.root && config.entries[config.root].children.map((id) => (generateCameraSettingsTag(config.entries[id]))) }
        </div>
    );
}

function CameraConfigurationPanel({config, resetCameraConfigurationChangeFlag, receiveConfiguration, setValue}) {
    const [token, setToken]      = useState(cookie.load('token'));

    function loadCurrentCameraConfiguration() {
        fetch("/camera/settings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token,
            }
        })
        .then(res => {
            if ((res.status == 401) && (res.statusText == "Unauthorized")) {
                return null;
            } else {
                return(res.json());
            }
        })
        .then(myJson => {
            console.log(JSON.stringify(myJson));
            if( myJson ) {
                receiveConfiguration(myJson);
            }
        });
    }

    function setCurrentCameraConfiguration() {
        Object.entries(config.entries)
                .filter(
                    e => e[1].changed
                )
                .forEach( e => {
                    let body = {name: e[1].label,
                                value: e[1].value  };
                    fetch("/camera/settings", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token " + token,
                        },
                        body: JSON.stringify(body),
                    })
                    .then(res => { 
                        if (res.status === 200) {
                            resetCameraConfigurationChangeFlag(e[0]);
                        }
                    });
                });
    }

    return(
        <div class="content">
            <nav class='level'>
                <div class='level-item level-left'>
                    <span>
                        <a href="#" class="button tooltip" data-tooltip="Load Camera Settings from attached Camera" onClick={loadCurrentCameraConfiguration}>
                            <span class="icon is-large">
                                <i class="fas fa-2x fa-download"></i>
                            </span>
                            <p>Download Settings</p>
                        </a>
                        <a href="#" class="button tooltip" data-tooltip="Apply Current Settings to attached Camera" onClick={setCurrentCameraConfiguration}>
                            <span class="icon is-large">
                                <i class="fas fa-2x fa-upload"></i>
                            </span>
                            <p>Upload Settings</p>
                        </a>
                    </span>
                </div>
            </nav>
            <CameraConfigurationSettings config={config} setValue={setValue} />
        </div>
    )
};

function GPhotoEditor({gphoto2Config}) {
    let config=JSON.parse(gphoto2Config);

    return (
    );
}

function CameraEditor({camera}) {
    const classes = useStyles();

    return (
        <div
            className={classes.fullList}
            role="presentation"
            onClick={}
            onKeyDown={}
        >
            <TextField label="Short Description" onChange={} value={camera.short} />
            <TextField label="Description" onChange={} value={camera.description} />
            <TextField label="Manufacturer" disabled=true value={camera.manufacturer} />
            <TextField label="Model" disabled=true value={camera.model} />
            <TextField label="Version" disabled=true value={camera.deviceVersion} />
            <TextField label="Serial Number" disabled=true value={camera.sn} />
            <GPhotoEditor gphoto2Config={camera.gphoto2Config} />
        </div>
    );
}


export default connect()(CameraEditor);
