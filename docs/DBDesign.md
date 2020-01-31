# Database Design/Organization

This document details the structure of the table components in the configuration database used by this application.  It can
be implemented as a MongoDB database structure.

## User Table
Defines list of users of system, credentials, and projects associated with them.

`user`<br>
`{   'version': <version>,`<br>
`    'username': <name>,`<br>
`    'email': <email>,`<br>
`    'hash': <password hash>,`<br>
`    'projects': [<project table id>, ...]`<br>
`    'tokenIds': [<active javascript web token id 0, ...]>`<br>
`}`

## Project Table
Defines project-specific configuration parameters.

`project`<br>
`{   'version': <version>,`<br>
`    'description': <description string>,`<br>
`    'cameraConfig': <camera_config table id>,`<br>
`    'experimentConfig': <experimental configuration table id reference>,`<br>
`    'storageConfig': [<persistent storage configuration 0>, <persistent storage configuration 1>, ...]`<br>
`    'routeConfig': <route configuration table id reference>`<br>
`}`

## Camera Configuration Table
Defines the camera configuration associated with project.

`CameraConfig`<br>
`{   'version': <version>,`<br>
`    'description': <description string>,`<br>
`    'manufacturer': <manufacturer string>,`<br>
`    'model': <model string>,`<br>
`    'deviceVersion': <device version string>,`<br>
`    'sn': <device serial number>,` <br>
`    'gphoto2Config': {stringified JSON object representation from node-gphoto2}`<br>
`}`

## Experiment Config
This defines the experimental config.  The user will typically upload a CSV file with minimum of following
fields at start: `<row>, <col>, <file_prefix>`.

`ExperimentConfig`<br>
`{  'version': <version>,`<br>
`   'datetime': <boolean - apply datetime suffix to files as they are created>`<br>
`   'rename': <boolean - rename files from default camera convention>`<br>
`   'imageMeta': <boolean - embed metadata in image file, if supported.`<br>
`   'filenameFields': [<metadata field 0>, <metadata field 1>, ...]`<br>
`   'config': [<plate 0 coordinates>, <plate 1 coordinates>, ...>]`<br>
`}`

## Storage Config
This will define the storage configuration for where to place downloaded camera image files.  Login credentials and parameters of accessing/using cloud data services, where required,
will be embedded in a JSON-stringified field.  Current support is for local storage only, but eventually cloud services
such as Cyverse, Box.com, dropbox.com, google drive, rsync, etc. will be supported.  
NOTE: Multiple storage configurations can be specified, as a user may want to sync their images to multiple locations
(local, cyverse, and more).

`StorageConfig`<br>
`    version: <version>`<br>
`    type: <storage type identifier>`<br>
`    params: <stringified JSON representation of parameters>`<br>
`}`

## Route Config
This defines the camera route configuration parameters.

`RouteConfig`<br>
`{   'version': <version>,`<br>
`    'interplatedelay': <integer delay in seconds between capturing images>,`<br>
`    'loopdelay': <integer delay in seconds between capturing next round of images>`<br>
`    'previewHooks': [list of hook scripts to execute before image is captured],`<br>
`    'captureHooks': [list of hook scripts to execute after image is capture]`<br>
`    'stepsPerCmX': <number of steps per centimeter in X axis for motors>,`<br>
`    'stepsPerCmY': <number of steps per centimeter in Y axis for motors>,`<br>
`    'distanceX': <x distance in cm between plates>,`<br>
`    'distanceY': <y distance in cm between plates>,`<br>
`    'route': [ [x0, y0], [x1, y1], ..., [xn, yn] ] - Coordinates of route traversed -- these are 'plate' coordinates`<br>
`}`
