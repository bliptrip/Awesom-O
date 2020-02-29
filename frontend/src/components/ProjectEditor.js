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
import React from 'react';
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';

import CancelIcon from '@material-ui/icons/Cancel';

import {projectSetEditorOpen, projectSetShort, projectSetDescription} from '../actions';

const useStyles = makeStyles({
      list: {
              width: 250,
            },
      fullList: {
              width: 'auto',
            },
});

function ProjectEditor({closeDrawer, short, description, setShort, setDescription}) {
    const classes = useStyles();

    return (
        <div
            className={classes.fullList}
            role="presentation"
        >
            <List>
                <ListItem>
                    <CancelIcon fontSize='small' onClick={closeDrawer}/>
                    <Container />
                </ListItem>
                <ListItem>
                    <TextField label="Short Description" value={short} onChange={setShort} />
                </ListItem>
                <ListItem>
                    <TextField label="Description" value={description} onChange={setDescription} />
                </ListItem>
            </List>
        </div>
    );
}

const mapStateToProps = (state) => ({
    short: state.project.short,
    description: state.project.description
});

const mapDispatchToProps = (dispatch) => ({
    closeDrawer: (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(projectSetEditorOpen(false));
    },
    setShort: (event) => {console.log(event.target.value); dispatch(projectSetShort(event.target.value))},
    setDescription: (event) => dispatch(projectSetDescription(event.target.value))
});

export default connect(mapStateToProps,mapDispatchToProps)(ProjectEditor);
