const express = require('express');
const router = express.Router();
const util = require('util');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.post('/send', function (req, res) {
    console.log(req.body.obj);
    let obj = JSON.parse(req.body.obj);

    res.send(req.body);
});

module.exports = router;
