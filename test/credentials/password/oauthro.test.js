var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/credentials/password/oauthro');
var Client = require('../../../lib/authentication/legacy/roclient');
var AuthenticationClient = require('auth0').AuthenticationClient;
var fs = require('fs');
var StubCredentialStore = require('../../stubs/credentialstore');


describe('credentials/password/oauthro', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/IService');
    expect(factory['@name']).to.equal('auth0-oauth2-ro');
  });
  
  describe('API', function() {
    var _creds = new StubCredentialStore();
    
    var ClientSpy = sinon.spy(Client);
    var api = $require('../../../app/credentials/password/oauthro',
      { '../../../lib/authentication/legacy/roclient': ClientSpy }
    )(_creds);
    
    
    describe('.createConnection', function() {
      afterEach(function() {
        ClientSpy.resetHistory();
      });
      
      it('should construct client', function() {
        sinon.stub(_creds, 'get').yieldsAsync(null, { username: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX', password: 'keyboard cat' });
        
        var client = api.createConnection({ cname: 'example.auth0.com' });
        
        expect(ClientSpy).to.have.been.calledOnceWithExactly('example.auth0.com').and.calledWithNew;
        expect(client).to.be.an.instanceof(Client);
      }); // should construct client
      
      it('should construct client and invoke callback', function(done) {
        sinon.stub(_creds, 'get').yieldsAsync(null, { username: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX', password: 'keyboard cat' });
        
        var client = api.createConnection({ cname: 'example.auth0.com' }, function() {
          done();
        });
        
        expect(ClientSpy).to.have.been.calledOnceWithExactly('example.auth0.com').and.calledWithNew;
        expect(client).to.be.an.instanceof(Client);
      }); // should construct client and invoke callback
      
    }); // .createConnection
    
  }); // API
  
  describe('OAuthROClient', function() {
    var _client = sinon.createStubInstance(AuthenticationClient);
    var ClientStub = sinon.stub().returns(_client);
    var Client = $require('../../../lib/authentication/legacy/roclient',
      { 'auth0': { AuthenticationClient: ClientStub } }
    );
    
    
    describe('#connect', function() {
      
      it('should get credential and construct client', function(done) {
        var client = new Client('hansonhq.auth0.com');
        client._creds = new StubCredentialStore();
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
    
    describe('#verify', function() {
      var client = new Client('hansonhq.auth0.com');
      client._creds = new StubCredentialStore();
      
      beforeEach(function(done) {
        sinon.stub(client._creds, 'get').yieldsAsync(null, { username: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX', password: 'keyboard cat' });
        client.connect(done);
      });
      
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
  
});
