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
import {cameraConfigSetEntryValue} from '../actions';

import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
      list: {
              width: 250,
            },
      fullList: {
              width: 'auto',
            },
});

const mapCameraConfigurationSettingsChildrenStateToProps  = (state,ownprops) => ({config: state.camera.configs[ownprops.id]});
const mapCameraConfigurationSettingsChildrenStateDispatchToProps = (dispatch) => ({
    setValue: (id, value) => cameraConfigSetEntryValue(id,value)
});

const preconnect = connect({mapStateToProps: mapCameraConfigurationSettingsChildrenStateToProps, mapDispatchToProps: mapCameraConfigurationSettingsChildrenStateDispatchToProps});

const CameraConfigurationSettingsToggle = ({config, setValue}) => {
    let disabled = config.entry.readonly ? {"disabled": "disabled"} : {};

    function toggleCheckbox(event) {
        let newvalue = (event.target.checked) ? 2 : 0;
        setValue(config.id, newvalue);
    }

    return (
        <ListItem>
            <ListItemText primary={config.entry.label} />
            <Checkbox checked={config.entry.value ? true : false} color={config.stale ? "secondary" : "primary"}  onChange={(e) => {toggleCheckbox(e)}} {...disabled} />
        </ListItem>
    );
}
const DynCameraConfigurationSettingsToggle = preconnect(CameraConfigurationSettingsToggle);

const CameraConfigurationSettingsChoice = ({config, setValue}) => {
    let disabled = config.entry.readonly ? {"disabled": "disabled"} : {};

    function changeSelectChoice(event) {
        let newvalue  = event.target.value;
        setValue(config.id, newvalue);
    }

    return (
        <ListItem>
            <Select
                value={config.entry.value}
                onChange={(e) => {changeSelectChoice(e)}}
                {...disabled}
                color={config.stale ? "secondary" : "primary"}
                label={config.entry.label}
            >
                {config.entry.choices.map((c) => (<MenuItem value={c}>{c}</MenuItem>))}
            </Select>
        </ListItem>
    );
}
const DynCameraConfigurationSettingsChoice = preconnect(CameraConfigurationSettingsChoice);

const CameraConfigurationSettingsString = ({config, setValue}) => {
    function changeText(event) {
        let newvalue = event.target.value;
        setValue(config.id, newvalue);
    }

    return (
        <ListItem>
            <TextField 
                color={config.stale ? "secondary" : "primary"} 
                InputProps={{readOnly: config.entry.readonly}}
                label={config.entry.label} 
                value={config.entry.value}
                onChange={(e) => {changeText(e)}}/>
        </ListItem>
    );
}
const DynCameraConfigurationSettingsString = preconnect(CameraConfigurationSettingsString);

const CameraConfigurationSettingsDateTime = ({config, setValue}) => {
    function changeDateTime(event, entry) {
        let newvalue = event.target.value;
        setValue(config.id, newvalue);
    }

    return (
        <ListItem>
            <TextField 
                color={config.stale ? "secondary" : "primary"} 
                InputProps={{readOnly: config.entry.readonly, type: 'datetime-local'}} 
                label={config.entry.label} 
                value={config.entry.value} />
        </ListItem>
    );
}
const DynCameraConfigurationSettingsDateTime = preconnect(CameraConfigurationSettingsDateTime); 

const CameraConfigurationSettings = ({gphoto2config, configs, rootid}) => {
    function generateCameraSettingsTag(config) {
        switch(config.entry.type) {
            case 'toggle':
                return(
                    <DynCameraConfigurationSettingsToggle id=config.id />
                );
                break;
            case 'choice':
                return(
                    <DynCameraConfigurationSettingsChoice id=config.id />
                );
                break;
            case 'string':
                return( 
                    <DynCameraConfigurationSettingsString id=config.id />
                );
                break;
            case 'date':
                return(
                    <DynCameraConfigurationSettingsDateTime id=config.id />
                );
                break;
            case 'section':
                return(
                    <List>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary={entry.label}
                            />
                        </ListItem>
                        { (configs[config.id].children).map(id => (generateCameraSettingsTag(configs[id]))) }
                    </List>
                );
                break;
            default:
                return(
                    <ListItem>
                        <ListItemText
                            primary='Invalid Entry'
                        />
                    </ListItem>
                );
                break;
        }
    }

    return( 
        <div>
            {generateCameraSettingsTag(configs[rootid]))) }
        </div>
    );
}

const mapCameraConfigurationSettingsStateToProps = (state) => {
    gphoto2Config: state.camera.gphoto2Config
}

const DynCameraConfigurationSettings = connect({mapStateToProps: mapCameraConfigurationSettingsStateToProps})(CameraConfigurationSettings); 

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
                e => e[1].stale
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


function CameraEditor({cshort, cdescription, cmanufacturer, cmodel, cdeviceVersion, csn, configs, rootid}) {
    const classes = useStyles();

    return (
        <div
            className={classes.fullList}
            role="presentation"
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
        >
            <List>
                <ListItem>
                    <TextField label="Short Description" onChange={setShort} value={cshort} />
                </ListItem>
                <ListItem>
                    <TextField label="Description" onChange={setDescription} value={cdescription} />
                </ListItem>
                <ListItem>
                    <TextField label="Manufacturer" disabled=true value={cmanufacturer} />
                </ListItem>
                <ListItem>
                    <TextField label="Model" disabled=true value={cmodel} />
                </ListItem>
                <ListItem>
                    <TextField label="Version" disabled=true value={cdeviceVersion} />
                </ListItem>
                <ListItem>
                    <TextField label="Serial Number" disabled=true value={csn} />
                </ListItem>
                <Divider />
                <ListItem>
                    <DynCameraConfigurationSettings configs={configs} rootid={rootid} />
                </ListItem>
            </List>
        </div>
    );
}

const mapStateToProps = (state) => ({
    cshort: state.camera.short,
    cdescription: state.camera.description,
    cmanufacturer: state.camera.manufacturer,
    cmodel: state.camera.model,
    cdeviceVersion: state.camera.deviceVersion,
    csn: state.camera.sn,
    configs: state.camera.configs,
    rootid: state.camera.rootid
});

const mapDispatchToProps = (dispatch) => ({
    closeDrawer: (event) => ({
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(cameraConfigSetEditorOpen(false));
    }),
    setShort: (event) => dispatch(cameraConfigSetShort(event.target.value)),
    setDescription: (event) => dispatch(cameraConfigSetShort(event.target.value)),
});

export default connect(mapStateToProps,mapDispatchToProps)(CameraEditor);
