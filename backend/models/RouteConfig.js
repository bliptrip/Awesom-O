const mongoose = require('mongoose');

const {Schema} = mongoose;

const RouteLocationSchema = new Schema({x: Number, y: Number})

const RouteConfigSchema = new Schema({
    version: Number,
    interplatedelay: Number,
    loopdelay: Number, 
    preview_hooks: [String], //List of preview hook scripts to call
    capture_hooks: [String], //List of capture hook scripts to call
    stepsPerCmX: Number, //Motor steps/cm in x direction
    stepsPerCmY: Number, //Motor steps/cm in y direction
    distanceX: Number, //X distance in cm b/w plates
    distanceY: Number, //Y distance in cm b/w plates
    route: [RouteLocationSchema]
});

const RouteConfig = mongoose.model('RouteConfig', RouteConfigSchema);
