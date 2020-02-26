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

function Editors({user, project, camera, experiment, storage, route, dispatch}) {
      const classes = useStyles();

      return (
              <div>
                <SwipeableDrawer
                  anchor="right",
                  open={user.isEditorOpen},
                  onClose={dispatch(userSetEditorOpen(false))},
                  onOpen={dispatch(userSetEditorOpen(true))}
                >
                    <UserEditor />
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right",
                  open={project.isEditorOpen},
                  onClose={dispatch(projectSetEditorOpen(false))},
                  onOpen={dispatch(projectSetEdidtorOpen(true))}
                >
                    <ProjectEditor />
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right",
                  open={camera.isEditorOpen},
                  onClose={dispatch(cameraSetEditorOpen(false))},
                  onOpen={dispatch(cameraEditorClose(true))}
                >
                    <CameraEditor />
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right",
                  open={experiment.isEditorOpen},
                  onClose={dispatch(experimentEditorOpen())},
                  onOpen={dispatch(experimentEditorClose())}
                >
                    <ExperimentEditor experiment={experiment}/>
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right",
                  open={storage.isEditorOpen},
                  onClose={dispatch(storageEditorOpen())},
                  onOpen={dispatch(storageEditorClose())}
                >
                    <StorageEditor storage={storage}/>
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor="right",
                  open={route.isEditorOpen},
                  onClose={dispatch(routeEditorOpen())},
                  onOpen={dispatch(routeEditorClose())}
                >
                    <RouteEditor route={route}/>
                </SwipeableDrawer>
              </div>
            );
}

const mapStateToProps = (state) => ({
    user: state.user,
    project: state.project,
    camera: state.camera,
    experiment: state.experiment,
    storage: state.storage,
    route: state.route
});

export default connect(mapStateToProps, null)(Editors);
