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

import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import parse from 'csv-parse';

import {routeConfigSetShort,
        routeConfigSetEditorOpen,
        routeConfigClearRoute,
        routeConfigAddRoute,
        routeConfigSetInterplateDelay,
        routeConfigSetLoopDelay,
        routeConfigSetStepsPerCmX,
        routeConfigSetStepsPerCmY,
        routeConfigSetDistanceX,
        routeConfigSetDistanceY} from '../actions';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    table: {
        minWidth: 450,
    }
});

function RouteEditor({route, rshort, interplateDelay, loopDelay, stepsPerCmX, stepsPerCmY, distanceX, distanceY, clearRoutes, setShort, addRoute, setInterplateDelay, setLoopDelay, setStepsPerCmX, setStepsPerCmY, setDistanceX, setDistanceY, closeDrawer }) {
    const classes = useStyles();

    const importRoutes = (event) => {
        const reader   = new FileReader();
        reader.addEventListener("load", function () {
            const parser = parse({ delimiter: ',' });
            clearRoutes(); //Clear previous routes
            parser.on('readable', function(){
                let record;
                while (record = parser.read()) {
                    addRoute(record[0], record[1]);
                }
            });
            //Catch any error
            parser.on('error', function(err) {
            console.error(err.message)
            });
            parser.write(reader.result);
        }, false);
        reader.readAsText(event.target.files[0]);
    };

    return (
        <div
            className={classes.fullList}
            role="presentation"
        >
            <List>
                <ListItem>
                    <Tooltip title="Short Descriptor of this Route">
                        <TextField label="Short Description" onChange={setShort} value={rshort} />
                    </Tooltip>
                </ListItem>
                <Divider />
                <ListItem>
                    <Tooltip title="(seconds) Time delay between capture of subsequent plates in path.">
                        <TextField label="Interplate Delay" onChange={setInterplateDelay} value={interplateDelay} />
                    </Tooltip>
                </ListItem>
                <ListItem>
                    <Tooltip title="(seconds) Time delay between route cycles.">
                        <TextField label="Interloop Delay" onChange={setLoopDelay} value={loopDelay}/>
                    </Tooltip>
                </ListItem>
                <Divider />
                <ListItem>
                    <Tooltip title="X-axis stepper motor steps per centimeter travel.">
                        <TextField label="X-axis steps/cm" onChange={setStepsPerCmX} value={stepsPerCmX} />
                    </Tooltip>
                </ListItem>
                <ListItem>
                    <Tooltip title="Y-axis stepper motor steps per centimeter travel.">
                        <TextField label="Y-axis steps/cm" onChange={setStepsPerCmY} value={stepsPerCmY} />
                    </Tooltip>
                </ListItem>
                <ListItem>
                    <Tooltip title="(cm) X-axis interplate distance.">
                        <TextField label="X-axis Plate Distance" onChange={setDistanceX} value={distanceX} />
                    </Tooltip>
                </ListItem>
                <ListItem>
                    <Tooltip title="(cm) Y-axis interplate distance.">
                        <TextField label="Y-axis Plate Distance" onChange={setDistanceY} value={distanceY} />
                    </Tooltip>
                </ListItem>
                <Divider />
                <ListItem>
                    <InputLabel>Import route</InputLabel>
                    <Tooltip title="Import Route from CSV file">
                        <Input
                            onChange={(e) => importRoutes(e)}
                            type="file"
                            inputProps={{accept: ".csv"}}
                        />
                    </Tooltip>
                </ListItem>
                <ListItem>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Row</TableCell>
                                    <TableCell align="right">Column</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {route.map( r => (
                                    <TableRow>
                                        <TableCell align="right">{r.row}</TableCell>
                                        <TableCell align="right">{r.col}</TableCell>
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
    rshort: state.route.shortDescription,
    interplateDelay: state.route.interplateDelay,
    loopDelay: state.route.loopDelay,
    stepsPerCmX: state.route.stepsPerCmX,
    stepsPerCmY: state.route.stepsPerCmY,
    distanceX: state.route.distanceX,
    distanceY: state.route.distanceY,
    route: state.route.route
});

const mapDispatchToProps = (dispatch) => ({
    closeDrawer: (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(routeConfigSetEditorOpen(false));
    },
    clearRoutes: () => dispatch(routeConfigClearRoute()),
    setShort: (e) => dispatch(routeConfigSetShort(e.target.value)),
    addRoute: (row,col) => dispatch(routeConfigAddRoute(row,col)),
    setInterplateDelay: (e) => dispatch(routeConfigSetInterplateDelay(e.target.value)),
    setLoopDelay: (e) => dispatch(routeConfigSetLoopDelay(e.target.value)),
    setStepsPerCmX: (e) => dispatch(routeConfigSetStepsPerCmX(e.target.value)),
    setStepsPerCmY: (e) => dispatch(routeConfigSetStepsPerCmY(e.target.value)),
    setDistanceX: (e) => dispatch(routeConfigSetDistanceX(e.target.value)),
    setDistanceY: (e) => dispatch(routeConfigSetDistanceY(e.target.value))
});

export default connect(mapStateToProps,mapDispatchToProps)(RouteEditor);
