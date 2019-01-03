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
