import './Viewport.scss'
import $ from "jquery";
import Paper from "paper";
import React, {useState} from 'react';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { getControllerStatus, getViewportImage } from '../reducers';

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

class Viewport extends React.Component {
    constructor(props) {
        super();
        this.canvas = undefined;
        this.raster = undefined;
        this.viewWidth = 0;
        this.viewHeight = 0;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.mainLayerOpacity = 0.75;
        //const [previewImage, setPreviewImage] = useState();
        this.previewImage = "https://bulma.io/images/placeholders/480x320.png";
        this.token = cookie.load('token');
    }

    /**
     * Apply the zoom/pan transformation to all layers
     * @param mat
     */
    transformAllLayers(mat) {
        this.rasterLayer.matrix = mat;
        //this.mainLayer.matrix = mat;
    }

    onZoom(zoomLvl) {
        this.zoomLevel = zoomLvl;
    }

    loadCameras() {
        fetch("/camera/list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + this.token,
            }
        })
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

    captureImage() {
        fetch("/camera/capture", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + this.token,
            }
        })
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

    startPreview() {
        fetch("/camera/preview", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + this.token,
            }
        })
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

    stopPreview() {
        return;
    }

    onFocus(event) {
        const mousePosition = new Paper.Point(event.offsetX, event.offsetY);
        const view = Paper.project.view;
        const viewPos = view.viewToProject(mousePosition);
    }

    /**
     * Viewport initialization
     */
    componentDidMount() {
        if (!this.initialized) {
            this.initialized = true;
        }

        this.canvas = $('#rasterCanvas').get(0);

        Paper.setup(this.canvas);

        // The layer for the image
        this.rasterLayer = new Paper.Layer();
        this.rasterLayer.applyMatrix = false;

        // The layer for drawing the annotations
        // this.mainLayer = new Paper.Layer();
        // this.mainLayer.applyMatrix = false;
        // this.mainLayer.opacity = this.mainLayerOpacity;

        this.rasterLayer.activate();

        //this.pointerTool = new SsePointerTool(this);
        //this.rectangleTool = new SseRectangleTool(this);
        window.addEventListener('resize', this.resizeCanvas.bind(this));

        Paper.project.view.element.addEventListener("dblclick", (event) => {
            const mousePosition = new Paper.Point(event.offsetX, event.offsetY);
            const view = Paper.project.view;
            const viewPos = view.viewToProject(mousePosition);
        });

        // Disable context menu
        //$('body').on('contextmenu', 'div', function () {
        //    return false;
        //});

        this.imageLoaded();

    }

    /**
     * Re-initialize viewport component -- for source image updates and updates to application status
     */
    componentDidUpdate() {
        //
        this.imageLoaded();
    }

    /**
     * Compute geometrical characteristics related to the loading image
     */
    resizeCanvas() {
        const canvasContainer = $('#canvasContainer').get(0);
        if (!canvasContainer || !this.raster)
            return;
        this.viewWidth = canvasContainer.offsetWidth;
        this.viewHeight = canvasContainer.offsetHeight;
        Paper.project.view.viewSize = new Paper.Size(this.viewWidth, this.viewHeight);

        //if (this.viewZoom) {
        //    this.viewZoom.destroy();
        //} 
        
        if (!this.viewZoom) 
        { 
            this.viewZoom = new Zoom(this); 
        }

        const viewRatio = this.viewWidth / this.viewHeight;
        const bitmapRatio = this.imageWidth / this.imageHeight;

        let scaleFactor;

        const gutterRatio = .98;
        if (viewRatio < bitmapRatio) {
            scaleFactor = gutterRatio * canvasContainer.offsetWidth / this.imageWidth;
        }
        else {
            scaleFactor = gutterRatio * canvasContainer.offsetHeight / this.imageHeight;
        }

        this.offsetX = (this.viewWidth - scaleFactor * this.imageWidth) / 2;
        this.offsetY = (this.viewHeight - scaleFactor * this.imageHeight) / 2;

        // zoomPoint keeps the mouse position on every mouse moves to be able to zoom to the
        // right position on mouse wheel events
        this.zoomPoint = new Paper.Point(this.viewWidth / 2, this.viewHeight / 2);

        // The scaling factor computed to display the whole image using the available room of the view
        this.scaleFactor = scaleFactor;
        const fullScreenMatrix = new Paper.Matrix().translate(this.offsetX, this.offsetY).scale(scaleFactor);
        this.transformAllLayers(fullScreenMatrix);
        this.disableSmoothing();
    }

    disableSmoothing() {
        const canvas = $('#rasterCanvas').get(0);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
    }

    /**
     * Adds the image to the raster layer when it's loaded.
     */
    imageLoaded() {
        const image = $("#sourceImage").get(0);
        image.hidden="hidden";

        this.imageWidth = image.width;
        this.imageHeight = image.height;
        //this.filterCanvas.width = this.imageWidth;
        //this.filterCanvas.height = this.imageHeight;

        this.rasterLayer.activate();
        this.raster = new Paper.Raster(image, new Paper.Point(this.imageWidth / 2, this.imageHeight / 2));
        this.raster.visible = false;

        this.raster.onLoad = () => {
            // Adjust the canvas layer and draw annotations when the raster is ready
            this.resizeCanvas();

            this.raster.visible = true;
        };
    }

    render() {
        return (
            <div id="canvasContainer">
                <canvas id="rasterCanvas" contextmenu="cameraCaptureControl" class="box image is-3x2" />
                <menu type="context" id="cameraCaptureControl">
                    <menuitem label="Load Cameras" onClick={this.loadCameras.bind(this)}></menuitem>
                    <menuitem label="Capture Image" onClick={this.captureImage.bind(this)}></menuitem>
                    <menuitem label="Start Preview" onClick={this.startPreview.bind(this)}></menuitem>
                    <menuitem label="Stop Preview" onClick={this.stopPreview.bind(this)}></menuitem>
                </menu>
                <img id="sourceImage" src={this.props.imageSrc} class="hidden" />
            </div>
        );
    };
};

const mapStateToProps = state => ({
    controllerStatus: getControllerStatus(state),
    imageSrc: getViewportImage(state),
});

const mapDispatchToProps = dispatch => ({
});

const VisibleViewport = connect(mapStateToProps,mapDispatchToProps)(Viewport);

export default VisibleViewport;
