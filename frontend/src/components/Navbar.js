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
import clsx from 'clsx';

//Material-UI
import AppBar from '@material-ui/core/AppBar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { makeStyles, useTheme } from '@material-ui/core/styles';

//Icons
import CameraIcon from '@material-ui/icons/Camera';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded';
import HomeIcon from '@material-ui/icons/Home';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopIcon from '@material-ui/icons/Stop';
import SvgIcon from '@material-ui/core/SvgIcon';

import AccountMenu from './UserMenu';
import ProjectMenu from './ProjectMenu';
import CameraMenu from './CameraMenu';
import ExperimentMenu from './ExperimentMenu';
import RouteManualControls from './RouteManualControls';
import RouteMenu from './RouteMenu';
import StorageMenu from './StorageMenu';
import StatusIndicator from './StatusIndicator';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import {CONTROLLER_RUNNING_STATUS_RUNNING,
        CONTROLLER_RUNNING_STATUS_PAUSED,
        CONTROLLER_RUNNING_STATUS_STOPPED,
        viewportPreviewStart,
        viewportPreviewStop,
        controllerMoveHome,
        controllerMovePlate,
        controllerStart,
        controllerPause,
        controllerResume,
        controllerStop,
        cameraCapture} from '../actions';
import {disableOnNotStopped, 
        disableOnNotActiveUser,
        disableOnNotStoppedNotActiveProject, 
        disableOnStoppedNotActiveUser} from '../lib/controller';

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }
}));

const mapPreviewStateToProps = (state) => ({
    previewEnabled: state.camera.previewEnabled
});

const mapPreviewDispatchToProps = (dispatch) => ({
    startPreview: () => dispatch(viewportPreviewStart()),
    stopPreview: () => dispatch(viewportPreviewStop())
});

function Preview({previewEnabled,
                  startPreview,
                  stopPreview}) {
    if( previewEnabled ) {
        return( <Tooltip title="Stop Preview">
                    <IconButton
                        aria-controls="preview-disable"
                        aria-label="disable camera preview"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        onClick={stopPreview}
                    >
                        <VisibilityOffIcon fontSize='large' />
                    </IconButton>
                </Tooltip> );
    } else {
        return( <Tooltip title="Start Preview">
                    <IconButton
                        aria-controls="preview-enable"
                        aria-label="enable camera preview"
                        aria-haspopup="true"
                        variant="contained"
                        color="primary"
                        onClick={startPreview}
                    >
                        <VisibilityIcon fontSize='large' />
                    </IconButton>
                </Tooltip> );
    }
}

const PreviewButton = connect(mapPreviewStateToProps, mapPreviewDispatchToProps)(Preview);

const mapStartPauseResumeStateToProps = (state) => ({
    controllerStatus: state.controller.currentStatus,
    controllerUserId: state.controller.currentUserId,
    activeUserId: state.user._id,
    activeProjectId: state.project._id
});

const mapStartPauseResumeDispatchToProps = (dispatch) => ({
    start: (userId,projectId) => (e) => dispatch(controllerStart(userId,projectId)),
    pause: (e) => dispatch(controllerPause()),
    resume: (e) => dispatch(controllerResume()),
});

function StartPauseResume({controllerStatus,
                           controllerUserId,
                           activeUserId,
                           activeProjectId,
                           start,
                           pause,
                           resume}) {
    switch(controllerStatus) {
        case CONTROLLER_RUNNING_STATUS_RUNNING:
            return(<Tooltip title="Pause Timelapse">
                <IconButton
                    aria-controls="route-pause"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={pause}
                    disabled={disableOnNotActiveUser(controllerUserId,activeUserId)}
                >
                    <PauseCircleOutlineIcon fontSize='large' />
                </IconButton>
            </Tooltip>);
        case CONTROLLER_RUNNING_STATUS_PAUSED:
            return(<Tooltip title="Resume Timelapse">
                <IconButton
                    aria-controls="route-resume"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={resume}
                    disabled={disableOnNotActiveUser(controllerUserId,activeUserId)}
                >
                    <DoubleArrowRoundedIcon fontSize='large' />
                </IconButton>
            </Tooltip>);
        case CONTROLLER_RUNNING_STATUS_STOPPED:
            return(<Tooltip title="Start Timelapse Sequence">
                <IconButton
                    aria-controls="route-start"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={start(activeUserId, activeProjectId)}
                    disabled={disableOnNotStoppedNotActiveProject(controllerStatus,activeProjectId)}
                >
                    <PlayCircleOutlineIcon fontSize='large' />
                </IconButton>
            </Tooltip>);
    }
}

const StartPauseResumeButton = connect(mapStartPauseResumeStateToProps, mapStartPauseResumeDispatchToProps)(StartPauseResume);

function Navbar({openDrawer, 
                openState, 
                controllerStatus, 
                controllerLocation, 
                activeUserId, 
                activeUsername, 
                activeProjectId,
                controllerUserId, 
                controllerProjectId, 
                start, 
                pause, 
                resume, 
                stop, 
                capture}) {
    const classes = useStyles();

    return (
            <AppBar 
                color="transparent"
                position="fixed"
            >
                <Toolbar className={classes.toolbar}>
                    <Tooltip title="Display Route Grid">
                        <IconButton
                            color="inherit"
                            aria-label="open route panel"
                            onClick={openDrawer}
                            edge="false"
                            className={clsx(classes.menuButton, {
                            [classes.hide]: openState,
                            })}
                        >
                            <SvgIcon viewBox='0 0 512 512' fontSize='large'>
                                <path d="m505.53125 317.980469-157.964844-109.253907c3.460938-4.519531 4.070313-10.609374 1.5625-15.726562-2.519531-5.140625-7.742187-8.398438-13.46875-8.398438h-22.972656l-9.066406-6.265624v-45.542969h32.039062c5.726563 0 10.949219-3.257813 13.46875-8.398438 2.519532-5.136719 1.894532-11.265625-1.609375-15.789062l-79.664062-102.792969c-2.839844-3.667969-7.21875-5.8125-11.855469-5.8125s-9.015625 2.144531-11.855469 5.8125l-79.664062 102.792969c-3.503907 4.523437-4.128907 10.648437-1.609375 15.789062 2.519531 5.140625 7.742187 8.398438 13.46875 8.398438h32.039062v45.542969l-9.066406 6.265624h-22.972656c-5.726563 0-10.949219 3.257813-13.46875 8.398438-2.507813 5.117188-1.898438 11.207031 1.5625 15.726562l-157.964844 109.253907c-4.050781 2.800781-6.46875 7.414062-6.46875 12.335937 0 4.925782 2.417969 9.535156 6.46875 12.335938l241 166.683594c2.566406 1.777343 5.546875 2.664062 8.53125 2.664062s5.964844-.886719 8.53125-2.664062l241-166.683594c4.050781-2.800782 6.46875-7.410156 6.46875-12.335938 0-4.925781-2.417969-9.535156-6.46875-12.335937zm-170.957031 106.433593-52.203125-36.105468 57.476562-39.753906 52.207032 36.105468zm-78.574219-54.34375-57.476562-39.753906 39.152343-27.078125 6.46875 8.347657c2.839844 3.664062 7.21875 5.808593 11.855469 5.808593s9.015625-2.144531 11.855469-5.808593l6.46875-8.347657 39.152343 27.078125zm-136.054688 14.59375 52.207032-36.109374 57.476562 39.753906-52.203125 36.109375zm103.433594-170.0625c8.28125 0 15-6.714843 15-15v-81.808593c0-8.28125-6.71875-15-15-15h-16.4375l49.058594-63.304688 49.058594 63.304688h-16.4375c-8.28125 0-15 6.71875-15 15v81.808593c0 8.285157 6.71875 15 15 15h16.4375l-49.058594 63.304688-49.058594-63.304688zm-45.953125 21.617188 17.914063 12.390625 23.929687 30.878906-47.117187 32.589844-52.207032-36.105469zm115.304688 43.269531 23.929687-30.878906 17.914063-12.390625 57.480469 39.753906-52.207032 36.105469zm-199.15625 14.722657 52.207031 36.105468-52.207031 36.109375-52.203125-36.109375zm162.425781 184.550781-52.207031-36.105469 52.207031-36.109375 52.207031 36.109375zm162.425781-112.335938-52.207031-36.109375 52.207031-36.105468 52.203125 36.105468zm0 0"/>
                            </SvgIcon>
                        </IconButton>
                    </Tooltip>
                    <SvgIcon viewBox='0 0 60 60' fontSize='large' style={{margin: "0 20px 0 10px"}}>
                        <g id="015---Petri-Dish-" fill="none"><g id="Icons" transform="translate(1)"><path id="Shape" d="m1.5 50.46v.08z" fill="#cc4b4c"/><path id="Shape" d="m56.55 50.5v-.08z" fill="#cc4b4c"/><path id="Shape" d="m50.08 20.54c-2.57 3.48-5.57 7.76-9.66 9.54-1.0472083.477657-2.2410399.5208075-3.32.12-1.0551054-.4557667-1.90083-1.2907859-2.37-2.34-.4-.71-.57-2.09-1.48-2.33-.45-.12.65-2.42.76-2.66 3.67-7.87 15.6-1.66 16.07-2.33z" fill="#549414"/><path id="Shape" d="m47.08 20.54c-2.57 3.48-5.57 7.76-9.66 9.54-.102496.0503447-.2096736.0905363-.32.12-1.0551054-.4557667-1.90083-1.2907859-2.37-2.34-.4-.71-.57-2.09-1.48-2.33-.45-.12.65-2.42.76-2.66 1.0150552-2.2792179 3.2189064-3.7999138 5.71-3.94 3.64.4 7.1 1.99 7.36 1.61z" fill="#60a917"/><path id="Shape" d="m32.2 17.08c-.2323181 2.3487497-1.3911467 4.5080575-3.22 6-.9038182.7370533-1.9156544 1.3306639-3 1.76-3.3039357 1.1264955-6.9601213.3251398-9.49-2.08-2.4799601-2.1272064-3.7238326-5.3590199-3.31-8.6.25-2.81.7-5.5 0-8.21-.4576789-1.87544902-1.5101369-3.55236532-3-4.78 14.41-1.69 23.06 7.07 22.02 15.91z" fill="#549414"/><path id="Shape" d="m26 23.12c-1.2986398 1.0805185-2.8446595 1.822608-4.5 2.16-1.8590767-.3628265-3.5861835-1.2194715-5-2.48-2.4799601-2.1272064-3.7238326-5.3590199-3.31-8.6.25-2.81.7-5.5 0-8.21-.4576789-1.87544902-1.5101369-3.55236532-3-4.78.67-.08 1.35-.14 2-.17 16.35.77 21.07 15.96 13.81 22.08z" fill="#60a917"/><path id="Shape" d="m58 42c-.0819423 1.0092485-.6146578 1.9277235-1.45 2.5-8.75-7.35-46.46-7.25-55.1 0-.83534219-.5722765-1.36805772-1.4907515-1.45-2.5 0-4.42 13-8 29-8s29 3.58 29 8z" fill="#02a9f4"/><path id="Shape" d="m29 34h-1.5c15.32.22 27.5 3.71 27.5 8-.0100823.4470541-.133985.8841552-.36 1.27.6792384.3397844 1.3196453.752193 1.91 1.23.8353422-.5722765 1.3680577-1.4907515 1.45-2.5 0-4.42-13-8-29-8z" fill="#0377bc"/><path id="Shape" d="m56.55 44.5c-8.71 7.31-46.39 7.32-55.1 0 8.65-7.26 46.37-7.33 55.1 0z" fill="#02a9f4"/><path id="Shape" d="m58 42v9c0 4.42-13 8-29 8s-29-3.58-29-8v-9c.08194228 1.0092485.61465781 1.9277235 1.45 2.5 8.71 7.31 46.39 7.32 55.1 0 .8353422-.5722765 1.3680577-1.4907515 1.45-2.5z" fill="#02a9f4"/><path id="Shape" d="m55 45.54v5.46c0 4.28-12.18 7.77-27.5 8h1.5c16 0 29-3.58 29-8v-9c0 1.58-1.62 2.76-3 3.54z" fill="#0377bc"/></g><g id="Layer_2" fill="#000" transform="translate(0 -1)"><path id="Shape" d="m30.91 34c-.05-1.68-.13-3.34-.24-4.88.48-.23 1.79-.83 3.47-1.46.24.42.44 1.19.71 1.68 1.07 1.93 2.52 3.12 4.71 3.12.7768081.002268 1.545882-.1542691 2.26-.46 4.29-1.86 7.28-6.08 10.07-9.85.1580723-.2134045.2247649-.480922.1853699-.7435555s-.1816418-.49881-.3953699-.6564445c-.2469002-.1825361-.5639719-.2415261-.86-.16-1.92-.29-8.22-3.28-13.38-.7-1.5121566.7674753-2.7028336 2.0467444-3.36 3.61-.3873436.759898-.6859738 1.5618374-.89 2.39-1.13.43-2.08.84-2.72 1.13-.08-.65-.16-1.26-.26-1.81 2.2680083-1.6584298 3.7226493-4.2040516 4-7 1.06-9.14-7.57-18.8-23.21-16.99-.4039182.04403089-.7410404.32808174-.8529524.71867656-.111912.39059481.023637.81007395.3429524 1.06132344 1.3270564 1.09345687 2.2696349 2.58266083 2.69 4.25.68 2.53.23 5.15 0 7.87-.4651861 3.5593947.9096432 7.111351 3.65 9.43 3.27 2.83 7.49 3.8 11.54 1.8.29 2.08.45 4.85.54 7.66-14.22.15-28.91 3.29-28.91 8.99v9c0 5.85 15.46 9 30 9s30-3.15 30-9v-9c0-5.72-14.82-8.87-29.09-9zm7.42-12.34c3.34-1.67 7.36-.47 11 .59-2.33 3.13-4.95 6.45-8.33 7.91-.9114179.4472666-1.9785821.4472666-2.89 0-.667809-.4195158-1.1993516-1.0240153-1.53-1.74-.09-.16-.33-.89-.56-1.36 1.9356556-.6440165 3.9601042-.9814246 6-1 .5522847 0 1-.4477153 1-1s-.4477153-1-1-1c-2.219616.0178762-4.4228259.3822662-6.53 1.08.4501781-1.4869133 1.4714439-2.7347275 2.84-3.47zm-20.19 1.34c-2.2567341-1.9023151-3.3877188-4.8240257-3-7.75.35-3.65 1.21-8.25-1.82-12.25 13.43-.59 20.46 8.14 18.68 16.14-.3808431 1.4898756-1.1952142 2.83324-2.34 3.86-.544594-1.7551163-1.2129362-3.4694139-2-5.13.6037817-.9772942 1.5534775-1.6913512 2.66-2 .5163862-.1960611.7760611-.7736138.58-1.29s-.7736138-.7760611-1.29-.58c-1.1425969.3887073-2.1726031 1.0513446-3 1.93-.42-.7333333-.87-1.4433333-1.35-2.13.4057975-1.0684368 1.2342621-1.9222257 2.29-2.36.3411886-.1107523.5973743-.3951137.6720543-.7459679.0746799-.3508542-.0434914-.71489811-.31-.95499998-.2665087-.24010186-.6408657-.31978445-.9820543-.20903212-1.262309.45560425-2.3242352 1.3405427-3 2.5-1.1157779-1.3882829-2.3540944-2.67345468-3.7-3.84-.2679221-.24731376-.649216-.32920064-.9950565-.21369885s-.6014039.41008255-.6669397.7687626c-.0655358.35868006.069345.72460036.3519962.95493625 1.0744314.9226905 2.0773095 1.9255686 3 3-1.6881778-.1797434-3.3575421.4775455-4.47 1.76-.3645079.4280207-.3130207 1.0704921.115 1.435s1.0704921.3130207 1.435-.115c1.29-1.63 4.15-.86 4.64-.71.39.57.77 1.16 1.12 1.77-1.83 0-4.55.28-6.3 2.2-.263309.2916871-.3313806.7105493-.1739903 1.0706065.1573903.3600573.5110658.594563.9039903.5993935.280642.0018991.5491655-.1142192.74-.32 1.65-1.79 4.79-1.61 5.94-1.47.8572767 1.7314692 1.5697107 3.5309504 2.13 5.38-3.45 1.96-7 1.17-9.86-1.3zm10.86 21c0 .5522847.4477153 1 1 1s1-.4477153 1-1v-3c10.72.11 20.43 1.88 24.78 4.48-10.27 6-41.27 6-51.56 0 4.35-2.59 14.06-4.36 24.78-4.48zm29-1c-.0336369.4480373-.2249606.869658-.54 1.19-4.46-3.04-14.78-5.07-26.46-5.19 0-1 0-2 0-3 16.74.15 27 4.13 27 7zm-29-7v3c-11.67.11-22 2.14-26.45 5.18-.31657389-.3162898-.51134857-.73417-.55-1.18 0-2.86 10.23-6.83 27-7zm1 23c-17.35 0-28-4.08-28-7v-.75c2.23 1.48 7 3.5 16.88 4.74.3572656.0428719.7102645-.1081118.9260254-.3960769.215761-.2879652.2615047-.669163.12-1.0000001-.1415046-.330837-.4487598-.5610511-.8060254-.603923-13.12-1.62-16.49-4.61-17.12-5.32v-2.27c9.43 7.44 46.57 7.44 56 0v5.6c0 2.92-10.65 7-28 7z"/><circle id="Oval" cx="23" cy="55" r="1"/></g></g>
                    </SvgIcon>
                    <Typography variant="h6" className={classes.title}>
                        AwesomO  
                    </Typography>
                    <StatusIndicator className={classes.menuButton} activeUser={activeUsername} activeStatus={controllerStatus} />
                    <Container />
                    <ButtonGroup>
                        <PreviewButton />
                        <Tooltip title="Capture Picture">
                            <IconButton
                                aria-controls="capture-manual"
                                aria-label="manual capture picture"
                                aria-haspopup="true"
                                variant="contained"
                                color="primary"
                                onClick={capture}
                                disabled={disableOnNotStopped(controllerStatus)}
                            >
                                <CameraIcon fontSize='large' />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>
                    <Divider variant='vertical' flexItem />
                    <RouteManualControls />
                    <Divider variant='vertical' flexItem />
                    <ButtonGroup>
                        <StartPauseResumeButton />
                        <Tooltip title="Stop Timelapse Capture Loop">
                            <IconButton
                                aria-controls="route-stop"
                                aria-haspopup="true"
                                variant="contained"
                                color="primary"
                                onClick={stop}
                                disabled={disableOnStoppedNotActiveUser(controllerStatus, controllerUserId, activeUserId)}
                            >
                                <StopIcon fontSize='large' />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>
                    <Container />
                    <AccountMenu />
                    <ProjectMenu />
                    <CameraMenu />
                    <ExperimentMenu />
                    <RouteMenu />
                    <StorageMenu />
                </Toolbar>
            </AppBar>
    );
}

const mapStateToProps = (state) => ({
    controllerStatus: state.controller.currentStatus,
    controllerLocation: state.controller.location,
    controllerUserId: state.controller.currentUserId,
    controllerProjectId: state.controller.currentProjectId,
    activeUserId: state.user._id,
    activeUsername: state.user.username,
    activeProjectId: state.project._id
});


const mapDispatchToProps = (dispatch) => ({
    start: (userId,projectId) => (e) => dispatch(controllerStart(userId,projectId)),
    pause: () => dispatch(controllerPause()),
    resume: () => dispatch(controllerResume()),
    stop: () => dispatch(controllerStop()),
    capture: () => dispatch(cameraCapture())
});

export default connect(mapStateToProps,mapDispatchToProps)(Navbar);
