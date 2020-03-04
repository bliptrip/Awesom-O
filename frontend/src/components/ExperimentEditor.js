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

//import FileUploader from 'file-uploader';

import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {experimentConfigSetEditorOpen,
        experimentConfigSetShort,
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
    table: {
        minWidth: 450,
    },
});

function ExperimentEditor({eshort, datetime, rename, imageMeta, filenameFields, plateMeta, setShort, setDatetime, setRename, setImageMeta, addFilenameField, removeFilenameField, clearFilenameFields, addPlate, clearPlateMeta, closeDrawer}) {
    const classes = useStyles();
    const disableRenameOptions = rename ? "" : "disabled";
    const disableFieldnameOptions = (rename && imageMeta) ? "" : "disabled";
    let fieldset = new Set();
    plateMeta.forEach( pm => { 
        Object.keys(pm.meta).forEach( k => fieldset.add(k) );
        console.log(fieldset);
    } ); //Possible fields we can allow user to add

    const importExperimentMeta = (event) => {
        const reader   = new FileReader();
        reader.addEventListener("load", function () {
            let metaData = reader.result;
            clearPlateMeta(); //Clear previous image metadata
            clearFilenameFields(); //Clear previous image metadata
            JSON.parse(metaData).meta.forEach(pm => addPlate(pm.row, pm.col, pm.meta));
        }, false);
        reader.readAsText(event.target.files[0]);
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
        >
            <List>
                <ListItem>
                    <TextField label="Short Description" onChange={setShort} value={eshort} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary="Rename Images" />
                    <Tooltip title="Rename the downloaded camera images?">
                        <Checkbox checked={rename} onChange={setRename} />
                    </Tooltip>
                </ListItem>
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
                <ListItem disabled={disableFieldnameOptions} >
                    <Tooltip title="Include plate metadata field in image filename and image metadata?">
                        <List>
                        {   Array.from(fieldset).map( f => (
                                <ListItem>
                                    <ListItemText primary={f} />
                                    <Checkbox checked={filenameFields.includes(f)} onChange={handleFilenameField(f)} />
                                </ListItem> ))
                        }
                        </List>
                    </Tooltip>
                </ListItem>
                <ListItem>
                    <InputLabel>Import experimental metadata</InputLabel>
                    <Input
                        onChange={(e) => importExperimentMeta(e)}
                        type="file"
                        inputProps={{accept: ".json"}}
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary="Experiment Metadata" />
                </ListItem>
                <ListItem>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Row</TableCell>
                                    <TableCell align="right">Column</TableCell>
                                    { Array.from(fieldset)
                                        .filter( f => ((f !== "row") && (f !== "col")) )
                                        .map( f => (<TableCell align="right">{f}</TableCell>) ) }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {plateMeta.map( m => (
                                    <TableRow>
                                        <TableCell align="right">{m.row}</TableCell>
                                        <TableCell align="right">{m.col}</TableCell>
                                        { Array.from(fieldset)
                                            .filter( f => ((f !== "row") && (f !== "col")) )
                                            .map( f => (<TableCell align="right">{m.meta[f]}</TableCell>) ) }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ListItem>
                
            </List>
        </div>
    );
}

const mapStateToProps = (state) => ({
    eshort: state.experiment.shortDescription,
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
    setShort: (e) => dispatch(experimentConfigSetShort(e.target.value)),
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
