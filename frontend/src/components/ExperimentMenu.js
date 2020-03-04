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
import EmojiObjectsTwoToneIcon from '@material-ui/icons/EmojiObjectsTwoTone'; //This is a light-bulb -- not sure why it is named as is
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import FolderOpenTwoToneIcon from '@material-ui/icons/FolderOpenTwoTone';
import SettingsApplicationsTwoToneIcon from '@material-ui/icons/SettingsApplicationsTwoTone';
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';
import {Tooltip} from '@material-ui/core/';
import Select from '@material-ui/core/Select';

import {experimentConfigCreate,experimentConfigSetEditorOpen,experimentConfigSetLoadDialogOpen,experimentConfigLoadSaved,experimentConfigSave, experimentConfigFetchSuccess} from '../actions';

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
    savedExperimentConfigs: state.experiment.savedExperimentConfigs,
    open: state.experiment.isLoadDialogOpen
});

const mapDialogDispatchToProps = (dispatch) => ({
    setEditorOpen: (e) => dispatch(experimentConfigSetEditorOpen(true)),
    experimentConfigSetCurrent: (experiment) => dispatch(experimentConfigFetchSuccess(experiment)),
    setOpen: (isOpen) => dispatch(experimentConfigSetLoadDialogOpen(isOpen))
});

function ExperimentLoadSavedDialog({open, savedExperimentConfigs, setOpen, setEditorOpen, experimentConfigSetCurrent}) {
    const [selectedExperiment, setSelectedExperiment] = useState(undefined);

    const handleClose = () => {
            setOpen(false);
          };

    const changeSelectChoice = event => {
        setSelectedExperiment(event.target.value);
    }

    const loadSelectedChoice = event => {
        experimentConfigSetCurrent(selectedExperiment);
        setEditorOpen(true);
        setOpen(false);
    }

    return (
            <div>
              <Dialog open={open} onClose={handleClose} aria-labelledby="experiment-load-dialog-title">
                <DialogTitle id="experiment-load-dialog-title">Load Experiment</DialogTitle>
                  <DialogContent>
                    <Select
                        value={selectedExperiment}
                        onChange={changeSelectChoice}
                        color="primary"
                        label="Load Experiment Configuration"
                    >
                        {savedExperimentConfigs.map((e) => (<MenuItem value={e}>{e.shortDescription}</MenuItem>))}
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

const ConnectedExperimentLoadSavedDialog = connect(mapDialogStateToProps, mapDialogDispatchToProps)(ExperimentLoadSavedDialog);

function ExperimentMenu({userId, projectId, currExperimentConfig, addExperimentConfig, loadSaved, setEditorOpen, setDialogOpen, eSave}) {
      const [anchorEl, setAnchorEl] = useState(null);

      const handleClick = event => {
              setAnchorEl(event.currentTarget);
            };

      const handleClose = () => {
              setAnchorEl(null);
            };

    const handleAdd = (userId, projectId) => (e) => {
        addExperimentConfig(userId, projectId);
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

    const handleSave = (e) => {
        eSave(currExperimentConfig);
        handleClose();
    };
      return (
              <div>
                <Tooltip title="Experiment Metadata">
                    <IconButton
                    aria-controls="experiment-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    >
                        <EmojiObjectsTwoToneIcon fontSize='large' />
                    </IconButton>
                </Tooltip>
                <StyledMenu
                  id="experiment-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <StyledMenuItem onClick={handleAdd(userId,projectId)}>
                    <ListItemIcon>
                      <AddCircleTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Add Experiment Settings" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleLoad}>
                    <ListItemIcon>
                      <FolderOpenTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Load Saved Settings" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <SettingsApplicationsTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Edit Current Settings" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleSave}>
                    <ListItemIcon>
                      <SaveTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Save Current Settings" />
                    </ListItem>
                  </StyledMenuItem>
                </StyledMenu>
                <ConnectedExperimentLoadSavedDialog />
              </div>
            );
};


const mapStateToProps = (state) => ({
    userId: state.user._id,
    projectId: state.project._id,
    currExperimentConfig: state.experiment
});

const mapDispatchToProps = (dispatch) => ({
    addExperimentConfig: (uid, pid) => dispatch(experimentConfigCreate(uid, pid)),
    setEditorOpen: (open) => dispatch(experimentConfigSetEditorOpen(open)),
    setDialogOpen: (open) => dispatch(experimentConfigSetLoadDialogOpen(open)),
    loadSaved: (id) => dispatch(experimentConfigLoadSaved(id)),
    eSave: (experimentConfig) => dispatch(experimentConfigSave(experimentConfig))
});

export default connect(mapStateToProps,mapDispatchToProps)(ExperimentMenu);
