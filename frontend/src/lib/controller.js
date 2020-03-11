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

import {CONTROLLER_RUNNING_STATUS_RUNNING,CONTROLLER_RUNNING_STATUS_PAUSED,CONTROLLER_RUNNING_STATUS_STOPPED} from '../actions';

export const disableOnNotStopped = (controllerStatus) => {
    if( controllerStatus !== CONTROLLER_RUNNING_STATUS_STOPPED )
        return true;
    return false;
};

export const disableOnNotActiveUser = (controllerUserId, activeUserId) => {
    if( controllerUserId !== activeUserId )
        return true;
    return false;
};

export const disableOnNotStoppedNotActiveProject = (controllerStatus, activeProjectId) => {
    if( controllerStatus !== CONTROLLER_RUNNING_STATUS_STOPPED )
        return true;
    if( activeProjectId === undefined )
        return true;
    return false;
};

export const disableOnNotStoppedNotActiveUser = (controllerStatus, controllerUserId, activeUserId) => {
    if( controllerStatus !== CONTROLLER_RUNNING_STATUS_STOPPED )
        return true;
    if(  (controllerUserId != undefined) && (controllerUserId !== activeUserId) )
        return true;
    return false;
};

export const disableOnStoppedNotActiveUser = (controllerStatus, controllerUserId, activeUserId) => {
    if( controllerStatus === CONTROLLER_RUNNING_STATUS_STOPPED )
        return true;
    if(  (controllerUserId != undefined) && (controllerUserId !== activeUserId) )
        return true;
    return false;
};
