# UI Design and Functionality

## Component Hierarchy
![Main Interface](https://github.com/bliptrip/Awesom-O/blob/master/design/Awesom-O_UI_Main.png)
* Login Window (overlay all functionality until user is authenticated)
* App Toolbar
    * User Settings Dropdown Menu
        * Logout - Allows user to logout
        * Profile Settings - Allows user to change email/password/id
    * Load Project Button - Load a previous project
    * Save Project Button - Save a previous project
    * Route Control Toolbar
        * Start/Pause Button - Starts/pauses a programmed route
        * Stop - Stops a route
        * Home - Send motor armature to home position
        * Manual Control Buttons - Allow user to tweak camera armature position manually
    * Status Indicator - Green = Route running, Yellow = Route paused, Red = Route stopped/not running
* Live Camera View - Shows the current camera view - A lot of control is done through a cursor hover menu, including zoom in/out, focus change, turn view on/off, fullscreen view
* Configuration Panel
    * ![Camera Configuration](https://github.com/bliptrip/Awesom-O/blob/master/design/Awesom-O_UI_Camera.png)  - Allows user to interact with attached camera and its settings/configuration.  NOTE: Some of these settings are dynamically loaded based on camera settings available on camera.
        * Camera Settings Panel - 
            * Load Current Settings
            * Apply Settings
            * Model - Currently connected camera model
            * Serial No. - Model Serial Number
        * Image Settings - This panel includes settings such as image format, ISO, whitebalance, focus mode, aspect ratio
        * Capture Settings - This panel includes settings such as aperture, shutter speed, etc.
        * General Settings - This panel includes 
        * Camera Settings Panel - Each tab automatically loaded based on what camera supports.
            * Status Tab - Model number, etc.
            * Settings Tab - Global camera settings
            * Image Settings Tab - Image format, focus mode, aspect ratio, etc.
            * Capture Settings Tab - Aperture, shutter speed, etc.
    * ![Data Configuration](https://github.com/bliptrip/Awesom-O/blob/master/design/Awesom-O_UI_Data.png) - Allows user to specify experimental configuration, image file naming conventions and local storage, and cloud storage parameters
        * Experimental Configuration Panel
            * Upload CSV - Upload a CSV configuration file with petri dish metadata.
            * Download CSV - Download current configuration as CSV
            * Petri Dish Experimental Configuration Table - A csv-react-table (or something like that) interface for dynamic user control over experimental configuration
        * Image File Configuration Panel
            * Filesystem Path Input - The filesystem path where images (and image subfolders) will be placed
            * Append Datetime Suffix Checkbox - Append a datetime signature to each image file
            * Embed Metadata Checkbox - Whether to embed the experimental configuration metadata into the image file (using EXIF tags or something like that)
            * Rename File Checkbox - Whether to rename image files based on experimental configuration metadata (defaults to IMG-<ROW>-<COL>-<index> format).
            * Experimental Fields Selection Panel - Contains a row of fieldnames in metadata and checkboxes to allow user to choose which fieldnames to include in filename.  This panel should allow user to both select
            fields and drag them up/down to choose priority.
        * Cloud Configuration Panel - Cloud storage login and path parameters for specifying where data is to be stored/synced remotely.
            * Type - List of checkboxes specifying which forms of cloud storage are supported.  Right now, likely box.com, dropbox.com, and cyverse.  It would also be nice to support something like rsync to allow user to specify their own custom remote server.
            * Username - Username/Email for cloud service.
            * Password - Password (stored encrypted)
            * Path - Where in remote path to place images.
    * ![Schedule Configuration](https://github.com/bliptrip/Awesom-O/blob/master/design/Awesom-O_UI_Schedule.png) - Scheduling-related parameters
        * Loop Count - Number of times to loop through taking images.  Set to <0> to indicate infinite run until user manually exits.
        * Add Schedule Button - Add a scheduling timer to specify time to run another operation, in local time.
        * Schedule Panel - List of currently specified timers, with delete buttons to remove an entry from list.
        * Add Preview Script Button - Allows user to specify hook scripts that are called to process images, insert delays, etc. before a picture is taken.
        * Preview Hook Script Panel - List of currently specified preview hook scripts.
        * Add Capture Hook Script Button - Allows user to specify capture hook scripts to allow user to postprocess images, etc.
        * Capture Hook Script Panel - List of currently specified capture hook scripts.
    * ![Route Configuration](https://github.com/bliptrip/Awesom-O/blob/master/design/Awesom-O_UI_Route.png) - Route-parameters
        * Route Layout Canvas - Displays petri dish cell grid, allowing user to click on cell to toggle add/remove the entry from the route.  Also shows last taken picture and current camera location with yellow highlighting.
        * Route Settings Panel
            * Clear Route Button - Clears existing route settings.
            * Route configuration state change buttons
                * Clear button - Clear current route
                * Upload button - Upload a route from a text file.
                * Download button - Download current route to a text file.
        * Route configuration textbox (optional) - A textbox showing current route and allows user to manually edit
