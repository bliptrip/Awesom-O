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

import FileUploader from 'file-uploader';
const parse = require('csv-parse');

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {storageConfigSetEditorOpen,
        storageConfigSetType,
        storageConfigSetParams,
        storageConfigGetSupportedTypes,
        storageConfigGetSupportedParams } from '../actions';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    }
});

function StorageEditor({closeDrawer, storageType, params, supportedTypes, supportedParams, setType, setParams, getSupportedTypes, getSupportedParams}) {
    const classes = useStyles();
    let disableOptions = (!supportedTypes || (supportedTypes === [])) ? "disabled" : "";
    let params = {};
    let sparams = {};
    getSupportedTypes();
    getSupportedParams();

    if( storageType ) {
        sparams = supportedParams[storageType];
    }

    const onChangeParam = (param) => (e) => {
        params[param] = e.target.value;
        setParams(params);
    }

    const onChangeStorageType = (e) => {
        setType(e.target.value);
    }

    const generateParamEntry = (params, key) => (
        switch(params[key]) {
            case 'String':
                return(<TextField 
                    onChange={onChangeParam(key)} 
                    color='primary'
                    label={key} 
                    defaultValue="" />);
                break;
            default:
                return();
                break;
        }
    )

    return (
        <div
            className={classes.fullList}
            role="presentation"
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
        >
            <List>
                <ListItem>
                    <Tooltip title="Choose one of the supported storage types.">
                        <Select
                            value={storageType}
                            onChange={onChangeStorageType}
                            color="primary"
                            label="Storage Type"
                        >
                            {supportedTypes.map((t) => (<MenuItem value={t}>{t}</MenuItem>))}
                        </Select>
                    </Tooltip>
                </ListItem>
                { Object.keys(sparams).map( k => 
                    <ListItem {disableOptions}>
                        {generateParamEntry(sparams, k)}
                    </ListItem> )
                }
            </List>
}

const mapStateToProps = (state) => {
    storageType: state.storage.storageType,
    params: state.storage.params,
    supportedTypes: state.storage.supportedTypes,
    supportedParams: state.storage.supportedParams
}

const mapDispatchToProps = (dispatch) => {
    closeDrawer: (event) => ({
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(storageConfigSetEditorOpen(false));
    }),
    setType: (type) => dispatch(storageConfigSetType(type)),
    setParams: (params) => dispatch(storageConfigSetParams(params)),
    getSupportedTypes: () => dispatch(storageConfigGetSupportedTypes()),
    getSupportedParams: () => dispatch(storageConfigGetSupportedParams())
}

export default connect(mapStateToProps,mapDispatchToProps)(StorageEditor);
