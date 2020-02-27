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
import React from 'react';
import {connect} from 'react-redux';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import UserEditor from './UserEditor';
import ProjectEditor from './ProjectEditor';
import CameraEditor from './CameraEditor';
import ExperimentEditor from './ExperimentEditor';
import RouteEditor from './RouteEditor';
import StorageEditor from './StorageEditor';


import {userSetEditorOpen, projectSetEditorOpen, cameraConfigSetEditorOpen, experimentConfigSetEditorOpen, storageConfigSetEditorOpen, routeConfigSetEditorOpen} from '../actions';

function Editors({userEOpen, projectEOpen, cameraEOpen, experimentEOpen, storageEOpen, routeEOpen, dispatch}) {
      return (
          <div>
                <SwipeableDrawer
                  anchor="right"
                  open={userEOpen}
                  onClose={(e) => dispatch(userSetEditorOpen(false))}
                  onOpen={(e) => dispatch(userSetEditorOpen(true))}
                >
                    <UserEditor />
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right"
                  open={projectEOpen}
                  onClose={e => dispatch(projectSetEditorOpen(false))}
                  onOpen={e => dispatch(projectSetEditorOpen(true))}
                >
                    <ProjectEditor />
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right"
                  open={storageEOpen}
                  onClose={e => dispatch(storageConfigSetEditorOpen(false))}
                  onOpen={e => dispatch(storageConfigSetEditorOpen(true))}
                >
                    <StorageEditor />
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right"
                  open='true'
                  onClose={e => dispatch(experimentConfigSetEditorOpen(false))}
                  onOpen={e => dispatch(experimentConfigSetEditorOpen(true))}
                >
                    <ExperimentEditor />
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right"
                  open={routeEOpen}
                  onClose={e => dispatch(routeConfigSetEditorOpen(false))}
                  onOpen={e => dispatch(routeConfigSetEditorOpen(true))}
                >
                    <RouteEditor />
                </SwipeableDrawer>
          </div>
      );
      return (
              <div>
                <SwipeableDrawer
                  anchor="right"
                  open={cameraEOpen}
                  onClose={e => dispatch(cameraConfigSetEditorOpen(false))}
                  onOpen={dispatch(cameraConfigSetEditorOpen(true))}
                >
                    <CameraEditor />
                </SwipeableDrawer>
              </div>
            );
}

const mapStateToProps = (state) => ({
    userEOpen: state.user.isEditorOpen,
    projectEOpen: state.project.isEditorOpen,
    cameraEOpen: state.camera.isEditorOpen,
    experimentEOpen: state.experiment.isEditorOpen,
    storageEOpen: state.storage.isEditorOpen,
    routeEOpen: state.route.isEditorOpen
});

export default connect(mapStateToProps, null)(Editors);
