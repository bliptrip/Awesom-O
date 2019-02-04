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

import './ConfigurationPanel.scss';
import VisibleCameraConfigurationPanel from './CameraConfigurationPanel.js';
import DataConfigurationPanel from './DataConfigurationPanel.js';
import RouteConfigurationPanel from './RouteConfigurationPanel.js';
import ScheduleConfigurationPanel from './ScheduleConfigurationPanel.js';
import React, {useState} from 'react';

function ConfigurationPanel(props) {
    const [currentTab, setCurrentTab] = useState(<VisibleCameraConfigurationPanel />);

    function currentTabWrapper(id) {
        switch(id) {
            case 'tab-camera':
                setCurrentTab(<VisibleCameraConfigurationPanel />);
                break;
            case 'tab-data':
                setCurrentTab(<DataConfigurationPanel />);
                break;
            case 'tab-schedule':
                setCurrentTab(<ScheduleConfigurationPanel />);
                break;
            case 'tab-route':
            default:
                setCurrentTab(<RouteConfigurationPanel />);
                break;
        }
    }

    return(
        <React.Fragment>
            <div class="tabs is-medium is-toggle">
                <ul id="tabs-configuration-panel">
                    <li class="is-active" id="tab-camera">
                        <a onClick={() => currentTabWrapper('tab-camera')}>
                            <span class="icon is-large"><i class="fas fa-2x fa-camera" aria-hidden="true"></i></span>
                            <span>Camera</span>
                        </a>
                    </li>
                    <li id="tab-data">
                        <a onClick={() => currentTabWrapper('tab-data')}>
                            <span class="icon is-large"><i class="fas fa-2x fa-database" aria-hidden="true"></i></span>
                            <span>Data</span>
                        </a>
                    </li>
                    <li id="tab-schedule">
                        <a onClick={() => currentTabWrapper('tab-schedule')}>
                            <span class="icon is-large"><i class="fas fa-2x fa-clock" aria-hidden="true"></i></span>
                            <span>Schedule</span>
                        </a>
                    </li>
                    <li id="tab-route">
                        <a onClick={() => currentTabWrapper('tab-route')}>
                            <span class="icon is-large"><i class="fas fa-2x fa-route" aria-hidden="true"></i></span>
                            <span>Route</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                {currentTab}
            </div>
        </React.Fragment>
    )
};

export default ConfigurationPanel;
