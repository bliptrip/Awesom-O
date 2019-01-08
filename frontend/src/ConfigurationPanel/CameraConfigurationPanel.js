import './CameraConfigurationPanel.scss';
import axios from "axios";
import cookie from 'react-cookies';
import React, {useState} from 'react';

function CameraConfigurationSettings(props) {
    function generateCameraSettingsTag(cameraSettingsEntry) {
        switch(cameraSettingsEntry.type) {
            case 'toggle':
                var checkedstring = "";
                if( cameraSettingsEntry.value != 0 ) {
                    checkedstring = "checked";
                }
                return (
                    <div>
                        <label class="checkbox">
                            <input type="checkbox" {...checkedstring} onchange={toggleCameraSetting}/>
                            {cameraSettingsEntry.label}
                        </label>
                    </div>
                );
                break;
            case 'choice':
                return (
                    <div>
                        <p><strong>{cameraSettingsEntry.label}</strong></p>
                        <div class="select">
                            <select>
                                {cameraSettingsEntry.choices.map((c) => (<option>{c}</option>))}
                            </select>
                        </div>
                    </div>
                );
                break;
            case 'string':
                return( 
                    <div>
                        <p><strong>{cameraSettingsEntry.label}</strong></p>
                        <input class="input" type="text" placeholder={cameraSettingsEntry.value} />
                    </div>
                );
                break;
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
    const [cameraConfiguration, setCameraConfiguration]  = useState({main: { children: {} } });
    const [token, setToken]                              = useState(cookie.load('token'));

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
                        </a>
                        <a href="#" class="button tooltip" data-tooltip="Apply Current Settings to attached Camera" onClick={setCurrentCameraConfiguration}>
                            <span class="icon is-large">
                                <i class="fas fa-2x fa-upload"></i>
                            </span>
                        </a>
                    </span>
                </div>
            </nav>
            <CameraConfigurationSettings cameraConfiguration={cameraConfiguration} />
        </div>
    )
};

export default CameraConfigurationPanel;
