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
import { withStyles } from '@material-ui/core/styles';
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
import {Tooltip} from '@material-ui/core/';

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

function StorageMenu() {
      const [anchorEl, setAnchorEl] = useState(null);

      const handleClick = event => {
              setAnchorEl(event.currentTarget);
            };

      const handleClose = () => {
              setAnchorEl(null);
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
                  <StyledMenuItem>
                    <ListItemIcon>
                      <AddCircleTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Add Storage Configuration" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem>
                    <ListItemIcon>
                      <FolderOpenTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Load Saved Storage Configuration" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem>
                    <ListItemIcon>
                      <SettingsApplicationsTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Edit Current Storage Configuration" />
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem>
                    <ListItemIcon>
                      <SaveTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button >
                        <ListItemText primary="Save Current Storage Configuration" />
                    </ListItem>
                  </StyledMenuItem>
                </StyledMenu>
              </div>
            );
};

export default StorageMenu;
