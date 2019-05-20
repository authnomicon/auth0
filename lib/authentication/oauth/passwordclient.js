var jwt = require('jsonwebtoken');
var schema = require('./schema');


function PasswordClient(client) {
  this._client = client;
  this._realm = 'Username-Password-Authentication';
}

PasswordClient.prototype.verify = function(username, password, cb) {
  this._client.passwordGrant({ username: username, password: password, realm: this._realm }, function(err, body) {
    if (err) { return cb(err); }
    
    // NOTE: The auth0 SDK already validated the id_token, so we just parse it here.
    var claims = jwt.decode(body.id_token, { json: true });
    return cb(null, schema.fromUser(claims));
    
    //return cb(null, { id: 'FIXME' });
    
    // Returns an access_token and id_token
  });
}

module.exports = PasswordClient;
