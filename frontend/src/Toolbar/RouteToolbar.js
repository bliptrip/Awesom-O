import './RouteToolbar.scss'
import React, { useState } from 'react';

function RouteToolbar(props) {
    return(
        <div>
            <div class="level">
                <div class="level-item">
                    <a href="#" class="button tooltip" data-tooltip="Start/Pause Route">
                        <span class="icon is-large">
                            <i class="fas fa-2x fa-play-circle"></i>
                        </span>
                    </a>
                </div>
                <div class="level-item">
                    <a href="#" class="button tooltip" data-tooltip="Stop Route">
                        <span class="icon is-large">
                            <i class="fas fa-2x fa-stop-circle"></i>
                        </span>
                    </a>
                </div>
                <div class="is-divider" data-content=""></div>
                <div class="level-item">
                    <div class="tile is-ancestor">
                        <div class="tile is-vertical">
                            <div class="tile is-parent">
                                <div class="tile is-child" />
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm Up">
                                        <span class="icon is-medium">
                                            <i class="fas fa-caret-up"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="tile is-child" />
                            </div>
                            <div class="tile is-parent">
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm Left">
                                        <span class="icon is-medium tooltip">
                                            <i class="fas fa-caret-left"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm to Home Position">
                                        <span class="icon is-medium">
                                            <i class="fas fa-home"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm Right">
                                        <span class="icon is-medium">
                                            <i class="fas fa-caret-right"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div class="tile is-parent">
                                <div class="tile is-child" />
                                <div class="tile is-child">
                                    <a href="#" class="button tooltip" data-tooltip="Move Arm Down">
                                        <span class="icon is-medium">
                                            <i class="fas fa-caret-down"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="tile is-child" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default RouteToolbar;
