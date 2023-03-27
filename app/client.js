var ManagementClient = require('auth0').ManagementClient;

exports = module.exports = function() {
  var client = new ManagementClient({
    domain: process.env['AUTH0_DOMAIN'],
    token: process.env['AUTH0_TOKEN']
  });
  return client;
};

exports['@singleton'] = true;
exports['@implements'] = 'module:auth0.ManagementClient';
exports['@require'] = [];
