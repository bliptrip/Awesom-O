const express = require('express');
const router = express.Router();

const cammod = require('./camera').router;

router.use('/', cammod);

module.exports = router;
