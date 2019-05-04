var EventEmitter = require('events').EventEmitter;
var AuthenticationClient = require('auth0').AuthenticationClient;
var util = require('util');


// Needs: http://auth0.com/oauth/legacy/grant-type/ro grant type enabled
// OIDC conformant clients cannot use /oauth/ro, needs OIDC conformant disabled

function ROPasswordClient(url) {
  EventEmitter.call(this);
  
  this._url = url;
  this._realm = 'Username-Password-Authentication';
}

util.inherits(ROPasswordClient, EventEmitter);

ROPasswordClient.prototype.connect = function(connectListener) {
  if (connectListener) { this.once('connect', connectListener); }
  
  var self = this;
  this._creds.get(this._url, function(err, cred) {
    // TODO: error handling
    
    self._client = new AuthenticationClient({
      domain: 'hansonhq.auth0.com',
      clientId: cred.username,
      clientSecret: cred.password
      //token: token
    });
    
    self.emit('connect');
  });
}

ROPasswordClient.prototype.verify = function(username, password, cb) {
  console.log('RO VERIFY');
  console.log(username);
  console.log(password);
  
  this._client.oauth.signIn({ username: username, password: password, connection: this._realm }, function(err, user) {
    console.log(err);
    console.log(user);
    
    return cb(null, { id: 'FIXME' });
    
    // Returns an access_token and id_token
  });
}

module.exports = ROPasswordClient;
