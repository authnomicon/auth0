var jwt = require('jsonwebtoken');
var schema = require('../oauth/schema');


// Needs: http://auth0.com/oauth/legacy/grant-type/ro grant type enabled
// OIDC conformant clients cannot use /oauth/ro, needs OIDC conformant disabled

function ROPasswordClient(client) {
  this._client = client;
  this._connection = 'Username-Password-Authentication';
}

ROPasswordClient.prototype.verify = function(username, password, cb) {
  this._client.oauth.signIn({ username: username, password: password, connection: this._connection }, function(err, body) {
    if (err) { return cb(err); }
    
    // NOTE: The auth0 SDK already validated the id_token, so we just parse it here.
    var claims = jwt.decode(body.id_token, { json: true });
    return cb(null, schema.fromUser(claims));
  });
};

module.exports = ROPasswordClient;
