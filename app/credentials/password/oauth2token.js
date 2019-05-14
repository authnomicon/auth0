exports = module.exports = function(creds) {
  var Client = require('../../../lib/authentication/oauth/passwordclient');
  
  
  var api = {};
  
  // TODO: add inferType from URL method
  
  api.createConnection = function(options, connectListener) {
    var client = new Client(options.cname);
    client._creds = creds;
    
    client.connect(connectListener);
    return client;
  }
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.bixbyjs.org/IService';
exports['@name'] = 'auth0-oauth2-token-password';
exports['@require'] = [
  'http://i.bixbyjs.org/security/CredentialsStore'
];
