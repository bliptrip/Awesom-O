# Awesom-O
A web-based application developed to take ultra-high resolution pictures of seedlings on petri plates and control a camera-mounted robotic arm.

## Features

* Open web-standards (javascript, html) interface, with remote access.
* Integration into different databases formats and cloud-based services 
    * Database Formats:
        * MongoDB
        * SQL
    * Cloud-based services:
        * Cyverse
        * Box
        * Dropbox
* Hooks to allow user-pluggable scripts for amending/changing default functionality (can easily implement these as express.js middleware functions, or better yet, python bindings)
    * occur at certain events — user registers callbacks for these events, and if registered, their hook binding is called
    * Potential events (look at gphoto2 hooks for inspiration):
        * Before arm movement
        * After arm movement, before picture (center picture, change exposure, look for QR code, etc.)
        * After picture (picture download) (post-processing — rename pictures, upload to DB, etc)
* Integration with open-source image capture libraries such as libgphoto2
* Stateful - Can save projects descriptions to reload, and can load settings from any browser (remote or local) to look at current status and halt/change settings.
