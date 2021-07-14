var express = require('express');
var router = express.Router();

var exampleBps = require('../config/exampleBlueprints.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { blueprints: exampleBps.blueprints });
});
router.get('/:id', function(req, res, next) {
  let bp = exampleBps.blueprints.find( b => b.url === req.params.id );
  if(bp) {
    res.render('blueprintView', { name: bp.name, bpString: bp.data });
  } else {
    res.render('blueprintError');
  }
});

module.exports = router;
