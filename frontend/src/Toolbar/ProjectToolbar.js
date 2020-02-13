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

import React, { useState } from 'react';
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import SaveAltTwoToneIcon from '@material-ui/icons/SaveAltTwoTone';
import {ButtonGroup, Tooltip, IconButton} from '@material-ui/core/';


function ProjectToolbar(props) {
    return(
        <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
            <Tooltip title="Load Project">
                <IconButton aria-label="load project">
                    <AccountTreeTwoToneIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Save Project">
                <IconButton aria-label="save project">
                    <SaveAltTwoToneIcon />
                </IconButton>
            </Tooltip>
        </ButtonGroup>
    );
};

export default ProjectToolbar;
