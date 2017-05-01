/*
exports = module.exports = {
  'mgmt/v2/client': require('./mgmt/v2/client')
};
*/

exports = module.exports = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
