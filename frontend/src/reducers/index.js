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

import {cameraConfigReducer} from './CameraConfig';
import {experiment} from './ExperimentConfig';
import {project} from './Projects';
import {route} from './RouteConfig';
import {storage} from './StorageConfig';
import controller, * as fromController from './Controller';
import {user} from './Users';
import viewport, * as fromViewport from './Viewport';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    controller,
    viewport,
    user,
    project,
    camera: cameraConfigReducer,
    experiment,
    route,
    storage,
});

export default rootReducer;
