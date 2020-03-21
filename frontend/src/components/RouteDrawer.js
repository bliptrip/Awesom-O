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

//Material-UI
import { styled, useTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

//Icons
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import {controllerMovePlate} from '../actions';
import RouteGrid from './RouteGrid';

const RouteIconButton = styled(IconButton)({
    padding: 1,
    border: 2,
    borderColor: 'lightblue',
    borderStyle: 'solid',
    borderRadius: '10px'
});

function RouteDrawer({movePlate,
                      closeDrawer,
                      openState,
                      classes}) {
    const theme = useTheme();

    const handleMove = (direction) => (event) => {
        movePlate(direction,1);
    }

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={openState}
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
        >
            <div className={classes.toolbar}>
                <Typography variant="h6">RouteNavigator</Typography>
                <Container />
                <IconButton onClick={closeDrawer}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />
            <div>
                <RouteGrid />
            </div>
        </Drawer>
    );
}

const mapDispatchToProps = (dispatch) => ({
    movePlate: (direction,numPlates) => dispatch(controllerMovePlate(direction,numPlates))
});

export default connect(null, mapDispatchToProps)(RouteDrawer);
