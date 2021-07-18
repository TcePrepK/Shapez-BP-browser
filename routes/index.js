const{ Buffer } = require('buffer');
const express = require('express');
const router = express.Router();

const Blueprint = require('../blueprint/blueprint');

const exampleBps = require('../config/exampleBlueprints.json');
const{ renderBlueprint } = require('../public/javascripts/render');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { blueprints: exampleBps.blueprints });
});
router.get('/:id', function (req, res, next) {
  let bp = exampleBps.blueprints.find(b => b.url === req.params.id);
  if(bp) {
    const user = {
      name: 'SkimnerPhi',
      avatar: 'https://cdn.discordapp.com/avatars/199729873193926656/7894fb3b82a5075ddeae0a5626c68a37.webp?size=128'
    };

    const blueprint = Blueprint.importShrimpBP(bp.data);
    const description = 'Takes in one full belt of each color paint and outputs white paint back the same direction.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consequat tempor ipsum, a blandit libero. Ut eget vehicula sem, et maximus lectus. Proin a varius felis, eget imperdiet nisi. Morbi nec mi mi. Donec faucibus congue lectus, ac vulputate nulla tincidunt vitae. Aliquam scelerisque dui in tempor auctor. Ut finibus porta risus, non congue nulla malesuada sed. Nulla facilisi. Phasellus et sem ac sem ullamcorper imperdiet. Vestibulum varius lorem et lacus venenatis congue. Quisque venenatis egestas diam, quis suscipit mauris venenatis eget. Maecenas quis tempus mauris.'.split('\n');
    const tags = ['Painter', 'Buffer', 'Cutter', 'Shrimp', 'Skim', 'Some', 'More', 'Tags', 'To', 'Test', 'Overflow', 'That', "Wasn't", 'Enough', 'So', 'Here', 'Have', 'Some', 'More', 'And', 'Here', 'Have', 'Some', 'Long', 'One', 'To', 'Test', 'Width', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'];
    const bpJSON = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ultrices tempor ligula, non gravida turpis. Praesent vel interdum augue, a ultrices eros. Aenean ante lorem, feugiat faucibus magna id, viverra faucibus dolor. Duis fringilla dui et vehicula imperdiet. Fusce in vehicula est. Curabitur ullamcorper, lectus a blandit efficitur, libero ipsum pellentesque turpis, vitae mollis orci ante eget tellus. Ut auctor purus eget aliquam facilisis. Nulla auctor odio eu ipsum consectetur euismod. Suspendisse commodo odio sit amet pellentesque rutrum. Mauris porta rhoncus quam, eget venenatis purus euismod et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mi ligula, pellentesque non hendrerit in, tincidunt in eros. Curabitur quis erat in turpis imperdiet mollis. Vestibulum eget facilisis eros, in faucibus lectus. Praesent sit amet ipsum nec nulla elementum sollicitudin. Curabitur iaculis ut nisl at hendrerit. Sed eu facilisis lacus. Pellentesque nibh lectus, malesuada at tellus non, sollicitudin pulvinar massa. Aliquam vel feugiat erat. Pellentesque nec tincidunt augue, id gravida diam. Praesent consectetur arcu sapien, sed pretium sapien tempus accumsan. Suspendisse potenti. Curabitur nec cursus ante. Nulla eu erat id arcu gravida luctus sit amet ac nulla. Cras luctus sagittis justo, sed porta nunc luctus ultrices. Curabitur sed nisi sed turpis malesuada tristique. Aliquam posuere pretium urna, id egestas ligula. Morbi rutrum velit tortor, rutrum condimentum neque eleifend in. Vivamus lorem turpis, tincidunt sed elit ac, aliquam maximus lectus. Curabitur elit magna, blandit vel efficitur non, feugiat eu arcu. Vestibulum at ipsum tempor, scelerisque enim at, malesuada tellus. Vestibulum tempus diam in metus pretium, ut facilisis enim posuere. In luctus augue ac ex ultricies lacinia.';

    res.render('designView', { title: bp.name, author: bp.author, user, bpString: bp.data, bpJSON, stats: blueprint.stats, description, tags });
  } else {
    res.render('blueprintError');
  }
});

module.exports = router;
