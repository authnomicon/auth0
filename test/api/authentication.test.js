var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/api/authentication');
var auth0 = require('auth0');


describe('api/authentication', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([
      'http://schemas.modulate.io/js/vnd/auth0/authentication',
      'http://i.bixbyjs.org/IService'
    ]);
    expect(factory['@name']).to.equal('auth0-authentication');
  });
  
  describe('API', function() {
    var _keyring = { get: function(){} };
    //var _client = new mongodb.MongoClient();
    var AuthenticationClientStub = sinon.stub().returns(sinon.createStubInstance(auth0.AuthenticationClient));
    var api = $require('../../app/api/authentication',
      { 'auth0': { AuthenticationClient: AuthenticationClientStub } }
    )(_keyring);
    
    describe('.createConnection', function() {
      beforeEach(function() {
        sinon.stub(_keyring, 'get').withArgs('example.auth0.com').yieldsAsync(null, { username: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX', password: 'keyboard cat' })
                                   .withArgs('mongodb.example.org').yieldsAsync(null);
      });
      
      it('should resolve with client', function(done) {
        var promise = api.createConnection({ name: 'example.auth0.com' });
        promise.then(function(client) {
          console.log('RESOLVED!');
          
          expect(AuthenticationClientStub).to.have.been.calledOnceWithExactly({
            domain: 'example.auth0.com',
            clientId: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX',
            clientSecret: 'keyboard cat',
          }).and.calledWithNew;
          expect(client).to.be.an.instanceof(auth0.AuthenticationClient);
          done();
        }).catch(done);
      }); // should resolve with client
      
    }); // .createConnection
    
  }); // API
  
}); // api/authentication
