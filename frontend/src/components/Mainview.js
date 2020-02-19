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
import clsx from 'clsx';
import Navbar from './Navbar';
import StatusIndicator from './StatusIndicator';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import StopIcon from '@material-ui/icons/Stop';
import {AWESOMO_RUNNING_STATUS_STOPPED} from '../actions/awesomeORunningStatus.js';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MainView() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleRouteHome = () => {
  };

  const handleRoutePlay = () => {
  };

  const handleRoutePause = () => {
  };

  const handleRouteStop = () => {
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar classes={classes} openDrawer={handleDrawerOpen} closeDrawer={handleDrawerClose} openState={open} />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem>
                <StatusIndicator activeUser='bliptrip' activeStatus={AWESOMO_RUNNING_STATUS_STOPPED} />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <IconButton
                        aria-controls="route-home"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        onClick={handleRouteHome}
                    >
                        <HomeIcon fontSize='large' />
                    </IconButton>
                </ListItemIcon>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <IconButton
                        aria-controls="route-play"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        onClick={handleRoutePlay}
                    >
                        <PlayCircleOutlineIcon fontSize='large' />
                    </IconButton>
                </ListItemIcon>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <IconButton
                        aria-controls="route-stop"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        onClick={handleRouteStop}
                    >
                        <StopIcon fontSize='large' />
                    </IconButton>
                </ListItemIcon>
            </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
      </main>
    </div>
  );
}
