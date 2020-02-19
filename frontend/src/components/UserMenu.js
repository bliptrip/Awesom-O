/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2020  Andrew F. Maule

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
import React,{useState} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FingerprintTwoToneIcon from '@material-ui/icons/FingerprintTwoTone';
import FaceTwoToneIcon from '@material-ui/icons/FaceTwoTone';
import LockOpenTwoToneIcon from '@material-ui/icons/LockOpenTwoTone';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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

function AccountMenu({username,email,userLogout}) {
      const [anchorEl, setAnchorEl] = useState(null);

      const handleClick = event => {
              setAnchorEl(event.currentTarget);
            };

      const handleClose = () => {
              setAnchorEl(null);
            };

      return (
              <div>
                <Tooltip title="Account Info">
                    <IconButton
                    aria-controls="account-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    >
                        <FingerprintTwoToneIcon fontSize='large' />
                    </IconButton>
                </Tooltip>
                <StyledMenu
                  id="account-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <StyledMenuItem>
                    <ListItemIcon>
                      <FaceTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button component="a" href="/profile">
                        <ListItemText primary={username + " Profile"}/>
                    </ListItem>
                  </StyledMenuItem>
                  <StyledMenuItem>
                    <ListItemIcon>
                      <LockOpenTwoToneIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItem button component="a" onClick={userLogout}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                  </StyledMenuItem>
                </StyledMenu>
              </div>
            );
}

const mapStateToProps = (state) => ({
    _id: state.user._id,
    username: state.user.username,
    email: state.user.email
});

const mapDispatchToProps = (dispatch) => ({
    userLogout: () => dispatch(actions.userLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountMenu);
