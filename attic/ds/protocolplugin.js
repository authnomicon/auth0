exports = module.exports = function() {
  var uri = require('url')
    , ManagementV2UsersDirectory = require('../../lib/directory/mgmt/v2/users');
  
  
  return {
    createConnection: function(options) {
      if (typeof options == 'string') {
        options = { url: options };
      }
      
      console.log('CREATE AUTH0?');
      
      
      var url = uri.parse(options.url);
      console.log(url)
      
      if (url.protocol !== 'https:') { return; }
      
      var subdomains = url.hostname.split('.')
      
      console.log(subdomains)
      
      if (subdomains[subdomains.length - 2] !== 'auth0' && subdomains[subdomains.length - 1] !== 'com') { return; }
      
      //var token = process.env['AUTH0_TOKEN'];
      
      var opts = { domain: url.hostname };
      //opts.token = process.env['AUTH0_TOKEN'];
      opts.clientId = process.env['AUTH0_MANAGEMENT_CLIENT_ID'];
      opts.clientSecret = process.env['AUTH0_MANAGEMENT_CLIENT_SECRET'];
      //opts.clientId = process.env['AUTH0_GLOBAL_CLIENT_ID'];
      //opts.clientSecret = process.env['AUTH0_GLOBAL_CLIENT_SECRET'];
      opts.scope = 'read:users create:users update:users';
      
      return new ManagementV2UsersDirectory(opts);
    },
    
    getName: function(options) {
      return 'TODO';
    }
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/ds/ProtocolPlugIn';
exports['@protocol'] = 'https://auth0.com';
exports['@require'] = [];
