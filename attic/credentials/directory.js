exports = module.exports = function(creds) {
  var Client = require('../../lib/management/v2/enrollmentsclient');
  
  
  var api = {};
  
  // TODO: add inferType from URL method
  
  api.createConnection = function(options, connectListener) {
    console.log('CREATE ENROLLMENTS CLIENT!');
    
    var client = new Client(options.url);
    client._creds = creds;
    
    client.connect(connectListener);
    return client;
  }
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.bixbyjs.org/IService';
exports['@name'] = 'auth0-enrollments';
exports['@require'] = [
  'http://i.bixbyjs.org/security/CredentialsStore'
];
