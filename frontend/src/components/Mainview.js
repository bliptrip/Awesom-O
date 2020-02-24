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
import VisibleViewport from './Viewport';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
      root: {
              display: 'flex',
            },
      appBar: {
              transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                      }),
            },
      appBarShift: {
              width: `calc(100% - ${drawerWidth}px)`,
              marginLeft: drawerWidth,
              transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
            },
      menuButton: {
              marginRight: theme.spacing(2),
            },
      hide: {
              display: 'none',
            },
      drawer: {
              width: drawerWidth,
              flexShrink: 0,
            },
      drawerPaper: {
              width: drawerWidth,
            },
      drawerHeader: {
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
              ...theme.mixins.toolbar,
              justifyContent: 'flex-end',
            },
      content: {
              flexGrow: 1,
              padding: theme.spacing(3),
              transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                      }),
              marginLeft: -drawerWidth,
            },
      contentShift: {
              transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
              marginLeft: 0,
            },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
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

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar classes={classes} openDrawer={handleDrawerOpen} closeDrawer={handleDrawerClose} openState={open} />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
            paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
      </Drawer>
      <main className={clsx(classes.content, {
                    [classes.contentShift]: open,
                  })}
      >
        <div className={classes.drawerHeader} />
        <Grid container alignContent='center' alignItems='center' justify='center' spacing={0}>
            <Grid item xs={1}>
                <IconButton
                    aria-controls="route-up"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    edge="false"
                >
                    <ArrowUpwardIcon fontSize='large' />
                </IconButton>
            </Grid>
        </Grid>
        <Grid container alignContent='center' alignItems='center' justify='center' spacing={0}>
            <Grid item xs={1}>
                <IconButton
                    aria-controls="route-left"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    edge="false"
                >
                    <ArrowBackIcon fontSize='large' />
                </IconButton>
            </Grid>
            <Grid item xs={10}>
                <VisibleViewport />
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    aria-controls="route-right"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    edge="false"
                >
                    <ArrowForwardIcon fontSize='large' />
                </IconButton>
            </Grid>
        </Grid>
        <Grid container alignContent='center' alignItems='center' justify='center' spacing={0}>
            <Grid item xs={1}>
                <IconButton
                    aria-controls="route-down"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    edge="false"
                >
                    <ArrowDownwardIcon fontSize='large' />
                </IconButton>
            </Grid>
        </Grid>
      <div className={classes.drawerHeader} />
      </main>
    </div>
  );
}
