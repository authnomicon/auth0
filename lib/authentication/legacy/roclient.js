var EventEmitter = require('events').EventEmitter;
var AuthenticationClient = require('auth0').AuthenticationClient;
var jwt = require('jsonwebtoken');
var schema = require('../oauth/schema');
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
  this._client.oauth.signIn({ username: username, password: password, connection: this._realm }, function(err, body) {
    if (err) { return cb(err); }
    
    // NOTE: The auth0 SDK already validated the id_token, so we just parse it here.
    var claims = jwt.decode(body.id_token, { json: true });
    return cb(null, schema.fromUser(claims));
  });
}

module.exports = ROPasswordClient;
