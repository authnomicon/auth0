exports = module.exports = function() {
  // Load modules.
  var ManagementClient = require('auth0').ManagementClient;
  
  
  var token = process.env['AUTH0_TOKEN'];
  
  try {
  
  var client = new ManagementClient({
    //token: '{YOUR_API_V2_TOKEN}',
    token: token,
    domain: 'hansonhq.auth0.com'
  });
  
  } catch(ex) {
    console.log(ex);
  }
  
  return client;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/opt/auth0/mgmt/v2/Client';
exports['@singleton'] = true;
exports['@require'] = [];
