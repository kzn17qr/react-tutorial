var fs = require('fs');
var express = require('express');
var router = express.Router();
var store = 'db/comments.json';

/* GET comments listing. */
router.get('/', function(req, res, next) {
  fs.readFile(store, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

/* POST comment creating */
router.post('/', function(req, res) {
  fs.readFile(store, function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile(store, JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(comments);
    });
  });
});

module.exports = router;

