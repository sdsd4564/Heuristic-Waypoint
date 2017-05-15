const express = require('express');
const router = express.Router();
const util = require('util');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.post('/send', function (req, res) {
    console.log(JSON.stringify(req.body, null, 4));
    res.send(req.body);
});

module.exports = router;
