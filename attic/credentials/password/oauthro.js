exports = module.exports = function(auth0) {
  var Client = require('../../../lib/authentication/legacy/roclient');
  
  
  var api = {};
  
  api.createConnection = function(options, connectListener) {
    return auth0.createConnection(options)
      .then(function(client) {
        return new Client(client);
      });
  };
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [ 'http://i.bixbyjs.org/IService', 'http://i.authnomicon.org/js/cs/IPasswordService' ];
exports['@name'] = 'auth0-oauth2-ro';
exports['@require'] = [
  'http://schemas.modulate.io/js/vnd/auth0/authentication'
];
