'use strict';

describe('service: blueprint factory', function() {
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranslate()));

  var SAMPLE_COMPONENTS = [
    {
      "type": "rise-image",
      "id": "rise-image-01",
      "label": "template.rise-image",
      "attributes": {
        "file": {
          "label": "template.file",
          "value": "risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/rise-image-demo/heatmap-icon.png"
        }
      }
    },
    {
      "type": "rise-data-financial",
      "id": "rise-data-financial-01",
      "label": "template.rise-data-financial",
      "attributes": {
        "financial-list": {
          "label": "template.financial-list",
          "value": "-LNuO9WH5ZEQ2PLCeHhz"
        },
        "symbols": {
          "label": "template.symbols",
          "value": "CADUSD=X|MXNUSD=X|USDEUR=X"
        }
      }
    }
  ];

  var PRODUCT_CODE = "template123";
  var blueprintFactory, httpReturn, $httpBackend;
  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      blueprintFactory = $injector.get('blueprintFactory');
    });
  });

  it('should exist',function(){
    expect(blueprintFactory).to.be.ok;
    expect(blueprintFactory.load).to.be.a('function');
    expect(blueprintFactory.isPlayUntilDone).to.be.a('function');
    expect(blueprintFactory.hasBranding).to.be.a('function');
  });

  describe('load: ', function() {

    it('should call API and return blueprintData',function(done) {
      $httpBackend.expect('GET', 'https://widgets.risevision.com/staging/templates/template123/blueprint.json').respond(200, 'blueprintData');

      blueprintFactory.load(PRODUCT_CODE)
        .then(function(resp) {
          expect(resp).to.equal('blueprintData');
          done();
        });

      $httpBackend.flush();
    });

    it('should populate factory object on load',function(done) {
      $httpBackend.expect('GET', 'https://widgets.risevision.com/staging/templates/template123/blueprint.json').respond(200, 'blueprintData');

      blueprintFactory.load(PRODUCT_CODE)
        .then(function(resp) {
          expect(blueprintFactory.blueprintData).to.equal('blueprintData');
          done();
        });

      $httpBackend.flush();
    });

    it('should reject on http error',function(done) {
      $httpBackend.expect('GET', 'https://widgets.risevision.com/staging/templates/template123/blueprint.json').respond(500, { error: 'Error' });

      blueprintFactory.load(PRODUCT_CODE)
        .then(null,function(error) {
          expect(error).to.be.ok;
          done();
        });

      $httpBackend.flush();
    });
  });

  describe('isPlayUntilDone: ', function() {

    it('should return false if blueprintData is not populated',function() {
      expect(blueprintFactory.isPlayUntilDone()).to.be.false;
    });

    it('should return true if blueprintData.playUntilDone is true',function() {
      blueprintFactory.blueprintData = {
        playUntilDone: true
      };

      expect(blueprintFactory.isPlayUntilDone()).to.be.true;
    });

    it('should return true if blueprintData.playUntilDone exists',function() {
      blueprintFactory.blueprintData = {
        playUntilDone: "something"
      };

      expect(blueprintFactory.isPlayUntilDone()).to.be.true;
    });

    it('should return false otherwise',function() {
      blueprintFactory.blueprintData = {
        playUntilDone: false
      };

      expect(blueprintFactory.isPlayUntilDone()).to.be.false;
    });
  });

  describe('hasBranding: ', function() {

    it('should return false if blueprintData is not populated',function() {
      expect(blueprintFactory.hasBranding()).to.be.false;
    });

    it('should return true if blueprintData.branding is true',function() {
      blueprintFactory.blueprintData = {
        branding: true
      };

      expect(blueprintFactory.hasBranding()).to.be.true;
    });

    it('should return false otherwise',function() {
      blueprintFactory.blueprintData = {
        branding: false
      };

      expect(blueprintFactory.hasBranding()).to.be.false;
    });
  });

  describe('getBlueprintData', function () {

    it('should get blueprint data from factory',function() {
      blueprintFactory.blueprintData = { components: [] };

      var data = blueprintFactory.getBlueprintData('rise-data-financial-01');

      expect(data).to.be.null;
    });

    it('should get null blueprint data value',function() {
      blueprintFactory.blueprintData = { components: [] };

      var data = blueprintFactory.getBlueprintData('rise-data-financial-01', 'symbols');

      expect(data).to.be.null;
    });

    it('should get blueprint data attributes',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var data = blueprintFactory.getBlueprintData('rise-data-financial-01');

      expect(data).to.deep.equal({
        "financial-list": {
          "label": "template.financial-list",
          "value": "-LNuO9WH5ZEQ2PLCeHhz"
        },
        "symbols": {
          "label": "template.symbols",
          "value": "CADUSD=X|MXNUSD=X|USDEUR=X"
        }
      });
    });

    it('should get blueprint data value',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var data = blueprintFactory.getBlueprintData('rise-data-financial-01', 'symbols');

      expect(data).to.equal('CADUSD=X|MXNUSD=X|USDEUR=X');
    });

  });

  describe('getLogoComponents',function(){

    it('should handle empty data',function(){
      blueprintFactory.blueprintData = {};

      expect(blueprintFactory.getLogoComponents()).to.deep.equal([]);

      blueprintFactory.blueprintData = { components: []};
      expect(blueprintFactory.getLogoComponents()).to.deep.equal([]);
    });

    it('should return is-logo images',function(){
      var logoComponent = { type: "rise-image", attributes: {'is-logo': {value:'true' } } };
      blueprintFactory.blueprintData = {
        components: [
          { "type": "rise-image", "id": "rise-image-01" },
          logoComponent
        ]
      };
      expect(blueprintFactory.getLogoComponents()).to.deep.equal([logoComponent]);
    });

    it('should handle no logo',function(){
      blueprintFactory.blueprintData = {
        components: [
          { "type": "rise-image", "id": "rise-image-01" },
        ]
      };
      expect(blueprintFactory.getLogoComponents()).to.deep.equal([]);
    });

    it('should handle is-logo false',function(){
      var logoComponent = { type: "rise-image", attributes: {'is-logo': {value:'false' } } };
      blueprintFactory.blueprintData = {
        components: [
          { "type": "rise-image", "id": "rise-image-01" },
        ]
      };
      expect(blueprintFactory.getLogoComponents()).to.deep.equal([]);
    });

  });

});
