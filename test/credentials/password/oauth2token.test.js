var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/credentials/password/oauth2token');
var Client = require('../../../lib/authentication/oauth/passwordclient');
var AuthenticationClient = require('auth0').AuthenticationClient;
var fs = require('fs');
var StubCredentialStore = require('../../stubs/credentialstore');


describe('credentials/password/oauth2token', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/IService', 'http://i.authnomicon.org/js/cs/IPasswordService' ]);
    expect(factory['@name']).to.equal('auth0-oauth2-token-password');
  });
  
  describe('API', function() {
    var _auth0 = { createConnection: function(){} };
    var ClientSpy = sinon.spy(Client);
    var api = $require('../../../app/credentials/password/oauth2token',
      { '../../../lib/authentication/oauth/passwordclient': ClientSpy }
    )(_auth0);
    
    
    describe('.createConnection', function() {
      beforeEach(function() {
        sinon.stub(_auth0, 'createConnection').resolves(sinon.createStubInstance(AuthenticationClient));
      });
      
      afterEach(function() {
        ClientSpy.resetHistory();
      });
      
      it('should resolve with client', function(done) {
        var promise = api.createConnection({ name: 'example.auth0.com' });
        promise.then(function(client) {
          expect(_auth0.createConnection).to.have.been.calledOnceWithExactly({ name: 'example.auth0.com' });
          expect(ClientSpy).to.have.been.calledOnce.and.calledWithNew;
          expect(ClientSpy.getCall(0).args[0]).to.be.an.instanceof(AuthenticationClient);
          expect(client).to.be.an.instanceof(Client);
          done();
        }).catch(done);
      }); // should resolve with client
      
    }); // .createConnection
    
  }); // API
  
  describe('PasswordClient', function() {
    var _client = sinon.createStubInstance(AuthenticationClient);
    
    describe('#verify', function() {
      var client = new Client(_client);
      
      it('should verify correct credentials', function(done) {
        _client.oauth = {};
        _client.oauth.passwordGrant = sinon.stub().yieldsAsync(null, JSON.parse(fs.readFileSync('test/data/oauth/token/output.json', 'utf8')));
        
        
        client.verify('steve@example.com', 'p455w0rd', function(err, user) {
          expect(_client.oauth.passwordGrant).to.have.been.calledWith({
            username: 'steve@example.com',
            password: 'p455w0rd',
            realm: 'Username-Password-Authentication'
          });
          
          expect(err).to.be.null;
          expect(user).to.deep.equal({
            id: 'auth0|5b6ce4a9e54355613fd4627c',
            displayName: 'steve@example.com'
          });
          done();
        });
      }); // should verify correct credentials
      
    }); // #verify
    
  }); // PasswordClient
  
}); // credentials/password/oauth2token
