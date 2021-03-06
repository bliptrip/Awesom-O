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
import {cameraConfigSetEntryValue, 
        cameraConfigSetEditorOpen, 
        cameraConfigSave,
        cameraConfigSaveAs,
        cameraConfigSetShort, 
        cameraConfigSetDescription, 
        cameraConfigLoadSettings, 
        cameraConfigApplySettings} from '../actions';

import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import SettingsIcon from '@material-ui/icons/Settings';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import SaveButtonBar from './SaveButtonBar';

const useStyles = makeStyles({
      list: {
              width: 250,
            },
      fullList: {
              width: 'auto',
            },
});

const mapCameraConfigurationSettingsChildrenStateToProps  = (state,ownprops) => ({ 
    config: state.camera.configs[ownprops.id] 
});

const mapCameraConfigurationSettingsChildrenStateDispatchToProps = (dispatch) => ({
    setValue: (id, value) => dispatch(cameraConfigSetEntryValue(id,value))
});

const preconnect = connect(mapCameraConfigurationSettingsChildrenStateToProps, mapCameraConfigurationSettingsChildrenStateDispatchToProps);

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
            <InputLabel id={"select-label-"+config.entry.label}>{config.entry.label}</InputLabel>
            <Select
                labelId={"select-label-"+config.entry.label}
                value={config.entry.value}
                onChange={(e) => {changeSelectChoice(e)}}
                {...disabled}
                color={config.stale ? "secondary" : "primary"}
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
                    <DynCameraConfigurationSettingsToggle id={config.id} />
                );
                break;
            case 'choice':
                return(
                    <DynCameraConfigurationSettingsChoice id={config.id} />
                );
                break;
            case 'string':
                return( 
                    <DynCameraConfigurationSettingsString id={config.id} />
                );
                break;
            case 'date':
                return(
                    <DynCameraConfigurationSettingsDateTime id={config.id} />
                );
                break;
            case 'section':
                return(
                    <List>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary={config.entry.label}
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

    if(configs && (configs !== {}) && rootid) {
        return( 
            <div>
                {generateCameraSettingsTag(configs[rootid])}
            </div>
        );
    } else {
        return(
            <>
            </>);
    }
}

const mapCameraConfigurationSettingsStateToProps = (state) => ({
    gphoto2Config: state.camera.gphoto2Config,
    configs: state.camera.configs,
    rootid: state.camera.rootid
});

const DynCameraConfigurationSettings = connect(mapCameraConfigurationSettingsStateToProps)(CameraConfigurationSettings); 

function CameraEditor({cshort, 
                       cdescription, 
                       camera,
                       camConfigs, 
                       closeDrawer, 
                       cSave, 
                       cSaveAs, 
                       setShort, 
                       setDescription, 
                       loadSettings, 
                       applySettings}) {
    const classes = useStyles();

    return (
        <div
            className={classes.fullList}
            role="presentation"
        >
            <SaveButtonBar descriptor="Camera Configuration" entry={camera} save={cSave} saveAs={cSaveAs} />
            <Divider />
            <List>
                <ListItem>
                    <TextField label="Short Description" onChange={setShort} value={cshort} />
                </ListItem>
                <ListItem>
                    <TextField label="Description" onChange={setDescription} value={cdescription} />
                </ListItem>
                <Divider />
                <ListItem>
                    <Tooltip title="Load Active Settings from Camera">
                        <SettingsIcon fontSize="large" onClick={loadSettings(0)} />
                    </Tooltip>
                    <Tooltip title="Apply Current Settings to Camera">
                        <SettingsApplicationsIcon fontSize="large" onClick={applySettings(0,camConfigs)} />
                    </Tooltip>
                </ListItem>
                <ListItem>
                    <DynCameraConfigurationSettings />
                </ListItem>
            </List>
        </div>
    );
}

const mapStateToProps = (state) => ({
    cshort: state.camera.shortDescription,
    cdescription: state.camera.description,
    cmanufacturer: state.camera.manufacturer,
    cmodel: state.camera.model,
    cdeviceVersion: state.camera.deviceVersion,
    csn: state.camera.sn,
    camConfigs: state.camera.configs,
    camera: state.camera
});

const mapDispatchToProps = (dispatch) => ({
    closeDrawer: (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(cameraConfigSetEditorOpen(false));
    },
    cSave: (camera) => (e) => dispatch(cameraConfigSave(camera)),
    cSaveAs: (camera) => (e) => dispatch(cameraConfigSaveAs(camera)),
    setShort: (event) => dispatch(cameraConfigSetShort(event.target.value)),
    setDescription: (event) => dispatch(cameraConfigSetDescription(event.target.value)),
    loadSettings: (camIndex) => (e) => dispatch(cameraConfigLoadSettings(camIndex)),
    applySettings: (camIndex,camConfigs) => (e) => dispatch(cameraConfigApplySettings(camIndex,camConfigs)),
});

export default connect(mapStateToProps,mapDispatchToProps)(CameraEditor);
