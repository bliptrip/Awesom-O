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

import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';
import SaveAltTwoToneIcon from '@material-ui/icons/SaveAltTwoTone';

const SaveButtonBar = ({descriptor,entry,save,saveAs}) => {
    return(
        <ButtonGroup>
            <Tooltip title={"Save " + descriptor}>
                <IconButton
                    aria-controls={"save-"+descriptor}
                    aria-label={"Save " + descriptor}
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={save(entry)}
                >
                    <SaveTwoToneIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Save " + descriptor + " As"}>
                <IconButton
                    aria-controls={"save-as-"+descriptor}
                    aria-label={"Save " + descriptor + " As"}
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={saveAs(entry)}
                >
                    <SaveAltTwoToneIcon fontSize='large' />
                </IconButton>
            </Tooltip>
        </ButtonGroup>
    );
};

export default SaveButtonBar;
