const express = require('express');
const router = express.Router();

router.use('/', require('./camera'));

module.exports = router;
