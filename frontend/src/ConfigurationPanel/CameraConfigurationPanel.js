import './CameraConfigurationPanel.scss';
import axios from "axios";
import cookie from 'react-cookies';
import React, {useState} from 'react';
import { connect } from 'react-redux';
import { receiveCameraConfiguration, setCameraEntryValue, resetCameraConfigurationChangeFlag } from '../actions';
import { getCameraConfigurationEntries } from '../reducers';

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

const mapStateToProps = state => ({
    config: getCameraConfigurationEntries(state),
});

const mapDispatchToProps = dispatch => ({
    setValue: (id, value) => dispatch(setCameraEntryValue(id, value)),
    receiveConfiguration: (response) => dispatch(receiveCameraConfiguration(response)),
    resetCameraConfigurationChangeFlag: (id) => dispatch(resetCameraConfigurationChangeFlag(id)),
});

const VisibleCameraConfigurationPanel = connect(mapStateToProps,mapDispatchToProps)(CameraConfigurationPanel);

export default VisibleCameraConfigurationPanel;
