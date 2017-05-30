const express = require('express');
const router = express.Router();
const kruskal = require('node-kruskal');
const async = require('async');

const googleMapClient = require('@google/maps').createClient({
    key: 'AIzaSyAVwr9AQxyGR45e7CdtsRnQAeSU1oRibOM'
});

let queryLimit = 0;
let checkedTime;

router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.post('/checkQueryLimit', function (req, res) {
    const currentTime = new Date();
    if (!checkedTime)
        checkedTime = new Date();

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
    let coord = JSON.parse(req.body.obj);
    let coordClone = coord.slice();
    let open = [];
    let close = [];
    const startCity = new Node(coord[0].lat, coord[0].lng, null, 0);
    open.unshift(startCity);

    while (open.length !== 0) {
        open.sort(function (o1, o2) {
            return o1.evalFunction < o2.evalFunction ? -1 : o1.evalFunction > o2.evalFunction ? 1 : 0;
        });

        let current = open[0];
        open.splice(0, 1);

        close.push(current);

        if (coordClone.length !== 0) {
            coordClone.some((obj) => {
                if (obj.lat === current.lat && obj.lng === current.lng) {
                    coordClone.splice(obj, 1);
                    return true;
                }
            });
        } else {
            console.log(close.length);
            res.send(close);
            break;
        }

        let tempNode = current;
        let currentDistanceToThe = 0;
        while (tempNode.parentNode !== null) {
            currentDistanceToThe += getDistance(tempNode, tempNode.parentNode);
            tempNode = tempNode.parentNode;
        }


        coordClone.forEach((obj) => {
            evaluateFunction(close, obj, function (result) {
                tempNode = new Node(obj.lat, obj.lng, current, result[1] + currentDistanceToThe);
            });
            for (let i = 0; i < open.length; i++) {
                if (open[i].lat === tempNode.lat && open[i].lng === tempNode.lng && open[i].evalFunction >= tempNode.evalFunction) {
                    open.splice(i, 1);
                }
            }
            open.push(tempNode);
        })
    }
});

function Node(lat, lng, parentNode, evalFunction) {
    this.lat = lat;
    this.lng = lng;
    this.parentNode = parentNode;
    this.evalFunction = evalFunction;
}

function evaluateFunction(close, obj, callback) {
    let minimumCost = 0;
    let arr = [];
    async.series([
            function (callback) {
                let closeArr = close.slice();
                closeArr.push(obj);
                for (let i = 0; i < closeArr.length; i++) {
                    arr[i] = [];
                    for (let j = 0; j < closeArr.length; j++) {
                        arr[i][j] = i === j ? 0 : i < j ? getDistance(closeArr[i], closeArr[j]) : getDistance(closeArr[j], closeArr[i]);
                    }
                }
                let fromStart = getDistance(closeArr[0], obj);
                let fromCurrent = getDistance(closeArr[closeArr.length - 2], closeArr[closeArr.length - 1]);
                minimumCost = fromCurrent + fromStart;
                callback(null, arr);
            },
            function (callback) {
                kruskal.kruskalMST(arr, function (result) {
                    minimumCost += result.mst;
                });
                callback(null, minimumCost);
            }
        ],
        function (err, result) {
            callback(result);
        })

}

function getDistance(current, target) {
    return Math.sqrt(Math.pow((current.lat - target.lat) * 92000, 2) + Math.pow((current.lng - target.lng) * 114000, 2));
}

module.exports = router;