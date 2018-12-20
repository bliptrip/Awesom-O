const mongoose = require('mongoose');

const {Schema} = mongoose;

const RouteLocationSchema = new Schema({x: Number, y: Number})

const RouteConfigSchema = new Schema({
    version: Number,
    interplatedelay: Number,
    loopdelay: Number,
    preview_hooks: [String],
    capture_hooks: [String],
    stepsPerCmX: Number,
    stepsPerCmY: Number,
    distanceX: Number,
    distanceY: Number,
    route: [RouteLocationSchema]
});

const RouteConfig = mongoose.model('RouteConfig', RouteConfigSchema);
