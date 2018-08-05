const keystone = require('keystone');
const importRoutes = keystone.importer(__dirname);

keystone.init({
  'name': 'rscue',
  'cookie secret': 'rscue',
  'port': 8085,
  'mongo': 'mongodb://localhost:27017/rscue'
});

keystone.import('models');

keystone.set('routes', require('./routes'));
keystone.set('cors allow origin', true);
keystone.set('cors allow methods', true);
keystone.set('cors allow headers', true);

keystone.start();