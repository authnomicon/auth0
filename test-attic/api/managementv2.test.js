var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/api/managementv2');
var auth0 = require('auth0');


describe('api/managementv2', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([
      'http://schemas.modulate.io/js/vnd/auth0/management/v2',
      'http://i.bixbyjs.org/IService'
    ]);
    expect(factory['@name']).to.equal('auth0-management-v2');
  });
  
  describe('API', function() {
    var _keyring = { get: function(){} };
    var ManagementClientStub = sinon.stub().returns(sinon.createStubInstance(auth0.ManagementClient));
    var api = $require('../../app/api/managementv2',
      { 'auth0': { ManagementClient: ManagementClientStub } }
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
          expect(ManagementClientStub).to.have.been.calledOnceWithExactly({
            domain: 'example.auth0.com',
            clientId: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX',
            clientSecret: 'keyboard cat',
          }).and.calledWithNew;
          expect(client).to.be.an.instanceof(auth0.ManagementClient);
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
  
}); // api/managementv2
