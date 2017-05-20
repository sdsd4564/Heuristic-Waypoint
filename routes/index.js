const express = require('express');
const router = express.Router();
const util = require('util');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.post('/send', function (req, res) {
    let obj = [];
    let dist = [];
    obj = JSON.parse(req.body.obj);
    dist = JSON.parse(req.body.dist);

    res.send(req.body);
});

module.exports = router;
