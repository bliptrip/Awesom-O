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

export const disableOnNotActiveUser = (controllerUser, activeUser) => {
    if( controllerUser !== activeUser )
        return true;
    return false;
};

export const disableOnNotStoppedNotActiveUser = (controllerStatus, controllerUser, activeUser) => {
    if( controllerStatus !== CONTROLLER_RUNNING_STATUS_STOPPED )
        return true;
    if(  controllerUser !== activeUser )
        return true;
    return false;
};

export const disableOnStoppedNotActiveUser = (controllerStatus, controllerUser, activeUser) => {
    if( controllerStatus === CONTROLLER_RUNNING_STATUS_STOPPED )
        return true;
    if(  controllerUser !== activeUser )
        return true;
    return false;
};
