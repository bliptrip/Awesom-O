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
