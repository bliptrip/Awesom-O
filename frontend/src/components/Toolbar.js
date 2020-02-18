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

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import UserMenu from './UserMenu';
import ProjectMenu from './ProjectMenu';
import CameraMenu from './CameraMenu';
import ExperimentMenu from './ExperimentMenu';
import RouteMenu from './RouteMenu';
import RouteMenu from './StorageMenu';
import StatusIndicator from './StatusIndicator';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Toolbar(props) {
    const classes = useStyles();

    return (
        <div class="box">
            <Typography variant="h6" className={classes.title}>
                Awesom-O
            </Typography>
            <nav class="level">
                <div class="level-left level-item">
                    <UserMenu />
                </div>
                <div class="level-item">
                    <ProjectMenu />
                </div>
                <div class="level-item">
                    <CameraMenu />
                </div>
                <div class="level-item">
                    <ExperimentMenu />
                </div>
                <div class="level-item">
                    <RouteMenu />
                </div>
                <div class="level-item">
                    <StorageMenu />
                </div>
                <div class="level-right level-item">
                    <StatusIndicator {...props} />
                </div>
            </nav>
        </div>
    )
}

export default Toolbar;
