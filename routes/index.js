const express = require('express');
const router = express.Router();
const kruskal = require('node-kruskal');
const pQueue = require('fastpriorityqueue');
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

router.post('/results', function (req, res) {
    let coord = JSON.parse(req.body.obj);
    let startCity = 0;
    let numOfCities = coord.length;
    let path = [];
    let visited = [];
    for (let i = 0; i < numOfCities; i++) visited[i] = 0;
    let cost = [];
    for (let i = 0; i < numOfCities; i++) {
        cost[i] = [];
        for (let j = 0; j < numOfCities; j++)
            cost[i][j] = i === j ? 0 : i < j ? getDistance(coord[i], coord[j]) : getDistance(coord[j], coord[i]);
    }
    let openList = new pQueue(function (a, b) {
        return a.cost > b.cost;
    });

    let numOfVisited = 1;
    let currentCity = startCity;
    visited[currentCity] = numOfVisited++;
    while (numOfVisited <= numOfCities) {
        for (let i = 0; i < numOfCities; i++) {
            if (i !== currentCity && visited[i] === 0) {
                tempEvaluateFuntion(cost, visited, numOfCities, function (result) {
                    openList.add(new SearchNode(i, (result + cost[currentCity][i])));
                })
            }
        }
        currentCity = openList.poll().cityId;
        visited[currentCity] = numOfVisited++;
    }

    for (let i = 1; i <= visited.length; i++)
        for (let j = 0; j < visited.length; j++)
            if (visited[j] === i)
                path[i - 1] = j + 1;

    let costIncurred = 0;
    for (let i = 0; i < visited.length - 1; i++)
        costIncurred += cost[path[i] - 1][path[i + 1] - 1];

    res.render('results', {
        path: path,
        location: coord
    });
});

function SearchNode(cityId, cost) {
    this.cityId = cityId;
    this.cost = cost;
}

function tempEvaluateFuntion(cost, visited, numOfCities, callback) {
    let q = new pQueue(function (a, b) {
        return a.cost > b.cost
    });
    let tree = [];
    async.waterfall([
        function (callback) {
            for (let i = 0; i < numOfCities; i++)
                for (let j = i + 1; j < numOfCities; j++)
                    if (visited[i] === 0 && visited[j] === 0) {
                        q.add({
                            fromNode: i,
                            toNode: j,
                            cost: cost[i][j]
                        });
                    }


            for (let i = 0, tempNum = numOfCities; i < tempNum; i++)
                if (visited[i] > 0) numOfCities--;

            callback(null, numOfCities);
        },
        function (numOfCities, callback) {
            let tempEdge;
            let i = 0;
            while ((tempEdge = q.poll()) !== null && i < numOfCities - 1) {
                isCycle(tempEdge, tree, function (isCycled) {
                    if (!isCycled) {
                        tree.push(tempEdge);
                        i++;
                    }
                });
                if (i === numOfCities - 1) {
                    callback(null);
                }
            }
        },
        function (callback) {
            let totalCost = 0;
            tree.forEach((tempEdge) => {
                totalCost += tempEdge.cost;
            });
            callback(null, totalCost);
        }
    ], function (err, result) {
        callback(result);
    });

}
function isCycle(newEdge, tree, callback) {
    let node1Match, node2Match;
    node1Match = node2Match = false;
    tree.forEach((tempEdge) => {
        node1Match = !node1Match && (newEdge.fromNode === tempEdge.fromNode || newEdge.fromNode === tempEdge.toNode);
        node2Match = !node2Match && (newEdge.toNode === tempEdge.fromNode || newEdge.toNode === tempEdge.toNode);
    });
    callback(node1Match && node2Match);
}

function getDistance(current, target) {
    return Math.sqrt(Math.pow((current.lat - target.lat) * 92000, 2) + Math.pow((current.lng - target.lng) * 114000, 2));
}

module.exports = router;