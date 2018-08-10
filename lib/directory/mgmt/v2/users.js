var ManagementClient = require('auth0').ManagementClient;
var AuthenticationClient = require('auth0').AuthenticationClient;


function Auth0ManagementV2UsersDirectory(options) {
  this._client = new ManagementClient(options);
  this._authClient = new AuthenticationClient(options);
  this._connection = options.connection || 'Username-Password-Authentication';
}

Auth0ManagementV2UsersDirectory.prototype.add = function(user, cb) {
  console.log('ADD USER TO AUTH0!');
  console.log(user);
  
  var data = {
    connection: this._connection,
    //username: user.username,
    password: user.password,
    //email: 'steve@example.com'
    email: user.username + '@example.com'
  }
  
  this._client.users.create(data, function(err, rec) {
    console.log('CREATED!')
    console.log(err);
    console.log(rec);
    
    if (err) { return cb(err); }
    
    var entity = {};
    entity.id = rec.user_id;
    if (rec.email) {
      entity.emails = [{ value: rec.email }];
    }
    return cb(null, entity);
  });
};

Auth0ManagementV2UsersDirectory.prototype.authenticate = function(username, password, cb) {
  console.log('AUTHENTICATE!');
  
  var data = {
    username: username + '@example.com',
    password: password,
    realm: this._connection
  }
  
  var self = this;
  this._authClient.oauth.passwordGrant(data, function(err, out) {
    console.log('AUTHENTICATED!');
    console.log(err);
    console.log(out);
    
    self._authClient.users.getInfo(out.access_token, function(err, rec) {
      console.log('GOT USER!');
      console.log(err);
      console.log(rec)
      
      var entity = {};
      entity.id = rec.sub;
      if (rec.email) {
        entity.emails = [{ value: rec.email }];
      }
      return cb(null, entity);
    })
  });
};


module.exports = Auth0ManagementV2UsersDirectory;
