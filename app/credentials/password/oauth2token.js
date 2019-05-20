exports = module.exports = function(auth0) {
  var Client = require('../../../lib/authentication/oauth/passwordclient');
  
  
  var api = {};
  
  api.createConnection = function(options, __connectListener) {
    return auth0.createConnection(options)
      .then(function(client) {
        return new Client(client);
      });
  };
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [ 'http://i.bixbyjs.org/IService', 'http://i.authnomicon.org/js/cs/IPasswordService' ];
exports['@name'] = 'auth0-oauth2-token-password';
exports['@require'] = [
  'http://schemas.modulate.io/js/vnd/auth0/authentication',
  'http://i.bixbyjs.org/security/CredentialsStore'
];
