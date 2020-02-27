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

import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {experimentConfigSetEditorOpen,
        experimentConfigSetDatetime,
        experimentConfigSetRename,
        experimentConfigSetImageMeta,
        experimentConfigAddFilenameField,
        experimentConfigRemoveFilenameField,
        experimentConfigClearFilenameFields,
        experimentConfigAddPlate,
        experimentConfigClearPlateMeta
} from '../actions';

const useStyles = makeStyles({
      list: {
              width: 250,
            },
      fullList: {
              width: 'auto',
            },
});

function ExperimentEditor({datetime, rename, imageMeta, filenameFields, plateMeta, setDatetime, setRename, setImageMeta, addFilenameField, removeFilenameField, clearFilenameFields, addPlate, clearPlateMeta, closeDrawer}) {
    const classes = useStyles();
    const disableRenameOptions = rename ? "" : "disabled";
    let fieldset = Set();
    plateMeta.forEach( pm => { Object.keys(pm.meta).forEach( k => fieldset.add(k) ) } ); //Possible fields we can allow user to add

    const importExperimentMeta = (fileData) => {
        const metadata = JSON.parse(fileData);
        clearPlateMeta(); //Clear previous image metadata
        clearFilenameFields(); //Clear previous image metadata
        metadata.forEach(pm => addPlate(pm.row, pm.col, pm.meta));
    };

    const handleFilenameField = (field) => (event) => {
        if( event.target.checked ) {
            addFilenameField(field);
        } else {
            removeFilenameField(field);
        }
    };

    return (
        <div
            className={classes.fullList}
            role="presentation"
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
        >
            <List>
                <ListItem>
                    <ListItemText primary="Rename Images" />
                    <Tooltip title="Rename the downloaded camera images?">
                        <Checkbox checked={rename} onChange={setRename} />
                    </Tooltip>
                </ListItem>
                <Divider />
                <ListItem disabled={disableRenameOptions} >
                    <ListItemText primary="Include Datetime" />
                    <Tooltip title="Include date and timestamp in generated filenames.">
                        <Checkbox checked={datetime} onChange={setDatetime} />
                    </Tooltip>
                </ListItem>
                <ListItem disabled={disableRenameOptions} >
                    <ListItemText primary="Include Experimental Descriptors" />
                    <Tooltip title="Include experimental descriptors from metadata fields in filename, and where possible, in image metadata?">
                        <Checkbox checked={imageMeta} onChange={setImageMeta} />
                    </Tooltip>
                </ListItem>
                <ListItem disabled={disableRenameOptions} >
                    <Tooltip title="Include plate metadata field in image filename and image metadata?">
                        <List>
                        {   fieldset.map( f => (
                                <ListItem>
                                    <ListItemText primary={f} />
                                    <Checkbox checked={f in filenameFields} onChange={handleFilenameField(f)} />
                                </ListItem> ))
                        }
                        </List>
                    </Tooltip>
                </ListItem>
                <ListItem disabled={disableRenameOptions} >
                    <Tooltip title="Import experiment metadata fields associated with each plate.">
                        <FileUploader
                            title="Import Metadata Fields"
                            uploadedFileCallback={e => {
                                importExperimentMeta(e);
                            }}
                            accept=".json"
                            fileSizeLimit="100000" // Note that size is in Bytes
                            customLimitTextCSS={{ 'font-family': 'arial',
                                'color': '#b00e05',
                                'font-size': '14px'
                            }}
                        />
                    </Tooltip>
                </ListItem>
            </List>
        </div>
    );
}

const mapStateToProps = (state) => ({
    datetime: state.experiment.datetime,
    rename: state.experiment.rename,
    imageMeta: state.experiment.imageMeta,
    filenameFields: state.experiment.filenameFields,
    plateMeta: state.experiment.plateMeta
});

const mapDispatchToProps = (dispatch) => ({
    closeDrawer: (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(experimentConfigSetEditorOpen(false));
    },
    setDatetime: (e) => dispatch(experimentConfigSetDatetime(e.target.checked)),
    setRename: (e) => dispatch(experimentConfigSetRename(e.target.checked)),
    setImageMeta: (e) => dispatch(experimentConfigSetImageMeta(e.target.checked)),
    addFilenameField: (ff) => dispatch(experimentConfigAddFilenameField(ff)),
    removeFilenameField: (ff) => dispatch(experimentConfigRemoveFilenameField(ff)),
    clearFilenameFields: () => dispatch(experimentConfigClearFilenameFields()),
    addPlate:  (row,col,meta) => dispatch(experimentConfigAddPlate(row,col,meta)),
    clearPlateMeta:  () => dispatch(experimentConfigClearPlateMeta()),
});

export default connect(mapStateToProps,mapDispatchToProps)(ExperimentEditor);
