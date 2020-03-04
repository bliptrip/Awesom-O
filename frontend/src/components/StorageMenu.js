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
import BackupTwoToneIcon from '@material-ui/icons/BackupTwoTone';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import FolderOpenTwoToneIcon from '@material-ui/icons/FolderOpenTwoTone';
import SettingsApplicationsTwoToneIcon from '@material-ui/icons/SettingsApplicationsTwoTone';
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';

import {storageConfigCreate, storageConfigLoadSaved, storageConfigSave, storageConfigSetEditorOpen, storageConfigFetchSuccess, storageConfigSetLoadDialogOpen} from '../actions';

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
    savedStorageConfigs: state.storage.savedStorageConfigs,
    open: state.storage.isLoadDialogOpen
});

const mapDialogDispatchToProps = (dispatch) => ({
    setEditorOpen: (e) => dispatch(storageConfigSetEditorOpen(true)),
    storageConfigSetCurrent: (storage) => dispatch(storageConfigFetchSuccess(storage)),
    setOpen: (isOpen) => dispatch(storageConfigSetLoadDialogOpen(isOpen))
});

function StorageLoadSavedDialog({open, savedStorageConfigs, setOpen, setEditorOpen, storageConfigSetCurrent}) {
    const [selectedStorage, setSelectedStorage] = useState(undefined);

    const handleClose = () => {
            setOpen(false);
          };

    const changeSelectChoice = event => {
        setSelectedStorage(event.target.value);
    }

    const loadSelectedChoice = event => {
        storageConfigSetCurrent(selectedStorage);
        setEditorOpen(true);
        setOpen(false);
    }

    return (
            <div>
              <Dialog open={open} onClose={handleClose} aria-labelledby="storage-load-dialog-title">
                <DialogTitle id="storage-load-dialog-title">Load Storage</DialogTitle>
                  <DialogContent>
                    <Select
                        value={selectedStorage}
                        onChange={changeSelectChoice}
                        color="primary"
                        label="Load Storage Configuration"
                    >
                        {savedStorageConfigs.map((s) => (<MenuItem value={s}>{s.shortDescription}</MenuItem>))}
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

const ConnectedStorageLoadSavedDialog = connect(mapDialogStateToProps, mapDialogDispatchToProps)(StorageLoadSavedDialog);

function StorageMenu({addStorageConfig,setEditorOpen,setDialogOpen,loadSaved,sSave,userId,projectId,currStorageConfig}) {
      const [anchorEl, setAnchorEl] = useState(null);

      const handleClick = event => {
              setAnchorEl(event.currentTarget);
            };

      const handleClose = () => {
              setAnchorEl(null);
            };

    const handleAdd = (userId, projectId) => (e) => {
        addStorageConfig(userId, projectId);
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
        sSave(currStorageConfig);
        handleClose();
    };

      return (
              <div>
                <Tooltip title="Image Storage Settings">
                    <IconButton
                    aria-controls="storage-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    >
                        <BackupTwoToneIcon fontSize='large' />
                    </IconButton>
                </Tooltip>
                <StyledMenu
                  id="storage-menu"
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
                        <ListItemText primary="Add Storage Configuration" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleLoad}>
                    <ListItemIcon>
                      <FolderOpenTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Load Saved Storage Configuration" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <SettingsApplicationsTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Edit Current Storage Configuration" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleSave}>
                    <ListItemIcon>
                      <SaveTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Save Current Storage Configuration" />
                    </ListItem>
                  </StyledMenuItem>
                </StyledMenu>
                <ConnectedStorageLoadSavedDialog />
              </div>
            );
};

const mapStateToProps = (state) => ({
    userId: state.user._id,
    projectId: state.project._id,
    currStorageConfig: state.storage
});

const mapDispatchToProps = (dispatch) => ({
    addStorageConfig: (uid, pid) => dispatch(storageConfigCreate(uid, pid)),
    setEditorOpen: (open) => dispatch(storageConfigSetEditorOpen(open)),
    setDialogOpen: (open) => dispatch(storageConfigSetLoadDialogOpen(open)),
    loadSaved: (id) => dispatch(storageConfigLoadSaved(id)),
    sSave: (storageConfig) => dispatch(storageConfigSave(storageConfig))
});

export default connect(mapStateToProps,mapDispatchToProps)(StorageMenu);
