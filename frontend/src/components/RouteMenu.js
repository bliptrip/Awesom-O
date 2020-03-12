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

import React, {useState} from 'react';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapTwoToneIcon from '@material-ui/icons/MapTwoTone';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import FolderOpenTwoToneIcon from '@material-ui/icons/FolderOpenTwoTone';
import SettingsApplicationsTwoToneIcon from '@material-ui/icons/SettingsApplicationsTwoTone';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';

import {routeConfigCreate, 
        routeConfigLoadSaved, 
        routeConfigSetEditorOpen, 
        routeConfigLoad, 
        routeConfigSetLoadDialogOpen} from '../actions';


const StyledMenu = withStyles({
      paper: {
              border: '1px solid #d3d4d5',
            },
})(props => (
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
                  vertical: 'bottom',
                      horizontal: 'center',
                    }}
        transformOrigin={{
                  vertical: 'top',
                      horizontal: 'center',
                    }}
        {...props}
      />
));

const StyledMenuItem = withStyles(theme => ({
      root: {
              '&:focus': {
                        backgroundColor: theme.palette.primary.main,
                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                    color: theme.palette.common.white,
                                  },
                      },
            },
}))(MenuItem);

const mapDialogStateToProps = (state) => ({
    userId: state.user._id,
    savedRouteConfigs: state.route.savedRouteConfigs,
    open: state.route.isLoadDialogOpen
});

const mapDialogDispatchToProps = (dispatch) => ({
    setEditorOpen: (e) => dispatch(routeConfigSetEditorOpen(true)),
    routeConfigSetCurrent: (route) => dispatch(routeConfigLoad(route)),
    setOpen: (isOpen) => dispatch(routeConfigSetLoadDialogOpen(isOpen))
});

function RouteLoadSavedDialog({open, savedRouteConfigs, setOpen, setEditorOpen, routeConfigSetCurrent}) {
    const [selectedRoute, setSelectedRoute] = useState(undefined);

    const handleClose = () => {
            setOpen(false);
          };

    const changeSelectChoice = event => {
        setSelectedRoute(event.target.value);
    }

    const loadSelectedChoice = event => {
        routeConfigSetCurrent(selectedRoute);
        setEditorOpen(true);
        setOpen(false);
    }

    return (
            <div>
              <Dialog open={open} onClose={handleClose} aria-labelledby="route-load-dialog-title">
                <DialogTitle id="route-load-dialog-title">Load Route</DialogTitle>
                  <DialogContent>
                    <Select
                        value={selectedRoute}
                        onChange={changeSelectChoice}
                        color="primary"
                        label="Load Route Configuration"
                    >
                        {savedRouteConfigs.map((e) => (<MenuItem value={e}>{e.shortDescription}</MenuItem>))}
                    </Select>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={loadSelectedChoice} color="primary">
                    Load
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          );
}

const ConnectedRouteLoadSavedDialog = connect(mapDialogStateToProps, mapDialogDispatchToProps)(RouteLoadSavedDialog);

function RouteMenu({addRouteConfig,
                    setEditorOpen,
                    setDialogOpen,
                    loadSaved,
                    userId,
                    projectId,
                    currRouteConfig}) {
      const [anchorEl, setAnchorEl] = useState(null);

      const handleClick = event => {
              setAnchorEl(event.currentTarget);
            };

      const handleClose = () => {
              setAnchorEl(null);
            };

    const handleAdd = (userId, projectId) => (e) => {
        addRouteConfig(userId, projectId);
        setEditorOpen(true);
        handleClose();
    };

    const handleLoad = (e) => {
        loadSaved(userId);
        setDialogOpen(true);
        handleClose();
    };

    const handleEdit = (e) => {
        setEditorOpen(true);
        handleClose();
    };

      return (
              <div>
                <Tooltip title="Route Settings">
                    <IconButton
                    aria-controls="route-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    >
                        <MapTwoToneIcon fontSize='large' />
                    </IconButton>
                </Tooltip>
                <StyledMenu
                  id="route-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <StyledMenuItem onClick={handleAdd(userId,projectId)} disabled={projectId === undefined}>
                    <ListItemIcon>
                      <AddCircleTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Add Route" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleLoad} disabled={projectId === undefined}>
                    <ListItemIcon>
                      <FolderOpenTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Load Saved Route" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleEdit} disabled={(projectId === undefined) || (currRouteConfig._id === undefined)}>
                    <ListItemIcon>
                      <SettingsApplicationsTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Edit Current Route" />
                    </ListItem>
                  </StyledMenuItem>
                </StyledMenu>
                <ConnectedRouteLoadSavedDialog />
              </div>
            );
};

const mapStateToProps = (state) => ({
    userId: state.user._id,
    projectId: state.project._id,
    currRouteConfig: state.route
});

const mapDispatchToProps = (dispatch) => ({
    addRouteConfig: (uid, pid) => dispatch(routeConfigCreate(uid, pid)),
    setEditorOpen: (open) => dispatch(routeConfigSetEditorOpen(open)),
    setDialogOpen: (open) => dispatch(routeConfigSetLoadDialogOpen(open)),
    loadSaved: (id) => dispatch(routeConfigLoadSaved(id))
});

export default connect(mapStateToProps,mapDispatchToProps)(RouteMenu);
