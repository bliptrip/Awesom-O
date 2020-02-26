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

const useStyles = makeStyles({
      list: {
              width: 250,
            },
      fullList: {
              width: 'auto',
            },
});

function ProjectEditor({project}) {
    const classes = useStyles();

    return (
        <div
            className={classes.fullList}
            role="presentation"
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
        >
            <TextField label="Short Description" onChange={setShort} />
            <TextField label="Description" onChange={setDescription} />
        </div>
    );
}

const mapStateToProps = (state) => {
    open: state.project.isEditorOpen,
    shortDescription: state.project.short,
    description: state.project.description
}

const mapDispatchToProps = (dispatch) => {
    closeDrawer: (event) => ({
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(projectSetEditorOpen(false));
    }),
    setShort: (event) => dispatch(projectSetShort(event.target.value)),
    setDescription: (event) => dispatch(projectSetDescription(event.target.value))
}

export default connect()(ProjectEditor);
