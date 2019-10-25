'use strict';

describe('service: baseImageFactory', function() {

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranslate()));

  beforeEach(module(function($provide) {
    $provide.service('blueprintFactory', function() {
      return {
        getBlueprintData: sandbox.stub().returns('data')
      };
    });
    $provide.service('templateEditorFactory', function() {
      return {
        getAttributeData: sandbox.stub().returns('data'),
        setAttributeData: sandbox.stub()
      };
    });
    $provide.service('fileMetadataUtilsService', function() {
      return {
        metadataWithFileRemoved: sandbox.stub().returns(['metadataWithFileRemoved']),
        filesAttributeFor: sandbox.stub().returns('files')
      };
    });
    $provide.service('$q', function() {
      return Q;
    });
  }));

  var baseImageFactory, blueprintFactory, templateEditorFactory, fileMetadataUtilsService;
  var sandbox = sinon.sandbox.create();

  beforeEach(function() {
    inject(function($injector) {
      baseImageFactory = $injector.get('baseImageFactory');
      baseImageFactory.componentId = 'componentId';
      
      blueprintFactory = $injector.get('blueprintFactory');
      templateEditorFactory = $injector.get('templateEditorFactory');
      fileMetadataUtilsService = $injector.get('fileMetadataUtilsService');
    });
  });

  afterEach(function() {
   sandbox.restore();
  })

  it('should initialize', function () {
    expect(baseImageFactory).to.be.ok;
    expect(baseImageFactory.getImagesAsMetadata).to.be.a('function');
    expect(baseImageFactory.getDuration).to.be.a('function');
    expect(baseImageFactory.setDuration).to.be.a('function');
    expect(baseImageFactory.getBlueprintData).to.be.a('function');
    expect(baseImageFactory.areChecksCompleted).to.be.a('function');
    expect(baseImageFactory.removeImage).to.be.a('function');
    expect(baseImageFactory.updateMetadata).to.be.a('function');
  });

  describe('getImagesAsMetadata: ', function() {
    it('should return Template Editor attributes metadata', function() {
      var data = baseImageFactory.getImagesAsMetadata();      

      expect(data).to.equals('data');
      templateEditorFactory.getAttributeData.should.have.been.calledWith('componentId','metadata');
    });
  });

  describe('getDuration: ', function() {
    it('should return Template Editor attributes duration', function() {
      var data = baseImageFactory.getDuration();      

      expect(data).to.equals('data');
      templateEditorFactory.getAttributeData.should.have.been.calledWith('componentId','duration');
    });
  });

  describe('setDuration: ', function() {
    it('should set Template Editor attributes duration', function() {
      baseImageFactory.setDuration(55);      

      templateEditorFactory.setAttributeData.should.have.been.calledWith('componentId','duration',55);
    });
  });

  describe('getBlueprintData: ', function() {
    it('should return blueprint data', function() {
      var data = baseImageFactory.getBlueprintData('key');      

      expect(data).to.equals('data');
      blueprintFactory.getBlueprintData.should.have.been.calledWith('componentId','key');
    });
  });

  describe('areChecksCompleted: ', function() {
    it('should return true if componentId is in the list', function() {
      expect(baseImageFactory.areChecksCompleted({componentId:true})).to.be.true;
      expect(baseImageFactory.areChecksCompleted({otherID:true,componentId:true})).to.be.true;
    });

    it('should return false if empty or not present', function() {
      expect(baseImageFactory.areChecksCompleted(null)).to.be.false
      expect(baseImageFactory.areChecksCompleted({})).to.be.false;
      expect(baseImageFactory.areChecksCompleted({anotherId:true})).to.be.false;
    });

    it('should return false if componentId is not set', function() {
      baseImageFactory.componentId = null;
      expect(baseImageFactory.areChecksCompleted({componentId:true})).to.be.false;
    });
  });

  describe('removeImage: ', function() {
    it('should resolve fileMetadataUtilsService result', function(done) {
      var file = {file:'file1'};
      var metadata = [file];
      baseImageFactory.removeImage(file,metadata).then(function(result){
        expect(result).to.deep.equals(['metadataWithFileRemoved']);
        fileMetadataUtilsService.metadataWithFileRemoved.should.have.been.calledWith(metadata,file);
        done()
      }).catch(function(){
        done('should not reject');
      });
    });

    it('should resolve to empty list if metadataWithFileRemoved is undefined', function(done) {
      var file = {file:'file1'};
      var metadata = [file];
      fileMetadataUtilsService.metadataWithFileRemoved.returns(undefined);

      baseImageFactory.removeImage(file,metadata).then(function(result){
        expect(result).to.deep.equals([]);
        fileMetadataUtilsService.metadataWithFileRemoved.should.have.been.calledWith(metadata,file);
        done()
      }).catch(function(){
        done('should not reject');
      });
    });
  });

  describe('updateMetadata: ', function() {
    it('should set attributes data and return metadata', function() {
      var metadata = ['metadata'];
      var data = baseImageFactory.updateMetadata(metadata);      

      expect(data).to.deep.equals(metadata);
      templateEditorFactory.setAttributeData.should.have.been.calledWith('componentId','metadata',metadata);
      templateEditorFactory.setAttributeData.should.have.been.calledWith('componentId','files','files');

      fileMetadataUtilsService.filesAttributeFor.should.have.been.calledWith(metadata);
    });

    describe('isLogo: ', function() {
      it('should not update flag if isLogo is not true', function() {
        var metadata = ['metadata'];
        var data = baseImageFactory.updateMetadata(metadata);      

        templateEditorFactory.setAttributeData.should.have.been.calledTwice;
      });

      it('should update flag if isLogo is true', function() {
        var metadata = ['metadata'];
        blueprintFactory.getBlueprintData.returns('true');
        var data = baseImageFactory.updateMetadata(metadata);      

        templateEditorFactory.setAttributeData.should.have.been.calledThrice;
      });

      it('should update isLogo flag to false if some files are sent', function() {
        var metadata = ['metadata'];
        blueprintFactory.getBlueprintData.returns('true');
        var data = baseImageFactory.updateMetadata(metadata);      

        templateEditorFactory.setAttributeData.should.have.been.calledWith('componentId', 'isLogo', false);
      });

      it('should update isLogo flag to false if no files are sent', function() {
        var metadata = [];
        blueprintFactory.getBlueprintData.returns('true');
        var data = baseImageFactory.updateMetadata(metadata);      

        templateEditorFactory.setAttributeData.should.have.been.calledWith('componentId', 'isLogo', false);
      });

    });

    describe('isSetAsLogo',function() {
      it('should return true if blueprint is logo and attribute is true',function(){
        blueprintFactory.getBlueprintData.returns('true');
        templateEditorFactory.getAttributeData.returns(true);

        expect(baseImageFactory.isSetAsLogo()).to.equals(true);
      });

      it('should return false otherwise',function(){
        blueprintFactory.getBlueprintData.returns('false');
        templateEditorFactory.getAttributeData.returns(true);
        expect(baseImageFactory.isSetAsLogo()).to.equals(false);

        blueprintFactory.getBlueprintData.returns('true');
        templateEditorFactory.getAttributeData.returns(false);
        expect(baseImageFactory.isSetAsLogo()).to.equals(false);

        blueprintFactory.getBlueprintData.returns('false');
        templateEditorFactory.getAttributeData.returns(false);
        expect(baseImageFactory.isSetAsLogo()).to.equals(false);
      });
    });
  });

});
