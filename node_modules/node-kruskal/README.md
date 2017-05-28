node-kruskal
============

Given a distance array in the form of:

    d = [ [0,1,2,3],
          [1,0,1,2],
          [2,1,0,1],
          [3,2,1,0] ]

calculates the Minimum Spanning Tree (MST) using Kruskal's algorithm. Returns a JSON object containing the MST distance and an array of edges that make up the MST with each edge array containing:

    [row, column, weight]

Install:

    npm install node-kruskal

Usage:

    var kruskal = require('node-kruskal');

Example:

    kruskal.kruskalMST(d, function(results){
		console.log(results);
	});

Output:

    {
      mst: 3,
      mstArray: [[0,1,1],[1,2,1],[2,3,1]]
    }