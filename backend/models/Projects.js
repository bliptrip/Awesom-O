const mongoose = require('mongoose');

const {Schema} = mongoose;

const ProjectsSchema = new Schema({
    version: Number,
    description: String,
    cameraConfig: {type: Schema.Types.ObjectId, ref: 'CameraConfig'},
    experimentConfig: {type: Schema.Types.ObjectId, ref: 'ExperimentConfig'},
    imagePath: String,
    routeConfig: {type: Schema.Types.ObjectId, ref: 'RouteConfig'},
    cloudConfig: {type: Schema.Types.ObjectId, ref: 'CloudConfig'}
});

mongoose.model('Projects', ProjectsSchema);
