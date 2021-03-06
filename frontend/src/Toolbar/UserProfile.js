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

import './UserProfile.scss'
import React, { useState } from 'react';


function UserProfile(props) {
    return (
        <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span class="icon is-large">
                        <i class="fas fa-2x fa-bars"></i>
                    </span>
                </button>
            </div>
            <div class="dropdown-menu" id="userprofile-dropdown-menu" role="menu">
                <div class="dropdown-content"> 
                    <a href="#" class="dropdown-item">User Settings</a>
                    <hr class="dropdown-divider" />
                    <a href="#" class="dropdown-item">Sign Out/Switch User</a>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;
