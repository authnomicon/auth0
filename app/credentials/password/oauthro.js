exports = module.exports = function() {
  var Client = require('../../../lib/authentication/legacy/roclient');
  
  
  var api = {};
  
  // TODO: add inferType from URL method
  
  api.createConnection = function(options) {
    return new Client(options.url);
  }
  
  return api;
};

exports['@implements'] = 'http://schemas.authnomicon.org/sd/IService';
exports['@type'] = 'auth0-oauth-ro';
