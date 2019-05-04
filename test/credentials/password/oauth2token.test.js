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
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/sd/IService');
    expect(factory['@type']).to.equal('auth0-oauth2-token; grant_types="password"');
  });
  
  describe('API', function() {
    var _creds = new StubCredentialStore();
    
    var ClientSpy = sinon.spy(Client);
    var api = $require('../../../app/credentials/password/oauth2token',
      { '../../../lib/authentication/oauth/passwordclient': ClientSpy }
    )(_creds);
    
    
    describe('.createConnection', function() {
      afterEach(function() {
        ClientSpy.resetHistory();
      });
      
      it('should construct client', function() {
        sinon.stub(_creds, 'get').yieldsAsync(null, { username: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX', password: 'keyboard cat' });
        
        var client = api.createConnection({ url: 'https://example.auth0.com' });
        
        expect(ClientSpy).to.have.been.calledOnceWithExactly('https://example.auth0.com').and.calledWithNew;
        expect(client).to.be.an.instanceof(Client);
      }); // should construct client
      
      it('should construct client and invoke callback', function(done) {
        sinon.stub(_creds, 'get').yieldsAsync(null, { username: 'wvaTP5EkEjKxGyLAIzUnsnG6uhyRUTkX', password: 'keyboard cat' });
        
        var client = api.createConnection({ url: 'https://example.auth0.com' }, function() {
          done();
        });
        
        expect(ClientSpy).to.have.been.calledOnceWithExactly('https://example.auth0.com').and.calledWithNew;
        expect(client).to.be.an.instanceof(Client);
      }); // should construct client and invoke callback
      
    }); // .createConnection
    
  }); // API
  
});
