# Awesom-O
A web-based application developed to take ultra-high resolution pictures of seedlings on petri plates and control a camera-mounted robotic arm.

## Features

* Open web-standards (javascript, html), so it can be run through any web browser (on smartphone, in embedded CEF-type app, etc.)
* Integration into different databases - MongoDB, Cyverse as an option (or can leave this to user hooks - and provide standard set of hooks for integrating into DBs)
* Hooks to allow user-pluggable scripts for amending/changing default functionality (can easily implement these as Express.js middleware functions, or better yet, python bindings)
* occur at certain events — user registers callbacks for these events, and if registered, their hook binding is called
* Potential events (look at gphoto2 hooks for inspiration):
* Before arm movement
* After arm movement, before picture (center picture, change exposure, look for QR code, etc.)
* After picture (picture download) (post-processing — rename pictures, upload to DB, etc)
* Easy integration into gphoto2
* Stateful - Can save projects descriptions to reload, and can load settings from any browser (remote or local) to look at current status and halt/change settings.
