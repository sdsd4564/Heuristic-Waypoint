var async = require('async');

function kruskalMST(darray, callback) {
	// Vars to hold the array of edges, final smt value, and the vertex tracker
	var edgeArray = [],
		trees = []
		smt = 0,
		row = -1;

	// Comparative function to sort the edges
	function compare(a,b){
		if (a[2] < b[2]) return -1;
		if (a[2] > b[2]) return 1;
		return 0;
	}

	// Get all of the edges from the distance array
	async.forEachSeries(darray, function(distances, cb) {
		row += 1;
		column = -1;
		async.forEachSeries(distances, function(distance, c){
			column += 1;
			if (column > row) {
				edgeArray.push([row, column, distance]);
				c();
			} else {
				c();
			}
		}, function(err) {
			if (err) {
				console.log(err);
			}
		});
		cb();
	}, function(err) {
		if (err) {
			console.log(err);
		}
	});

	// Sort the array of edges in ascending order
	sortedEdgeArray = edgeArray.sort(compare);
	finalMSTArray = [];

	// Iterate over the sorted array
	async.forEachSeries(sortedEdgeArray, function(edge, cb) {
		if (sortedEdgeArray.indexOf(edge) == 0) {
			trees.push([edge[0],edge[1]]);
			finalMSTArray.push(edge);
			smt += edge[2];
			cb();
		} else {
			async.forEachSeries(trees, function(tree, c) {
				// Both vertices are already in the same tree
				if (tree.indexOf(edge[0]) > -1 && tree.indexOf(edge[1]) > -1 ) {
					cb();
				// First vertex is in a tree but second one not
				} else if (tree.indexOf(edge[0]) > -1 && tree.indexOf(edge[1]) == -1) {
					// loop through the trees and see if edge[1] is in there
					// If it is there, link the two 'trees'
					// If not, 
					async.forEachSeries(trees, function(otherTree, b) {
						if (otherTree.indexOf(edge[1]) > -1) {
							tree.push.apply(tree, otherTree);
							trees.splice(trees.indexOf(otherTree),1);
							finalMSTArray.push(edge);
							smt += edge[2];
							cb();
						} else {
							b();
						}
					}, function(err) {
						if (err) {
							console.log(err);
						}
						tree.push(edge[1]);
						finalMSTArray.push(edge);
						smt += edge[2];
						cb();
					});
				} else if (tree.indexOf(edge[1]) > -1 && tree.indexOf(edge[0]) == -1) {
					// loop through the trees and see if edge[1] is in there
					// If it is there, link the two 'trees'
					// If not, 
					async.forEachSeries(trees, function(otherTree, b) {
						if (otherTree.indexOf(edge[0]) > -1) {
							tree.push.apply(tree, otherTree);
							trees.splice(trees.indexOf(otherTree),1)
							finalMSTArray.push(edge);
							smt += edge[2];
							cb();
						} else {
							b();
						}
					}, function(err) {
						if (err) {
							console.log(err);
						}
						tree.push(edge[0]);
						finalMSTArray.push(edge);
						smt += edge[2];
						cb();
					});
				} else {
					c();
				}
			}, function(err) {
				if (err) {
					console.log(err);
				}
				trees.push([edge[0],edge[1]]);
				finalMSTArray.push(edge);
				smt += edge[2];
				cb();
			});
		}
	}, function(err) {
		if (err) {
			console.log(err);
		}
	});

	mstData = {
				"mst": smt,
				"mstArray": finalMSTArray
				}

	callback(mstData);
}

exports.kruskalMST = kruskalMST;