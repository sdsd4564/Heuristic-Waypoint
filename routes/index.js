const express = require('express');
const router = express.Router();
const kruskal = require('node-kruskal');

// 구글 DIRECTION API 초당 사용량 50개를 피하기 위함.
let queryLimit = 0;
let checkedTime;
let coord = [];
let dist = [];


router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.post('/checkQueryLimit', function (req, res) {
    if (!checkedTime) {
        checkedTime = new Date();
    }
    const currentTime = new Date();


    if (queryLimit < 50) {
        console.log("쿼리 센딩 성공");
        queryLimit++;
        res.send({
            "isLimitedOK": true,
            "remainedTime": 0
        });
    } else if (currentTime - checkedTime > 1000) {
        console.log("쿼리 센딩 실패");
        res.send({
            "isLimitedOK": false,
            "remainedTime": currentTime - checkedTime
        });
        queryLimit = 0;
        checkedTime = null;
    }
});

router.post('/send', function (req, res) {
    coord = JSON.parse(req.body.obj);
    dist = JSON.parse(req.body.dist);
    console.log(dist);
    console.log(coord);
    res.send("성공");
});


router.get('/test', function (req, res) {
    let distArr = [];
    for (let i = 0; i < coord.length; i++) {
        distArr[i] = [];
        for (let j = 0; j < coord.length; j++)
            distArr[i][j] = i === j
                ? 0
                : i < j
                    ? dist[(j - 1) * j / 2 + i].distance
                    : dist[(i - 1) * i / 2 + j].distance;
    }

    kruskal.kruskalMST(distArr, function (result) {
        res.send(result);
    });
});


module.exports = router;

