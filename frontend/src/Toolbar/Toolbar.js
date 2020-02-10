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

import './Toolbar.css'
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import UserProfile from './UserProfile';
import ProjectToolbar from './ProjectToolbar';
import RouteToolbar from './RouteToolbar';
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

function AweToolbar(props) {
    const [user, setUser] = useState(props.user);
    const [rstatus, setRStatus] = useState(props.rstatus);
    const classes = useStyles();

    return (
        <div class="box">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                Awesom-O
            </Typography>
            <nav class="level">
                <div class="level-left level-item">
                    <UserProfile user={user}/>
                </div>
                <div class="level-item">
                    <ProjectToolbar />
                </div>
                <div class="level-item">
                    <RouteToolbar />
                </div>
                <div class="level-right level-item">
                    <StatusIndicator rstatus={rstatus}/>
                </div>
                <Button color="inherit">Logout</Button>
            </nav>
        </div>
    )
}

export default Toolbar;
