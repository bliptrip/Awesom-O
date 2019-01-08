import './CameraConfigurationPanel.scss';
import axios from "axios";
import cookie from 'react-cookies';
import React, {useState} from 'react';

function CameraConfigurationSettingsToggle(props) {
    const [toggleState, setToggleState] = useState((props.entry.value == 0) ? false : true);

    function toggleCheckbox(event, entry) {
        entry.value = (event.target.checked) ? 2 : 0;
        setToggleState(event.target.checked);
        props.changeCameraConfiguration();
    }

    return (
        <div>
            <label class="checkbox">
                <input type="checkbox" checked={toggleState} onChange={(e) => {toggleCheckbox(e, props.entry)}}/>
                <strong>{props.entry.label}</strong>
            </label>
        </div>
    );
}

function CameraConfigurationSettingsChoice(props) {
    const [choice, setChoice] = useState(props.entry.value);

    function changeSelectChoice(event, entry) {
        entry.value = event.target.value;
        setChoice(entry.value);
        props.changeCameraConfiguration();
    }

    return (
        <div>
            <label><strong>{props.entry.label}</strong>:</label>
            <div class="select">
                <select value={choice} onChange={(e) => {changeSelectChoice(e, props.entry)}}>
                    {props.entry.choices.map((c) => (<option>{c}</option>))}
                </select>
            </div>
        </div>
    );
}

function CameraConfigurationSettingsString(props) {
    const [text, setText] = useState(props.entry.value);

    function changeText(event, entry) {
        entry.value = event.target.value;
        setText(entry.value);
        props.changeCameraConfiguration();
    }

    return (
        <div>
            <label><strong>{props.entry.label}</strong>:</label>
            <input type="text" placeholder={text} value={text} onInput={(e) => changeText(e,props.entry)} />
        </div>
    );
}


function CameraConfigurationSettingsDateTime(props) {
    const [dateTime, setDateTime] = useState(props.entry.value);

    function changeDateTime(event, entry) {
        entry.value = event.target.value;
        setDateTime(entry.value);
        props.changeCameraConfiguration();
    }

    return (
        <div>
            <label><strong>{props.entry.label}</strong>:</label>
            <input type="datetime-local" value={props.entry.value} onInput={(e) => {changeDateTime(e,props.entry)}} />
        </div>
    );
}

function CameraConfigurationSettings(props) {
    function generateCameraSettingsTag(cameraSettingsEntry) {
        switch(cameraSettingsEntry.type) {
            case 'toggle':
                return(
                    <CameraConfigurationSettingsToggle entry={cameraSettingsEntry} changeCameraConfiguration={props.changeCameraConfiguration}/>
                );
                break;
            case 'choice':
                return(
                    <CameraConfigurationSettingsChoice entry={cameraSettingsEntry} changeCameraConfiguration={props.changeCameraConfiguration}/>
                );
                break;
            case 'string':
                return( 
                    <CameraConfigurationSettingsString entry={cameraSettingsEntry} changeCameraConfiguration={props.changeCameraConfiguration}/>
                );
                break;
            case 'date':
                return(
                    <CameraConfigurationSettingsDateTime entry={cameraSettingsEntry} changeCameraConfiguration={props.changeCameraConfiguration}/>
                );
            case 'section':
                return(
                    <React.Fragment>
                        <h1 class="is-1">{cameraSettingsEntry.label}</h1>
                        <div class="box">
                            { Object.keys(cameraSettingsEntry.children).map(key => (generateCameraSettingsTag(cameraSettingsEntry.children[key]))) }
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
            { Object.keys(props.cameraConfiguration.main.children).map((key) => (generateCameraSettingsTag(props.cameraConfiguration.main.children[key]))) }
        </div>
    );
}

function CameraConfigurationPanel(props) {
    const [cameraConfiguration, setCameraConfiguration] = useState(props.cameraConfiguration.configuration.cameraConfiguration);
    const [token, setToken]      = useState(cookie.load('token'));

    function changeCameraConfiguration() {
        props.cameraConfiguration.configuration.cameraConfiguration = cameraConfiguration;
    }

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
                setCameraConfiguration(myJson);
                changeCameraConfiguration();
            }
        });
    }

    function setCurrentCameraConfiguration() {
        axios.post("/camera/settings", cameraConfiguration);
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
            <CameraConfigurationSettings cameraConfiguration={cameraConfiguration} changeCameraConfiguration={changeCameraConfiguration} />
        </div>
    )
};

export default CameraConfigurationPanel;
