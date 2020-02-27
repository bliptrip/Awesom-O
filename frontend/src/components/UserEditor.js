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
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import {userSetEditorOpen, userSetUsername, userSetEmail} from '../actions';

const useStyles = makeStyles({
      list: {
              width: 250,
            },
      fullList: {
              width: 'auto',
            },
});

function UserEditor({username, email, setUsername, setEmail, closeDrawer}) {
    const classes = useStyles();

    return (
        <div
            className={classes.fullList}
            role="presentation"
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
        >
            <TextField label="Username" value={username} onChange={setUsername} />
            <TextField label="Email" value={email} onChange={setEmail} />
        </div>
    );
}

const mapStateToProps = (state) => ({
    username: state.user.username,
    email: state.user.email
});

const mapDispatchToProps = (dispatch) => ({
    closeDrawer: (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(userSetEditorOpen(false));
    },
    setUsername: (event) => dispatch(userSetUsername(event.target.value)),
    setEmail: (event) => dispatch(userSetEmail(event.target.value))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserEditor);
