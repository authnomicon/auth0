exports = module.exports = function(keyring) {
  var AuthenticationClient = require('auth0').AuthenticationClient;
  
  
  var api = {};
  
  // https://auth0.com/docs/api/info
  // https://auth0.com/docs/api/authentication
  
  api.createConnection = function(options, __connectListener) {
    var domain = options.name;
    
    return new Promise(function(resolve, reject) {
      
      keyring.get(domain, function(err, cred) {
        if (err) { return reject(err); }
        
        var client = new AuthenticationClient({
          domain: domain,
          clientId: cred.username,
          clientSecret: cred.password
        });
        resolve(client);
      });
      
    }); // new Promise
  };
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://schemas.modulate.io/js/vnd/auth0/authentication',
  'http://i.bixbyjs.org/IService'
];
exports['@name'] = 'auth0-authentication';
exports['@require'] = [
  'http://i.bixbyjs.org/security/CredentialsStore'
];
