exports = module.exports = function(auth0) {
  var Client = require('../lib/management/v2/directoryclient');
  
  
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
exports['@implements'] = [ 'http://i.bixbyjs.org/IService', 'http://i.authnomicon.org/js/ds/IDirectoryService' ];
exports['@name'] = 'auth0-users-management-v2';
exports['@require'] = [
  'http://schemas.modulate.io/js/vnd/auth0/management/v2'
];
