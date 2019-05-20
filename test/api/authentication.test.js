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
                                   .withArgs('public.auth0.com').yieldsAsync(null)
                                   .withArgs('invalid.auth0.com').yieldsAsync(new Error('something went wrong'));
      });
      
      it('should resolve with client', function(done) {
        var promise = api.createConnection({ name: 'example.auth0.com' });
        promise.then(function(client) {
          expect(AuthenticationClientStub).to.have.been.calledOnceWithExactly({
            domain: 'example.auth0.com',
            clientId: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX',
            clientSecret: 'keyboard cat',
          }).and.calledWithNew;
          expect(client).to.be.an.instanceof(auth0.AuthenticationClient);
          done();
        }).catch(done);
      }); // should resolve with client
      
      it('should reject when credentials are not available', function(done) {
        var promise = api.createConnection({ name: 'public.auth0.com' });
        promise.then(function(client) {
          done(new Error('should not resolve'));
        }, function(err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal("Cannot find credentials for 'public.auth0.com'");
          done();
        }).catch(done);
      }); // should reject when credentials are not available
      
      it('should reject when failing to obtain credentials', function(done) {
        var promise = api.createConnection({ name: 'invalid.auth0.com' });
        promise.then(function(client) {
          done(new Error('should not resolve'));
        }, function(err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal('something went wrong');
          done();
        }).catch(done);
      }); // should reject when failing to obtain credentials
      
    }); // .createConnection
    
  }); // API
  
}); // api/authentication
