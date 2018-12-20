const mongoose = require('mongoose');

const {Schema} = mongoose;

const CameraConfigSchema = new Schema({
    version: String,
    description: String,
    manufacturer: String,
    model: String,
    device_version: String,
    gphoto2_config: String
});

const CameraConfig = mongoose.model('CameraConfig', CameraConfigSchema);

