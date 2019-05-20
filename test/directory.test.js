var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/directory');
var Client = require('../lib/management/v2/directoryclient');
var ManagementClient = require('auth0').ManagementClient;
var fs = require('fs');


describe('directory', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/IService', 'http://i.authnomicon.org/js/ds/IDirectoryService' ]);
    expect(factory['@name']).to.equal('auth0-users-management-v2');
  });
  
  describe('API', function() {
    var _auth0 = { createConnection: function(){} };
    var ClientSpy = sinon.spy(Client);
    var api = $require('../app/directory',
      { '../lib/management/v2/directoryclient': ClientSpy }
    )(_auth0);
    
    describe('.createConnection', function() {
      beforeEach(function() {
        sinon.stub(_auth0, 'createConnection').resolves(sinon.createStubInstance(ManagementClient));
      });
      
      afterEach(function() {
        ClientSpy.resetHistory();
      });
      
      it('should resolve with client', function(done) {
        var promise = api.createConnection({ name: 'example.auth0.com' });
        promise.then(function(client) {
          expect(_auth0.createConnection).to.have.been.calledOnceWithExactly({ name: 'example.auth0.com' });
          expect(ClientSpy).to.have.been.calledOnce.and.calledWithNew;
          expect(ClientSpy.getCall(0).args[0]).to.be.an.instanceof(ManagementClient);
          expect(client).to.be.an.instanceof(Client);
          done();
        }).catch(done);
      }); // should resolve with client
      
    }); // .createConnection
    
  }); // API
  
  describe('DirectoryClient', function() {
    var _client = sinon.createStubInstance(ManagementClient);
    
    describe('#get', function() {
      var client = new Client(_client);
      
      it('should get user by id', function(done) {
        _client.users = {};
        _client.users.get = sinon.stub().yieldsAsync(null, JSON.parse(fs.readFileSync('test/data/users/steve.json', 'utf8')));
        
        client.get('auth0|5b6ce4a9e54355613fd4627c', function(err, user) {
          expect(_client.users.get.getCall(0).args[0]).to.deep.equal({ id: 'auth0|5b6ce4a9e54355613fd4627c' });
          
          expect(err).to.be.null;
          expect(user).to.deep.equal({
            id: 'auth0|5b6ce4a9e54355613fd4627c',
            emails: [
              { value: 'steve@example.com' }
            ]
          });
          done();
        });
        
      }); // should get user by id
      
    }); // #get
    
  }); // DirectoryClient
  
});
