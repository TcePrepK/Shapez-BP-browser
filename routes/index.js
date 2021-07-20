const{ Buffer } = require('buffer');
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
    const user = {
      name: 'SkimnerPhi',
      avatar: 'https://cdn.discordapp.com/avatars/199729873193926656/7894fb3b82a5075ddeae0a5626c68a37.webp?size=128'
    };

    const blueprint = Blueprint.importShrimpBP(bp.data);
    const description = 'Takes in one full belt of each color paint and outputs white paint back the same direction.'.split('\n');
    const tags = ['mixer', 'early-game', 'full-belt'];
    const bpJSON = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ultrices tempor ligula, non gravida turpis. Praesent vel interdum augue, a ultrices eros. Aenean ante lorem, feugiat faucibus magna id, viverra faucibus dolor.';

    res.render('designView', { title: bp.name, author: bp.author, user, bpString: bp.data, bpJSON, stats: blueprint.stats, description, tags });
  } else {
    res.render('blueprintError');
  }
});

module.exports = router;
