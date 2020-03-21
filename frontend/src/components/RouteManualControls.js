/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2019  Andrew F. Maule

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
import clsx from 'clsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

//Icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import HomeIcon from '@material-ui/icons/Home';


import {CONTROLLER_RUNNING_STATUS_RUNNING,
        CONTROLLER_RUNNING_STATUS_PAUSED,
        CONTROLLER_RUNNING_STATUS_STOPPED,
        controllerMoveHome,
        controllerMovePlate} from '../actions';
import {disableOnNotStopped,disableOnNotStoppedNotActiveProject} from '../lib/controller';

const RouteIconButton = styled(IconButton)({
    padding: 2,
    border: 2,
    borderColor: 'lightblue',
    borderStyle: 'solid',
    borderRadius: '10px'
});

const useStyles = makeStyles(theme => ({
    container: {
        "display": "grid",
        "margin": "0 20px 0 20px",
        "grid-template-columns":  "25% 25% 25%",
        "grid-template-rows": "auto",
        "grid-column-gap": "8%",
        "grid-row-gap": "1%",
        "justify-items": "center",
        "align-items": "center",
        "justify-content": "space-evenly",
        "align-content": "space-evenly",
    },
}));

function RouteManualControls({
                controllerStatus, 
                activeUserId, 
                activeProjectId,
                moveHome, 
                movePlate}) {
    const classes = useStyles();

    const handleMove = (direction) => (event) => {
        movePlate(direction,1);
    }

    return (
        <Box className={classes.container}>
            <Box />
            <Box>
                <Tooltip title="Move Up a Plate">
                    <RouteIconButton
                        aria-controls="route-up"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        edge="false"
                        onClick={handleMove('north')}
                        disabled={disableOnNotStoppedNotActiveProject(controllerStatus,activeProjectId)}
                    >
                        <ArrowUpwardIcon fontSize='small' />
                    </RouteIconButton>
                </Tooltip>
            </Box>
            <Box />
            <Box>
                <Tooltip title="Move Left a Plate">
                    <RouteIconButton
                        aria-controls="route-left"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        edge="false"
                        onClick={handleMove('west')}
                        disabled={disableOnNotStoppedNotActiveProject(controllerStatus,activeProjectId)}
                    >
                        <ArrowBackIcon fontSize='small' />
                    </RouteIconButton>
                </Tooltip>
            </Box>
            <Box>
                <Tooltip title="Send Camera Home">
                    <RouteIconButton
                        aria-controls="route-home"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        onClick={moveHome}
                        disabled={disableOnNotStopped(controllerStatus)}
                    >
                        <HomeIcon fontSize='small' />
                    </RouteIconButton>
                </Tooltip>
            </Box>
            <Box>
                <Tooltip title="Move Right a Plate">
                    <RouteIconButton
                        aria-controls="route-right"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        edge="false"
                        onClick={handleMove('east')}
                        disabled={disableOnNotStoppedNotActiveProject(controllerStatus,activeProjectId)}
                    >
                        <ArrowForwardIcon fontSize='small' />
                    </RouteIconButton>
                </Tooltip>
            </Box>
            <Box />
            <Box>
                <Tooltip title="Move Down a Plate">
                    <RouteIconButton
                        aria-controls="route-down"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        edge="false"
                        onClick={handleMove('south')}
                        disabled={disableOnNotStoppedNotActiveProject(controllerStatus,activeProjectId)}
                    >
                        <ArrowDownwardIcon fontSize='small' />
                    </RouteIconButton>
                </Tooltip>
            </Box>
            <Box />
        </Box>
    );
}

const mapStateToProps = (state) => ({
    controllerStatus: state.controller.currentStatus,
    activeProjectId: state.project._id
});


const mapDispatchToProps = (dispatch) => ({
    moveHome: () => dispatch(controllerMoveHome(true,true)),
    movePlate: (direction,numPlates) => dispatch(controllerMovePlate(direction,numPlates))
});

export default connect(mapStateToProps,mapDispatchToProps)(RouteManualControls);
