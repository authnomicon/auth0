var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/credentials/password/oauthro');
var Client = require('../../../lib/authentication/legacy/roclient');
var AuthenticationClient = require('auth0').AuthenticationClient;
var fs = require('fs');


describe('credentials/password/oauthro', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/IService', 'http://i.authnomicon.org/js/cs/IPasswordService' ]);
    expect(factory['@name']).to.equal('auth0-oauth2-ro');
  });
  
  describe('API', function() {
    var _auth0 = { createConnection: function(){} };
    var ClientSpy = sinon.spy(Client);
    var api = $require('../../../app/credentials/password/oauthro',
      { '../../../lib/authentication/legacy/roclient': ClientSpy }
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
  
  describe('OAuthROClient', function() {
    var _client = sinon.createStubInstance(AuthenticationClient);
    
    
    /*
    describe('#connect', function() {
      
      it('should get credential and construct client', function(done) {
        var client = new Client('hansonhq.auth0.com');
        //client._creds = new StubCredentialStore();
        sinon.stub(client._creds, 'get').yieldsAsync(null, { username: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX', password: 'keyboard cat' });
        
        client.connect(function() {
          expect(client._creds.get).to.have.been.calledOnceWith('hansonhq.auth0.com');
          
          expect(ClientStub).to.have.been.calledOnceWithExactly({
            domain: 'hansonhq.auth0.com',
            clientId: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX',
            clientSecret: 'keyboard cat'
          }).and.calledWithNew;
          
          done();
        });
      }); // should get credential and construct client
      
    }); // #connect
    */
    
    describe('#verify', function() {
      var client = new Client(_client);
      
      it('should verify correct credentials', function(done) {
        _client.oauth = {};
        _client.oauth.signIn = sinon.stub().yieldsAsync(null, JSON.parse(fs.readFileSync('test/data/oauth/ro/output.json', 'utf8')));
        
        
        client.verify('steve@example.com', 'p455w0rd', function(err, user) {
          expect(_client.oauth.signIn).to.have.been.calledWith({
            username: 'steve@example.com',
            password: 'p455w0rd',
            connection: 'Username-Password-Authentication'
          });
          
          expect(err).to.be.null;
          expect(user).to.deep.equal({
            id: 'auth0|5b6ce4a9e54355613fd4627c'
          });
          done();
        });
      }); // should verify correct credentials
      
    }); // #verify
    
  }); // OAuthROClient
  
}); // credentials/password/oauthro
