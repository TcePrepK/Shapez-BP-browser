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
    const user = {
      name: 'SkimnerPhi',
      avatar: 'https://cdn.discordapp.com/avatars/199729873193926656/7894fb3b82a5075ddeae0a5626c68a37.webp?size=128'
    };
    
    const stats = {
      width: 14,
      height: 6,
      belts: 60,
      buildings: 46,
      minLevel: 8
    };
    const description = 'Takes in one full belt of each color paint and outputs white paint back the same direction.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consequat tempor ipsum, a blandit libero. Ut eget vehicula sem, et maximus lectus. Proin a varius felis, eget imperdiet nisi. Morbi nec mi mi. Donec faucibus congue lectus, ac vulputate nulla tincidunt vitae. Aliquam scelerisque dui in tempor auctor. Ut finibus porta risus, non congue nulla malesuada sed. Nulla facilisi. Phasellus et sem ac sem ullamcorper imperdiet. Vestibulum varius lorem et lacus venenatis congue. Quisque venenatis egestas diam, quis suscipit mauris venenatis eget. Maecenas quis tempus mauris.'.split('\n');
    
    res.render('designView', { title: bp.name, user, bpString: bp.data, stats, description });
  } else {
    res.render('blueprintError');
  }
});

module.exports = router;
