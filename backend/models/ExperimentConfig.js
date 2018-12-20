const mongoose = require('mongoose');

const {Schema} = mongoose;

const PlateSchema = new Schema({
    row: Number,
    col: Number,
    file_prefix: Number,
    meta: {type: Map, of: String}
});

const ExperimentConfigSchema = new Schema({
    version: Number,
    config: [PlateSchema]
});

const ExperimentConfig = mongoose.model('ExperimentConfig', ExperimentConfigSchema);
