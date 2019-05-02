const keystone = require('keystone');

keystone.init({
  'cookie secret': 'secure string goes here',
  name: 'my-project',
  'user model': 'User',
  'auto update': true,
  views: 'templates/views',
  'view engine': 'pug',
  auth: true,
});
keystone.import('models');
keystone.set('routes', require('./routes'));

keystone.start();
