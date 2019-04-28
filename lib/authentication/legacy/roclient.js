var AuthenticationClient = require('auth0').AuthenticationClient;


// Needs: http://auth0.com/oauth/legacy/grant-type/ro grant type enabled
// OIDC conformant clients cannot use /oauth/ro, needs OIDC conformant disabled

function ROPasswordClient(url) {
  console.log('CONSTRUCT AUTH0 PASSWORD CLIENT');
  
  
  var token = process.env['AUTH0_TOKEN'];
  
 
  this._client = new AuthenticationClient({
    domain: 'hansonhq.auth0.com',
    clientId: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX',
    clientSecret: process.env['AUTH0_CLIENT_SECRET']
    //token: token
  });
  
  this._realm = 'Username-Password-Authentication';
  
}

ROPasswordClient.prototype.verify = function(username, password, cb) {
  console.log('RO VERIFY');
  console.log(username);
  console.log(password);
  
  this._client.oauth.signIn({ username: username, password: password, connection: this._realm }, function(err, user) {
    console.log(err);
    console.log(user);
    
    // Returns an access_token and id_token
  });
}

module.exports = ROPasswordClient;
