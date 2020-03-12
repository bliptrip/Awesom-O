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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import EditIcon from '@material-ui/icons/Edit';
import FolderOpenTwoToneIcon from '@material-ui/icons/FolderOpenTwoTone';

import {projectCreate, 
        projectLoadSaved, 
        projectFetch, 
        projectSetLoadDialogOpen, 
        projectSetEditorOpen} from '../actions';

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
    savedProjects: state.project.savedProjects,
    open: state.project.isLoadDialogOpen
});

const mapDialogDispatchToProps = (dispatch) => ({
    setEditorOpen: (e) => dispatch(projectSetEditorOpen(true)),
    projectSetCurrent: (project) => dispatch(projectFetch(project)),
    setOpen: (isOpen) => dispatch(projectSetLoadDialogOpen(isOpen))
});

function ProjectLoadSavedDialog({open, 
                                 savedProjects, 
                                 setOpen, 
                                 setEditorOpen, 
                                 projectSetCurrent}) 
{
    const [selectedProject, setSelectedProject] = useState(undefined);

    const handleClose = () => {
            setOpen(false);
          };

    const changeSelectChoice = event => {
        setSelectedProject(event.target.value);
    }

    const loadSelectedChoice = event => {
        projectSetCurrent(selectedProject._id);
        setEditorOpen(true);
        setOpen(false);
    }

    return (
            <div>
              <Dialog open={open} onClose={handleClose} aria-labelledby="project-load-dialog-title">
                <DialogTitle id="project-load-dialog-title">Load Project</DialogTitle>
                <DialogContent>
                    <Select
                        value={selectedProject}
                        onChange={changeSelectChoice}
                        color="primary"
                        label="Load Project"
                    >
                        {savedProjects.map((p) => (<MenuItem value={p}>{p.shortDescription}</MenuItem>))}
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

const ConnectedProjectLoadSavedDialog = connect(mapDialogStateToProps, mapDialogDispatchToProps)(ProjectLoadSavedDialog);

function ProjectMenu({userId, currProject, addProject, setEditorOpen, setDialogOpen, loadSaved}) {
      const [anchorEl, setAnchorEl] = useState(null);

      const handleClick = event => {
              setAnchorEl(event.currentTarget);
            };

      const handleClose = () => {
              setAnchorEl(null);
            };

      const handleLoad = (e) => {
              loadSaved(userId);
              setDialogOpen(true);
            };

      return (
              <div>
                <Tooltip title="Project Settings">
                    <IconButton
                        aria-controls="project-menu"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        onClick={handleClick}
                    >
                        <AccountTreeTwoToneIcon fontSize='large' />
                    </IconButton>
                </Tooltip>
                <StyledMenu
                  id="project-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <StyledMenuItem onClick={addProject(userId)}>
                    <ListItemIcon>
                      <AddCircleTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="New Project" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleLoad}>
                    <ListItemIcon>
                      <FolderOpenTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Load Saved Project" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={setEditorOpen} disabled={currProject._id === undefined}>
                    <ListItemIcon>
                      <EditIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Edit Current Project" />
                    </ListItem>
                  </StyledMenuItem>
                </StyledMenu>
                <ConnectedProjectLoadSavedDialog />
              </div>
            );
};

const mapStateToProps = (state) => ({
    userId: state.user._id,
    currProject: state.project
});

const mapDispatchToProps = (dispatch) => ({
    addProject: (id) => (e) => {dispatch(projectCreate(id)); dispatch(projectSetEditorOpen(true))},
    setEditorOpen: (e) => dispatch(projectSetEditorOpen(true)),
    setDialogOpen: (open) => dispatch(projectSetLoadDialogOpen(open)),
    loadSaved: (id) => dispatch(projectLoadSaved(id)),
});

export default connect(mapStateToProps,mapDispatchToProps)(ProjectMenu);
