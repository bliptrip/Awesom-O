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
`}`

## Project Table
Defines project-specific configuration parameters.

`project`<br>
`{   'version': <version>,`<br>
`    'id': <integer identifier>,`<br>
`    'description': <description string>,`<br>
`    'camera_config': <camera_config table id>,`<br>
`    'experiment_config': <experiment_config table id>,`<br>
`    'image_path': <local FS path>,`<br>
`    'cloud_config': <cloud_config table id>,`<br>
`    'route_config': <route_config table id>`<br>
`}`

## Camera Configuration Table
Defines the camera configuration associated with project.

`camera_config`<br>
`{   'version': <version>,`<br>
`    'id': <integer identifier>,`<br>
`    'description': <description string>,`<br>
`    'manufacturer': <manufacturer string>,`<br>
`    'cameramodel': <model string>,`<br>
`    'deviceversion': <device version string>,`<br>
`    'gphoto2JSON': {JSON object representation from node-gphoto2}`<br>
`}`

## Experiment Config
This defines the experimental config.  The user will typically upload a CSV file with minimum of following
fields at start: `<row>, <col>, <file_prefix>`.

`experiment_config`<br>
`{  'version': <version>,`<br>
`   'id': <integer identifier>,`<br>
`   'config': [<rows of CSV config converted to JSON dictionary objects>]`<br>
`}`

## Cloud Config
This will define the login credentials and parameters of accessing/using cloud data services, such as Cyverse, Box.com, dropbox.com, google drive, rsync.
The details of this can be hashed out in the future.

## Route Config
This defines the camera route configuration parameters.

`route_config`<br>
`{   'version': <version>,`<br>
`    'id': <integer identifier>,`<br>
`    'mode': "burst" || "sequential",`<br>
`    'interplatedelay': <integer delay in seconds between capturing images>,`<br>
`    'loopdelay': <integer delay in seconds between capturing next round of images>`<br>
`    'preview_hooks': [list of hook scripts to execute before image is captured],`<br>
`    'capture_hooks': [list of hook scripts to execute after image is capture]`<br>
`    'stepsPerCmX': <number of steps per centimeter in X axis for motors>,`<br>
`    'stepsPerCmY': <number of steps per centimeter in Y axis for motors>,`<br>
`    'distanceX': <x distance in cm between plates>,`<br>
`    'distanceY': <y distance in cm between plates>,`<br>
`    'route': [ [x0, y0], [x1, y1], ..., [xn, yn] ] - Coordinates of route traversed`<br>
`}`



