const express = require('express');
const router = express.Router();
const kruskal = require('node-kruskal');

// 구글 DIRECTION API 초당 사용량 50개를 피하기 위함.
let queryLimit = 0;
let checkedTime;
let coord = [];

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
    console.log(coord);
    res.send("성공");
});


router.get('/test', function (req, res) {
    let coordClone = coord;
    let open = [];
    let close = [];
    const startCity = new Node(coord[0].lat, coord[0].lng, null, 0);
    open.unshift(startCity);
    evaluateFunction(startCity, coordClone[3]);

    // while (open.length !== 0) {
    //     open.sort(function (o1, o2) {
    //         return o1.seq < o2.seq ? -1 : o1.seq > o2.seq ? 1 : 0;
    //     });
    //     let node = open.pop();
    //     close.unshift(node);
    //     let tmp = {
    //         'lat': node.lat,
    //         'lng': node.lng
    //     };
    //
    //     if (node.lat === startCity.lat && node.lng === startCity.lng && node.parentNode !== null)
    //         return;
    //     coordClone.splice(coordClone.indexOf(tmp), 1);
    //     for (let obj in coordClone) {
    //         // evaluateFunction(node, obj);
    //         open.push(new Node(obj.lat, obj.lng, node, 55));
    //     }
    // }

});

function Node(lat, lng, parentNode, evalFunction) {
    this.lat = lat;
    this.lng = lng;
    this.parentNode = parentNode;
    this.evalFunction = evalFunction;
}

function evaluateFunction() {
    let arr = [];
    for (let i = 0; i < arguments.length; i++) {
        arr[i] = [];
        for (let j = 0; j < arguments.length; j++) {
            arr[i][j] = i === j ? 0 : i < j ? getDistance(arguments[i], arguments[j]) : getDistance(arguments[j], arguments[i]);
        }
    }

    kruskal.kruskalMST(arr, function (result) {
        console.log(result);
    })
}

function getDistance(current, target) {
    return Math.sqrt(Math.pow(current.lat - target.lat, 2) + Math.pow(current.lng - target.lng, 2));
}

module.exports = router;

