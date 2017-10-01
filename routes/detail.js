var express = require('express');
var router = express.Router();
var detail = require('../controllers/detail');

/* GET home page. */
router.get('/', detail.index);


module.exports = router;
