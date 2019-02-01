const mongoose = require('mongoose');

const {Schema} = mongoose;

const PlateSchema = new Schema({
    row: Number, //Row of plate
    col: Number, //Column of plate
    meta: {type: Map, of: String} //Experimental metadata fields associated with plate
});

const ExperimentConfigSchema = new Schema({
    version: Number, //Version ID
    datetime: Boolean, //Append datetime suffix to files as they are created
    rename: Boolean, //Rename files from default
    imageMeta: Boolean, //Embed metadata in image file, if supported
    filenameFields: [String], //Which metadata fields include in filename, in order listed
    config: [PlateSchema]
});

mongoose.model('ExperimentConfig', ExperimentConfigSchema);
