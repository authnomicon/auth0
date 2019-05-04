var filterObj = require('filter-obj');
var mapObj = require('map-obj');

var USER_FROM = {
  'sub': [ 'id' ],
  'name': [ 'displayName' ]
}

function from(obj, schema) {
  var o = filterObj(obj, Object.keys(schema));
  return mapObj(o, function(k, v) {
    var map = schema[k];
    if (!map) { return [ k, v ]; }
    return [ map[0], map[1] ? map[1](v) : v ];
  });
}



exports.fromUser = function(user) {
  return from(user, USER_FROM);
};
