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

import $ from "jquery";
import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import Paper from "paper";
import React, {useState} from 'react';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { fetchAwesomO } from '../lib/fetch.js';

const useStyles = makeStyles(theme => ({
      root: {
              display: 'flex',
      },
      canvasContainer: {
            height: 'auto',
            'min-height': '480px',
            flex: "1 1 0"
      },
      hide : {
          visibility: "hidden"
      }
}));

class Zoom {
    constructor(editor) {
        this.editor = editor;
        this.factor = 1.25;
        this.maxZoom = 80;
        Paper.project.view.element.addEventListener("wheel", (event) => {
            const mousePosition = new Paper.Point(event.offsetX, event.offsetY);
            this.zoom(event.deltaY, mousePosition);
        });
    }

    destroy() {
        Paper.project.view.element.removeEventListener("wheel");
    }

    zoom(delta, mousePos) {

        const view = Paper.project.view;
        const oldZoom = view.zoom;
        const oldCenter = view.center;

        const viewPos = view.viewToProject(mousePos);
        let newZoom = delta > 0
            ? view.zoom * this.factor
            : view.zoom / this.factor;
        if (newZoom <= 1) {
            newZoom = 1;
            view.center = {x: this.editor.viewWidth / 2, y: this.editor.viewHeight / 2};
        }
        newZoom = Math.min(newZoom, this.maxZoom);
        if (newZoom != view.zoom) {
            view.zoom = newZoom;
            const zoomScale = oldZoom / newZoom;
            const centerAdjust = viewPos.subtract(oldCenter);
            const offset = viewPos.subtract(centerAdjust.multiply(zoomScale))
                .subtract(oldCenter);
            view.center = view.center.add(offset);
            this.editor.onZoom(newZoom);
        }
    }

}

function Viewport(props)  {
    const classes = useStyles();
    var canvas = undefined;
    var raster = undefined;
    var viewWidth = 0;
    var viewHeight = 0;
    var viewZoom;
    var imageWidth = 0;
    var imageHeight = 0;
    var mainLayerOpacity = 0.75;
    var previewImage = "/480x320.png";
    var rasterLayer;
    var zoomLevel;
    var zoomPoint;
    var initialized;
    var offsetX
    var offsetY;

    /**
     * Apply the zoom/pan transformation to all layers
     * @param mat
     */
    function transformAllLayers(mat) {
        rasterLayer.matrix = mat;
        //mainLayer.matrix = mat;
    }

    function onZoom(zoomLvl) {
        zoomLevel = zoomLvl;
    }

    function loadCameras() {
        fetchAwesomO({url:"/camera/list"})
        .then(res => {
            if ((res.status == 401) && (res.statusText == "Unauthorized")) {
                return null;
            } else {
                return(res.json());
            }
        })
        .then(myJson => {
            console.log(JSON.stringify(myJson));
        });
        return;
    }

    function captureImage() {
        fetchAwesomO({url: "/camera/capture"})
        .then(res => {
            if ((res.status == 401) && (res.statusText == "Unauthorized")) {
                return null;
            } else {
                return(res.json());
            }
        })
        .then(myJson => {
            console.log(JSON.stringify(myJson));
        });
        return;
    }

    function startPreview() {
        fetchAwesomO({url: "/camera/preview"})
        .then(res => {
            if ((res.status == 401) && (res.statusText == "Unauthorized")) {
                return null;
            } else {
                return(res.json());
            }
        })
        .then(myJson => {
            console.log(JSON.stringify(myJson));
        });
        return;
    }

    function stopPreview() {
        return;
    }

    function onFocus(event) {
        const mousePosition = new Paper.Point(event.offsetX, event.offsetY);
        const view = Paper.project.view;
        const viewPos = view.viewToProject(mousePosition);
    }

    /**
     * Viewport initialization
     */
    function componentDidMount() {
        if (!initialized) {
            initialized = true;
        }

        canvas = $('#rasterCanvas').get(0);

        Paper.setup(canvas);

        // The layer for the image
        rasterLayer = new Paper.Layer();
        rasterLayer.applyMatrix = false;

        rasterLayer.activate();

        window.addEventListener('resize', resizeCanvas.bind(this));

        Paper.project.view.element.addEventListener("dblclick", (event) => {
            const mousePosition = new Paper.Point(event.offsetX, event.offsetY);
            const view = Paper.project.view;
            const viewPos = view.viewToProject(mousePosition);
        });

        imageLoaded();

    }

    /**
     * Re-initialize viewport component -- for source image updates and updates to application status
     */
    function componentDidUpdate() {
        //
        imageLoaded();
    }

    /**
     * Compute geometrical characteristics related to the loading image
     */
    function resizeCanvas() {
        const canvasContainer = $('#canvasContainer').get(0);
        if (!canvasContainer || !raster)
            return;
        viewWidth = canvasContainer.width;
        viewHeight = canvasContainer.height;
        Paper.project.view.viewSize = new Paper.Size(viewWidth, viewHeight);

        //if (viewZoom) {
        //    viewZoom.destroy();
        //} 
        
        if (!viewZoom) 
        { 
            viewZoom = new Zoom(this); 
        }

        const viewRatio = viewWidth / viewHeight;
        const bitmapRatio = imageWidth / imageHeight;

        let scaleFactor;

        const gutterRatio = .98;
        if (viewRatio < bitmapRatio) {
            scaleFactor = gutterRatio * canvasContainer.offsetWidth / imageWidth;
        }
        else {
            scaleFactor = gutterRatio * canvasContainer.offsetHeight / imageHeight;
        }

        offsetX = (viewWidth - scaleFactor * imageWidth) / 2;
        offsetY = (viewHeight - scaleFactor * imageHeight) / 2;

        // zoomPoint keeps the mouse position on every mouse moves to be able to zoom to the
        // right position on mouse wheel events
        zoomPoint = new Paper.Point(viewWidth / 2, viewHeight / 2);

        // The scaling factor computed to display the whole image using the available room of the view
        scaleFactor = scaleFactor;
        const fullScreenMatrix = new Paper.Matrix().translate(offsetX, offsetY).scale(scaleFactor);
        transformAllLayers(fullScreenMatrix);
        disableSmoothing();
    }

    function disableSmoothing() {
        const canvas = $('#rasterCanvas').get(0);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
    }

    /**
     * Adds the image to the raster layer when it's loaded.
     */
    function imageLoaded() {
        const image = $("#sourceImage").get(0);
        image.hidden="hidden";

        imageWidth = image.width;
        imageHeight = image.height;

        rasterLayer.activate();
        raster = new Paper.Raster(image, new Paper.Point(imageWidth / 2, imageHeight / 2));
        raster.visible = false;

        raster.onLoad = () => {
            // Adjust the canvas layer and draw annotations when the raster is ready
            resizeCanvas();

            raster.visible = true;
        };
    }

    return (
        <Grid container alignItems='center' justify='center' id="canvasContainer" className={classes.canvasContainer, classes.root}>
            <img id="sourceImage" src={props.imageSrc || previewImage} />
        </Grid>
    );
};

const mapStateToProps = state => ({
    controllerStatus: state.controller.status,
    imageSrc: state.viewport.src
});

const mapDispatchToProps = dispatch => ({
});

const VisibleViewport = connect(mapStateToProps,mapDispatchToProps)(Viewport);

export default VisibleViewport;
