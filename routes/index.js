const express = require('express');
const router = express.Router();
const util = require('util');

// 구글 DIRECTION API 초당 사용량 50개를 피하기 위함.
let queryLimit = 0;

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

router.post('/checkQueryLimit', function (req, res) {
    queryLimit++;
    if (queryLimit === 50) {
        res.send(true);
        queryLimit = 0;
    }
    else {
        res.send(false);
    }
});

module.exports = router;
