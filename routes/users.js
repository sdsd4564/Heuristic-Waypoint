const express = require('express');
const router = express.Router();
const us = require('underscore');

/* GET users listing. */
router.get('/user', function(req, res, next) {
    res.send("user");
});

module.exports = router;
