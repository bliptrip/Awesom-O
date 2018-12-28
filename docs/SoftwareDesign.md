# Software Design

![High Level Design](https://github.com/bliptrip/Awesom-O/blob/master/design/Awesome-O_HighDesign.png)

## Overall Design Layout
The general idea is to have two separate processes that run on the system, which communicate with each other using HTTP REST protocols and websockets.:
* Node.js Controller Module (backend/): This module directly accesses and controls the motor and camera APIs, stores/retrieves/updates project configuration data from the database, and in general is the event processing loop that executes the programmed arm movements.
    * Motor API: A reverse-engineered set of routines for controlling the motors that guide the camera position.  These are simple ASCII-type commands sent over a COM/serial port.
    * Camera API: This interface wrappers libgphoto2, but could use a custom-developed Canon-SDK python wrapper if functionality isn’t available in libgphoto2 (but Canon SDK is limited to Windows and Mac OSX).  If the javascript node-gphoto2 bindings
    are robust enough, then they will be viable interface to the camera.
* React.js Frontend (client/): This module will host the user interface frontend, using a React.js 

## Frontend
* Load/Edit/Save Project Settings
    * Custom Routes
    * Interplate Image Timers and Imaging Mode (Burst vs. Sequential)
    * Route Configuration
    * Plate Metadata (csv file?)
    * Cloud-computing configuration
    * Camera hook script functionality
    * Camera configuration (whitebalance and focus settings, etc.) - Option to load from current camera settings
* Current Camera View - A persistent image frame that shows current state of camera
* Camera Settings View
* Route View - Allows user to configure route settings and view current route in real time
    * Grid of plates:
        * Button to deselect all plates
        * Button to select all plates, in order from top left to bottom right
        * Allow user to select plate and toggle selection.  Number overlay on plate will show the order in which the plates will be scanned.
        * Will provide a method for plate to have metadata edited.
    * Two different picture loop methods::
        * Burst Mode: Take a burst of pictures right after each other, with a long sleep between bursts.
        * Sequential Mode: Take pictures with a long sleep between pictures.
    * Current Route State: Highlight where the software thinks the camera currently is, and show a current preview taken from camera.
        * Goto Home
        * Start Route
        * Pause/Resume Route
        * Stop Route

## Controller (Backend)
* Camera Access/Control Primitives
    * Implemented using the Node.js node-gphoto2 bindings library for libgphoto2. 
    * Exported Functionality
        * detect cameras
        * select camera
        * capture
        * preview
        * change whitebalance
        * change iso
        * change F-stop/F#
        * change aperture
        * change exposure
        * change JPEG vs. RAW
        * change focus
* Motor Control Primitives
    * Use a custom serial port wrapper to controller motor x-y movements.
    * Exported Functionality:
        * Move arm home
        * Move arm home-x
        * Move arm home-y
        * Move arm left/right <n> plates
        * Move arm up/down <n> plates
        * Move arm arbitrary number of steps right/left/up/down
        * Set motor steps/cm.
        * Set number of x-steps per plate (distance b/w plates x)
        * Set number of y-steps per plate (distance b/w plates y)
    * The DB interface will provide a way of accessing/retrieving project settings (programmable track info, camera settings for project, captured image paths, etc.) and accessing/retrieving captured images.
    * Have a timer submodule/thread that upon timer interrupts will launch next set of instructions to control motor arm and camera API.
* DB - Database access for retrieving/saving project settings, most likely through a MongoDB interface
* Route - Submodule that processes router timeouts to drive motor movements and camera capture events, along with calling custom user hooks to process images.  Will at a primitive level process an instruction program encoded in csv/text file that guides arm, waits for timeouts, takes pictures, and executes hook callbacks.
    * NOTE: Hook callbacks are installed as extensions on the local system (not configurable from the web browser, for security reason), and provide standard functionality such as:
        * call motor controller primitives (to recenter plates) based on images not being centered
        * rename image file based on QR code and mapping file
        * upload files to a remote cloud server if desired
        * Consider that, like Express.js’s chaining of multiple middleware functions to a route request/response cycle, I could allow multiple registrations of hook functions to a given preview or capture sequence — Need to think about what the interface for doing this is: How will I register a sequence of hook functions with a given capture/preview function?  Each hook function would, like an Express.js middleware function, have a next() function that is called to call the next stage of the hook processing pipeline.
* Cloud - Submodule to handle cloud account parameters for uploading images to remote storage.

## Intermodule Communication (HTTP and websockets)
* WebSocket is a computer communications protocol, providing full-duplex communication channels over a single TCP connection.
* Functionality: All the features exported by the Camera and Motor APIs, plus 
    * open-communication for maintaining live views of current camera preview state
    * load route
    * start/resume route
    * pause route
    * abort route
* Protocol Format: JSON-format

## DB Module
* The database (DB) submodule module will store project configuration information.
* Implementation: I like the idea of using a MongoDB-type database format (JSON-encoding) to store DB structures.
* DB Contents:
    * project structure - Stores the project configuration
        * camera and it's configuration
            * camera model/name and port?
            * image settings - ISO, F#, aperture, whitebalance 
            * focus settings (this may not work — may need to have user fine-tune this each time)
            * image format - JPEG, raw?
        * petri plate metadata
            * map QR-code associated with a petri plate to experimental information, such as:
                * row, column, image filename prefix, and other experimental fields
        * Filesystem Local Images location
        * Location of hook scripts to execute
        * Cloud computing module location
        * Route configuration
            * mode (burst or sequential)
            * interplate timeout (seconds)
            * interloop timeout (minutes)
            * preview hooks, in order of execution (includes option for picture delay)
            * capture hooks, in order of execution
            * A list of location coordinates to move camera to
            * Number of execution loops (0 for infinite)
