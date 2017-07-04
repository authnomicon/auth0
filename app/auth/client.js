// TODO: Remove this component from the package, as it is not generally useful
//       from the server-side.
exports = module.exports = function() {
  // Load modules.
  var auth0 = require('auth0-js');
  
  
  var client = new auth0.WebAuth({
    domain: 'hansonhq.auth0.com',
    clientID: '5vKrxc7JlpoBacioGvYDtnrgbjEFMKZP'
  });
  return client;
};

exports['@implements'] = 'http://schemas.modulate.io/js/opt/auth0/auth/Client';
exports['@singleton'] = true;
exports['@require'] = [];
