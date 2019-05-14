var EventEmitter = require('events').EventEmitter;
var AuthenticationClient = require('auth0').AuthenticationClient;
var jwt = require('jsonwebtoken');
var schema = require('./schema');
var util = require('util');


function PasswordClient(domain) {
  EventEmitter.call(this);
  this._domain = domain;
  this._realm = 'Username-Password-Authentication';
}

util.inherits(PasswordClient, EventEmitter);

PasswordClient.prototype.connect = function(connectListener) {
  if (connectListener) { this.once('connect', connectListener); }
  
  var self = this;
  this._creds.get('https://' + this._domain, function(err, cred) {
    // TODO: error handling
    
    self._client = new AuthenticationClient({
      domain: self._domain,
      clientId: cred.username,
      clientSecret: cred.password
      //token: token
    });
    
    self.emit('connect');
  });
}

PasswordClient.prototype.verify = function(username, password, cb) {
  console.log('VERIFY');
  console.log(username);
  console.log(password);
  
  this._client.passwordGrant({ username: username, password: password, realm: this._realm }, function(err, body) {
    
    // NOTE: The auth0 SDK already validated the id_token, so we just parse it here.
    var claims = jwt.decode(body.id_token, { json: true });
    return cb(null, schema.fromUser(claims));
    
    //return cb(null, { id: 'FIXME' });
    
    // Returns an access_token and id_token
  });
}

module.exports = PasswordClient;
