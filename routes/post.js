var express = require('express');
var router = express.Router();
var post = require('../controllers/post');

/* GET home page. */
router.post('/', post.handler);
router.post('/getsn', post.getsn);
router.post('/updatePrice', post.updatePrice);
router.post('/maconf',post.maconf);
router.post('/updateStation',post.updateStation);

module.exports = router;
