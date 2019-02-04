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

import './Toolbar.scss'
import React, { useState } from 'react';
import UserProfile from './UserProfile';
import ProjectToolbar from './ProjectToolbar';
import RouteToolbar from './RouteToolbar';
import StatusIndicator from './StatusIndicator';


function Toolbar(props) {
    const [user, setUser] = useState(props.user);
    const [rstatus, setRStatus] = useState(props.rstatus);
    return (
        <div class="box">
            <h1><strong>Awesom-O</strong></h1>
            <nav class="level">
                <div class="level-left level-item">
                    <UserProfile user={user}/>
                </div>
                <div class="level-item">
                    <ProjectToolbar />
                </div>
                <div class="level-item">
                    <RouteToolbar />
                </div>
                <div class="level-right level-item">
                    <StatusIndicator rstatus={rstatus}/>
                </div>
            </nav>
        </div>
    )
}

export default Toolbar;
