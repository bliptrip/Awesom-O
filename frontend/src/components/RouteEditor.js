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

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import parse from 'csv-parse';

import {routeConfigSetEditorOpen,
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
});

function RouteEditor({route, interplateDelay, loopDelay, stepsPerCmX, stepsPerCmY, distanceX, distanceY, clearRoutes, addRoute, setInterplateDelay, setLoopDelay, setStepsPerCmX, setStepsPerCmY, setDistanceX, setDistanceY, closeDrawer }) {
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
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
        >
            <List>
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
                    <GridList cols={2} cellHeight='auto'>
                        <GridListTile> 
                            <Typography variant='h6'>
                                <b>Row</b>
                            </Typography>
                        </GridListTile>
                        <GridListTile>
                            <Typography variant='h6'>
                                <b>Column</b>
                            </Typography>
                        </GridListTile>
                        {route.map(r=> (
                            <>
                                <GridListTile> 
                                    <Typography variant='body1'>{r.row}</Typography>
                                </GridListTile>
                                <GridListTile>
                                    <Typography variant='body1'>{r.col}</Typography>
                                </GridListTile>
                            </>
                        ))}
                    </GridList>
                </ListItem>
            </List>
        </div>
    );
}

const mapStateToProps = (state) => ({
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
    clearRoute: () => dispatch(routeConfigClearRoute()),
    addRoute: (row,col) => dispatch(routeConfigAddRoute(row,col)),
    setInterplateDelay: (seconds) => dispatch(routeConfigSetInterplateDelay(seconds)),
    setLoopDelay: (seconds) => dispatch(routeConfigSetLoopDelay(seconds)),
    setStepsPerCmX: (steps) => dispatch(routeConfigSetStepsPerCmX(steps)),
    setStepsPerCmY: (steps) => dispatch(routeConfigSetStepsPerCmY(steps)),
    setDistanceX: (distance) => dispatch(routeConfigSetDistanceX(distance)),
    setDistanceY: (distance) => dispatch(routeConfigSetDistanceY(distance))
});

export default connect(mapStateToProps,mapDispatchToProps)(RouteEditor);
