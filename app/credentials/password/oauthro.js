exports = module.exports = function(creds) {
  var Client = require('../../../lib/authentication/legacy/roclient');
  
  
  var api = {};
  
  // TODO: add inferType from URL method
  
  api.createConnection = function(options, connectListener) {
    var client = new Client(options.url);
    client._creds = creds;
    
    client.connect(connectListener);
    return client;
  }
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = 'http://schemas.authnomicon.org/sd/IService';
exports['@type'] = 'auth0-oauth-ro';
exports['@require'] = [
  'http://i.bixbyjs.org/security/CredentialsStore'
];
