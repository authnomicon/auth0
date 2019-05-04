var EventEmitter = require('events').EventEmitter;
var ManagementClient = require('auth0').ManagementClient;
var util = require('util');


function DirectoryClient(url) {
  EventEmitter.call(this);
  this._url = url;
}

util.inherits(DirectoryClient, EventEmitter);

DirectoryClient.prototype.connect = function(connectListener) {
  if (connectListener) { this.once('connect', connectListener); }
  
  var self = this;
  this._creds.get(this._url, function(err, cred) {
    // TODO: error handling
    
    self._client = new ManagementClient({
      domain: 'hansonhq.auth0.com',
      clientId: cred.username,
      clientSecret: cred.password
      //token: process.env['AUTH0_TOKEN']
    });
    
    self.emit('connect');
  });
}

DirectoryClient.prototype.get = function(id, cb) {
  var data = {
    id: id
  }
  
  this._client.users.get(data, function(err, rec) {
    console.log(err);
    console.log(rec);
    
    /*
    if (err) { return cb(err); }
    
    var entity = {};
    entity.id = rec.user_id;
    if (rec.email) {
      entity.emails = [{ value: rec.email }];
    }
    return cb(null, entity);
    */
  });
};

// TODO: add, modify, delete



module.exports = DirectoryClient;
