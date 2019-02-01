const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use('/db', require('./db'));
router.use('/camera', require('./camera'));
router.use('/controller', require('./controller'));

module.exports = router;
