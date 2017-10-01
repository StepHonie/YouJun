var express = require('express');
var router = express.Router();
var summary = require('../controllers/summary');

/* GET home page. */
router.get('/', summary.index);


module.exports = router;
