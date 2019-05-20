var schema = require('./schema');


function DirectoryClient(client) {
  this._client = client;
}

DirectoryClient.prototype.get = function(id, cb) {
  var data = {
    id: id
  };
  
  this._client.users.get(data, function(err, user) {
    if (err) { return cb(err); }
    return cb(null, schema.fromUser(user));
  });
};

// TODO: add, modify, delete

module.exports = DirectoryClient;
