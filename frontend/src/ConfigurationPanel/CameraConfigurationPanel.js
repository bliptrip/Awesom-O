import './CameraConfigurationPanel.scss';
import React, {useState} from 'react';

function CameraConfigurationPanel(props) {
    return(
        <div class="content">
            <nav class='level'>
                <div class='level-item level-left'>
                    <span>
                        <a href="#" class="button tooltip" data-tooltip="Load Camera Settings from attached Camera">
                            <span class="icon is-large">
                                <i class="fas fa-2x fa-download"></i>
                            </span>
                        </a>
                        <a href="#" class="button tooltip" data-tooltip="Apply Current Settings to attached Camera">
                            <span class="icon is-large">
                                <i class="fas fa-2x fa-upload"></i>
                            </span>
                        </a>
                    </span>
                </div>
                <div class='level-item'>
                    <div class="content">
                        <div class="level box">
                            <div class="level-item level-left">
                                <label class="label">Model: </label>
                            </div>
                            <div class="level-item">
                                <u>Camera Model</u>
                            </div>
                        </div>
                        <hr />
                        <div class="level box">
                            <div class="level-item level-left">
                                <label class="label">Serial Number: </label>
                            </div>
                            <div class="level-item">
                                <u>Camera Serial Number</u>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <section class="accordions">
                <article class="accordion is-active">
                    <div class="accordion-header toggle">
                        <p>Image Settings</p>
                        <button class="toggle" aria-label="toggle"></button>
                    </div>
                    <div class="accordion-body">
                        Image Settings Body
                    </div>
                </article>
                <article class="accordion">
                    <div class="accordion-header toggle">
                        <p>Capture Settings</p>
                        <button class="toggle" aria-label="toggle"></button>
                    </div>
                    <div class="accordion-body">
                        <div class="accordion-content toggle">
                            Capture Settings Body
                        </div>
                    </div>
                </article>
                <article class="accordion">
                    <div class="accordion-header toggle">
                        <p>General Settings</p>
                        <button class="toggle" aria-label="toggle"></button>
                    </div>
                    <div class="accordion-body">
                        <div class="accordion-content">
                            General Settings Body
                        </div>
                    </div>
                </article>
            </section>
        </div>
    )
};

export default CameraConfigurationPanel;
