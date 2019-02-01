const mongoose = require('mongoose');

const {Schema} = mongoose;

const CameraConfigSchema = new Schema({
    version: String,
    description: String,
    manufacturer: String,
    model: String,
    deviceVersion: String,
    gphoto2Config: String
});

mongoose.model('CameraConfig', CameraConfigSchema);

