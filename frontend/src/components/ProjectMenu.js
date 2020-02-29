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
import clsx from 'clsx';
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
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';


import {projectCreate, projectLoadSaved, projectSetEditorOpen} from '../actions';

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

function ProjectSavedProjects({activate, savedProjects}) {
    let [open, setOpen] = useState(activate);
    let [selectedProject, setSelectedProject] = useState(undefined);

    const handleSelect = event => {
        setOpen(false);
    }

    const toValue = project => (project._id+"_"+project.short)

    const changeSelectChoice = event => {
        setSelectedProject(event.target.value);
    }

    if( savedProjects && (savedProjects.length > 0) ) {
        return (
            <List>
                <ListItem>
                    <Select
                        value={toValue(savedProjects[0])}
                        onChange={(e) => {changeSelectChoice(e)}}
                        color="primary"
                        label="Open Saved Project"
                    >
                        {savedProjects.map((p) => (<MenuItem value={toValue(p)}>{p.short}</MenuItem>))}
                    </Select>
                </ListItem>
            </List> );
    } else {
        return ( <>
                 </> );
    }
}

function ProjectMenu({userId, savedProjects, addProject, setEditorOpen, loadSaved}) {
      const [anchorEl, setAnchorEl] = useState(null);

      const handleClick = event => {
              setAnchorEl(event.currentTarget);
            };

      const handleClose = () => {
              setAnchorEl(null);
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
                        <ListItemText primary="Add Project" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={setEditorOpen}>
                    <ListItemIcon>
                      <EditIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Edit Current Project" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={loadSaved(userId)}>
                    <ListItemIcon>
                      <FolderOpenTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Load Saved Project" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem>
                    <ListItemIcon>
                      <SaveTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Save Current Project" />
                    </ListItem>
                  </StyledMenuItem>
                </StyledMenu>
              </div>
            );
};

const mapStateToProps = (state) => ({
    userId: state.user._id,
    savedProjects: state.projects.savedProjects
});

const mapDispatchToProps = (dispatch) => ({
    addProject: (id) => (e) => {dispatch(projectCreate(id)); dispatch(projectSetEditorOpen(true))},
    setEditorOpen: (e) => dispatch(projectSetEditorOpen(true)),
    loadSaved: (id) => (e) => {projectLoadSaved(id)}
});

export default connect(mapStateToProps,mapDispatchToProps)(ProjectMenu);
