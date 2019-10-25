'use strict';

describe('service: fileMetadataUtilsService:', function() {
  beforeEach(module('risevision.template-editor.services'));

  var fileMetadataUtilsService;

  beforeEach(function() {
    inject(function($injector) {
      fileMetadataUtilsService = $injector.get('fileMetadataUtilsService');
    });
  });

  it('should initialize', function () {
    expect(fileMetadataUtilsService).to.be.truely;
    expect(fileMetadataUtilsService.thumbnailFor).to.be.a('function');
    expect(fileMetadataUtilsService.timeCreatedFor).to.be.a('function');
  });

  describe('thumbnailFor', function() {

    it('should get thumbnail if provided in the entry', function() {
      var thumbnail = fileMetadataUtilsService.thumbnailFor({
        metadata: {
          thumbnail: 'http://thumbnail'
        },
        timeCreated: {
          value: 200
        }
      });

      expect(thumbnail).to.equal('http://thumbnail?_=200');
    });

    it('should use default thumbnail if the entry has no thumbnail', function() {
      var thumbnail = fileMetadataUtilsService.thumbnailFor({}, 'http://default-thumbnail');

      expect(thumbnail).to.equal('http://default-thumbnail');
    });

  });

  describe('timeCreatedFor', function() {

    it('should get time created if provided in the entry', function() {
      var timeCreated = fileMetadataUtilsService.timeCreatedFor({
        metadata: {
          thumbnail: 'http://thumbnail'
        },
        timeCreated: {
          value: 200
        }
      });

      expect(timeCreated).to.equal(200);
    });

    it('should not fail if time created is not provided in the entry', function() {
      var timeCreated = fileMetadataUtilsService.timeCreatedFor({});

      expect(timeCreated).to.be.falsey;
    });

  });

  describe('extractFileNamesFrom', function() {

    it('should extract file names from metadata', function() {
      var fileNames = fileMetadataUtilsService.extractFileNamesFrom([
        { file: 'a.txt' },
        { file: 'b.txt' },
        { file: 'c.txt' }
      ]);

      expect(fileNames).to.deep.equal(['a.txt', 'b.txt', 'c.txt']);
    });

  });

  describe('filesAttributeFor', function() {

    it('should extract file names from metadata', function() {
      var filesAttribute = fileMetadataUtilsService.filesAttributeFor([
        { file: 'a.txt' },
        { file: 'b.txt' },
        { file: 'c.txt' }
      ]);

      expect(filesAttribute).to.deep.equal('a.txt|b.txt|c.txt');
    });

  });

  describe('metadataWithFile', function() {

    it('should add to metadata', function() {
      var metadata = fileMetadataUtilsService.metadataWithFile([],
        'http://default-thumbnail', [
          {
            bucket: 'x',
            name: 'd.txt',
            metadata: {
              thumbnail: 'http://thumbnail'
            },
            timeCreated: {
              value: 200
            }
          }
        ]
      );

      expect(metadata).to.deep.equal([
        {
          file: 'x/d.txt',
          exists: true,
          'time-created': 200,
          'thumbnail-url': 'http://thumbnail?_=200'
        }
      ]);
    });

    it('should consider default thumbnail', function() {
      var metadata = fileMetadataUtilsService.metadataWithFile([],
        'http://default-thumbnail', [
          {
            bucket: 'x',
            name: 'd.txt',
            timeCreated: {
              value: 200
            }
          }
        ]
      );

      expect(metadata).to.deep.equal([
        {
          file: 'x/d.txt',
          exists: true,
          'time-created': 200,
          'thumbnail-url': 'http://default-thumbnail'
        }
      ]);
    });

    it('should rewrite existing image', function() {
      var metadata = fileMetadataUtilsService.metadataWithFile([
          { file: 'x/d.txt' }
        ],
        'http://default-thumbnail', [
          {
            bucket: 'x',
            name: 'd.txt',
            metadata: {
              thumbnail: 'http://thumbnail'
            },
            timeCreated: {
              value: 200
            }
          }
        ]
      );

      expect(metadata).to.deep.equal([
        {
          file: 'x/d.txt',
          exists: true,
          'time-created': 200,
          'thumbnail-url': 'http://thumbnail?_=200'
        }
      ]);
    });

    it('should append an image', function() {
      var metadata = fileMetadataUtilsService.metadataWithFile([
          { file: 'x/d.txt' }
        ],
        'http://default-thumbnail', [
          {
            bucket: 'x',
            name: 'd.txt',
            metadata: {
              thumbnail: 'http://thumbnail'
            },
            timeCreated: {
              value: 200
            }
          }
        ], true
      );

      expect(metadata).to.deep.equal([
        {
          file: 'x/d.txt',
          exists: true,
          'time-created': 200,
          'thumbnail-url': 'http://thumbnail?_=200'
        },
        {
          file: 'x/d.txt',
          exists: true,
          'time-created': 200,
          'thumbnail-url': 'http://thumbnail?_=200'
        }
      ]);
    });

  });

  describe('metadataWithFileRemoved', function() {

      it('should remove an image', function() {
        var entryToDelete = { file: 'x/b.txt' };
        var metadata = fileMetadataUtilsService.metadataWithFileRemoved([
            { file: 'x/a.txt' },
            entryToDelete,
            { file: 'x/c.txt' }
          ], entryToDelete
        );

        expect(metadata).to.deep.equal([
          { file: 'x/a.txt' },
          { file: 'x/c.txt' }
        ]);
      });

  });

  describe('getUpdatedFileMetadata', function() {

    var sampleMetadata;

    beforeEach(function() {
      sampleMetadata = [
        {
          "file": "image.png",
          exists: true,
          "thumbnail-url": "http://image",
          "time-created": "123"
        },
        {
          "file": "image2.png",
          exists: false,
          "thumbnail-url": "http://image2",
          "time-created": "345"
        }
      ];
    });

    it('should directly return metadata if it\'s not already loaded', function()
    {
      var metadata =
        fileMetadataUtilsService.getUpdatedFileMetadata(null, sampleMetadata);

      expect(metadata).to.deep.equal(sampleMetadata);
    });

    it('should combine metadata if it\'s already loaded', function()
    {
      var updatedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "654"
        },
        {
          "file": "image2.png",
          exists: false,
          "thumbnail-url": "http://image6",
          "time-created": "877"
        }
      ];

      var metadata =
        fileMetadataUtilsService.getUpdatedFileMetadata(sampleMetadata, updatedImages);

      expect(metadata).to.deep.equal(updatedImages);
    });

    it('should only update the provided images', function()
    {
      var updatedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "765"
        }
      ];
      var expectedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "765"
        },
        {
          "file": "image2.png",
          exists: false,
          "thumbnail-url": "http://image2",
          "time-created": "345"
        }
      ];

      var metadata =
        fileMetadataUtilsService.getUpdatedFileMetadata(sampleMetadata, updatedImages);

      expect(metadata).to.deep.equal(expectedImages);
    });

    it('should not update images that are not already present', function()
    {
      var updatedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "555"
        },
        {
          "file": "imageNew.png",
          exists: false, "thumbnail-url": "http://imageN",
          "time-created": "9"
        }
      ];
      var expectedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "555"
        },
        {
          "file": "image2.png",
          exists: false,
          "thumbnail-url": "http://image2",
          "time-created": "345"
        }
      ];

      var metadata =
        fileMetadataUtilsService.getUpdatedFileMetadata(sampleMetadata, updatedImages);

      expect(metadata).to.deep.equal(expectedImages);
    });

    it('should not return anything if no files match', function()
    {
      var updatedImages = [
        { "file": "imageOther.png", exists: false, "thumbnail-url": "http://image5" },
        { "file": "imageNew.png", exists: false, "thumbnail-url": "http://imageN" }
      ];

      var metadata =
        fileMetadataUtilsService.getUpdatedFileMetadata(sampleMetadata, updatedImages);

      expect(metadata).to.be.falsey;
    });

  });

});
