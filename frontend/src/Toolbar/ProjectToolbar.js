import './ProjectToolbar.scss'
import React, { useState } from 'react';

function ProjectToolbar(props) {
    return(
        <div>
            <a href="#" class="button tooltip" data-tooltip="Load Project">
                <span class="icon is-large">
                    <i class="fas fa-2x fa-folder"></i>
                </span>
            </a>
            <a href="#" class="button tooltip" data-tooltip="Save Project">
                <span class="icon is-large">
                    <i class="fas fa-2x fa-save"></i>
                </span>
            </a>
        </div>
    )
};

export default ProjectToolbar;
