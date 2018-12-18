# Useful background links and notes.

## Interface Libraries/Frameworks
* CSS Frameworks
    * [Bootstrap](http://getbootstrap.com/) - An open source toolkit for developing with HTML, CSS, and JS - meant to be mobile-first/friendly
    * [Bulma](https://bulma.io/) - A CSS framework based on flexbox.  I like the simplicity, flexibility, and intuitiveness of this framework.  Videos are also great.
        * Getting bulma with React and fact that sass needs to be compiled can be a little tricky.  I found the following helpful: https://hackernoon.com/building-a-website-with-react-and-bulma-d655214bff2a
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces — Very intuitve features such as embedding HTML w/in JS (JSX syntax) and hierarchical wrapping of user-defined DOM tags
    * Hooks - A bleeding-edge, alpha-software feature that resolves issues in current React framework with complicated class frameworks, overly nested tags, and code reusability
        * Great intro to hooks by Dan Abramov at ReactCon 2018: https://www.youtube.com/watch?v=dpw9EHDh2bM
        * https://reactjs.org/docs/hooks-intro.html
    * JSX file conversion - JSX needs to be converted to raw javascript for the browser to properly parse and render a page: for setting up production-level jsx preprocessing, install babel and run a background process  (https://reactjs.org/docs/add-react-to-a-website.html):
        * npm install babel-cli@6 babel-preset-react-app@3
        * npx babel --watch src --out-dir . --presets react-app/prod
## Web Servers/Frameworks
* [Node.js](https://nodejs.org/en/about/) - A popular, highly efficient web server platform that uses a single-threaded, event-loop driven paradigm with OS-driven asychronous operations to increase scalability and efficiency.  Also includes an advanced packaging utility (npm) with an incredibly well-developed, community-supported package repository
* [Express.js](http://expressjs.com/) - Fast, minimalist web framework for Node.js - for server-side rendering of JavaScript
    * supports view engines for React
    * support different Node.js database wrappers/implementations (I like MongoDB as it is JSON-based)
* Methods for Having Dynamic Updates on Webpage
    * [Server-side evens in python (and Flask)](https://medium.com/code-zen/python-generator-and-html-server-sent-events-3cdf14140e56) - NOTE: This is unidirectional
    * Websockets - WebSocket is a computer communications protocol, providing full-duplex communication channels over a single TCP connection.  Provides a way to do real-time data updates in browsers (in our case, update camera capture state)
        * [Wikipedia](https://en.wikipedia.org/wiki/WebSocket)
        * [Websockets and React](https://medium.com/practo-engineering/websockets-in-react-the-component-way-368730334eef)
        * [React websocket component to simplify websocket communication](https://www.npmjs.com/package/react-websocket)
## Data Management
* [MongoDB](https://www.mongodb.com/) - DB that stored data in flexible, JSON-like documents (fields can vary from doc to doc and data structure can change over time) - Maps object in application code/distributed DB at core
* [Node.js MongoDB Driver](https://www.npmjs.com/package/mongodb) - Official MongoDB driver for Node.js
* [MongoDB description, setup, use cases](https://contextneutral.com/story/mongodb-and-nodejs-how-to-begin) - Nice brief description of MongoDB, setup and install (on Linux), and how to integrate in with Node.js
## Camera Bindings - These are alternative language wrappers to accessing libgphoto2 functionality (natively written in C).  Only one is necessary for implementation of the application.
* Python 
    * [SWIG-based libgphoto2 python wrapper](https://pypi.org/project/gphoto2/)
    * [libgphoto2 Use-case examples.  Better than documentation.](https://github.com/gphoto/libgphoto2/tree/master/examples)
* Javascript
    * [Node.js bindings to gphoto2](https://www.npmjs.com/package/gphoto2) - Supports getting/setting configuration on camera, along with taking pictures.
## Other Topics/Interesting Links
* [ECMAScript6 Overview](https://github.com/lukehoban/es6features#readme) - Newest Javascript syntax and libraries.
* Accessing python functionality from Node.js webapp (NOTE: I’ve since decided to use a websocket or socket.io-type connection to interface with the camera/motor controller module, so this isn’t necessary)
    * [Invoking python script from Node.js application](https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js) - Invoke a python script as a child process from Node.js application.  This could be an alternative to accessing the python controller module over a websockets interface.
* Flask - A python-based webapp that supports many of the features of Express.js.  _NOTE_: Currently not planning on using Flask, but links were useful in researching design.
    * [Integrate React wtih Flask](https://medium.com/@greut/react-js-with-flask-and-a-touch-of-amd-8063198b666b)
    * [Evaluation React.js and Flask](http://aviadas.com/blog/2015/08/05/evaluating-react-dot-js-and-flask/)
    * [Flask Frontend](https://realpython.com/the-ultimate-flask-front-end/)
    * [Multiprocessing and pipes in python](https://www.geeksforgeeks.org/multiprocessing-python-set-2)/ - Use multiprocessing and pipes to communicate to controller process that is launched at startup
* Tagging Image Files (metadata with user-defined information such as embedded QR-code data associated with experiment)
    * Comment tag of JPEG images (restricted to limited image formats)
    * [UserComment tag in XMP Exiftags](https://sno.phy.queensu.ca/~phil/exiftool/TagNames/XMP.html)
    * [Using exiftool to add image metadata](https://www.linux.com/news/how-add-metadata-digital-pictures-command-line) - Provides a way of embedding experimental info into image itself, to make it more robust to information loss that is possible when metadata is stored externally.
