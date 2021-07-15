const { Buffer } = require('buffer');
const express = require('express');
const router = express.Router();

const Blueprint = require('../blueprint/blueprint');

const exampleBps = require('../config/exampleBlueprints.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { blueprints: exampleBps.blueprints });
});
router.get('/:id', function(req, res, next) {
  let bp = exampleBps.blueprints.find( b => b.url === req.params.id );
  if(bp) {
    const blueprint = Blueprint.importSenseBP(bp.data);
    const encoded = blueprint.exportBinary();
    const decoded = Blueprint.importBinary(encoded);
    res.render('blueprintView', { name: bp.name, bpString: decoded.exportSenseBP() });
  } else {
    res.render('blueprintError');
  }
});

module.exports = router;
