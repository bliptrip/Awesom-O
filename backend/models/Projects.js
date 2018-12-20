const mongoose = require('mongoose');

const {Schema} = mongoose;

const ProjectsSchema = new Schema({
    version: Number,
    description: String,
    camera_config: {Schema.Types.ObjectId, ref: 'CameraConfig'},
    experiment_config: {Schema.Types.ObjectId, ref: 'ExperimentConfig'},
    image_path: String,
    route_config: {Schema.Types.ObjectId, ref: 'RouteConfig'},
    cloud_config: {Schema.Types.ObjectId, ref: 'CloudConfig'}
});

const Projects = mongoose.model('Projects', ProjectsSchema);
