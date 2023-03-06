exports = module.exports = function(keyring) {
  var ManagementClient = require('auth0').ManagementClient;
  
  
  var api = {};
  
  // https://auth0.com/docs/api/info
  // https://auth0.com/docs/api/management/v2
  
  api.createConnection = function(options, __connectListener) {
    var domain = options.name;
    
    return new Promise(function(resolve, reject) {
      
      keyring.get(domain, function(err, cred) {
        if (err) { return reject(err); }
        if (!cred) { return reject(new Error("Cannot find credentials for '" + domain + "'")); }
        
        var client = new ManagementClient({
          domain: domain,
          clientId: cred.username,
          clientSecret: cred.password
          //token: process.env['AUTH0_TOKEN']
        });
        resolve(client);
      });
      
    }); // new Promise
  };
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://schemas.modulate.io/js/vnd/auth0/management/v2',
  'http://i.bixbyjs.org/IService'
];
exports['@name'] = 'auth0-management-v2';
exports['@require'] = [
  'http://i.bixbyjs.org/security/CredentialsStore'
];
