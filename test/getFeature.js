var wfs = require('../'),
    expect = require('expect.js'),
    geofilter = require('geofilter'),
    geojs = require('geojs'),
    comparer = require('./helpers/comparer'),
    _ = require('underscore'),
    baseRequest = {
        url: 'http://data.gov.au/geoserver/wms',
        typeName: 'ckan_db18d309_6584_4c51_a7a6_e76285a70eb1'
    },
    testMin = new geojs.Pos('-28.94 138.01'),
    testMax = new geojs.Pos('-9.54 154.42'),
    testBounds = new geojs.BBox(testMin, testMax),
    rules = {
        inToowoomba: {
            type: 'like',
            args: {
                property: 'suburb',
                value: 'Toowoomba',
                matchCase: false
            }
        },

        inQLD: {
            type: 'bbox',
            args: {
                property: 'geometry',
                min: testMin.toString(),
                max: testMax.toString()
            }
        }
    };

describe('getFeature tests', function() {
    it('should complain when "typeName" is not specified', function(done) {
        wfs.getXML('getFeature', function(err, data) {
            expect(err).to.be.ok();
            done();
        });
    });

    it('should be able to generate the xml for a non-filtered request', function(done) {
        wfs.getXML('getFeature', baseRequest, function(err, data) {
            comparer(data, 'getFeatureRequest.xml', done);
        });
    });

    it('should be able to make the request to a test server', function(done) {
        wfs.getFeature(baseRequest, function(err, results) {
            expect(results).to.be.ok();
            expect(results.type).to.equal('FeatureCollection');

            // check that we have a features array
            expect(Array.isArray(results.features)).to.be.ok();
            expect(results.features.length).to.equal(40);
            // console.dir(results.features);
            done(err);
        });
    });

    it('should be able to make a filtered request to a test server', function(done) {
        var ruleset = new geofilter.RuleSet([rules.inToowoomba]),
            filter = ruleset.to('ogc'),
            testRequest = _.extend({}, baseRequest, {
                filter: filter
            });

        wfs.getFeature(testRequest, function(err, results) {
            expect(results).to.be.ok();
            expect(results.type).to.equal('FeatureCollection');

            console.log(results.features[0].geometry);

            // check that we have a features array
            expect(Array.isArray(results.features)).to.be.ok();
            expect(results.features.length).to.be.above(0);

            results.features.forEach(function(feature) {
                expect(feature.properties.suburb.toLowerCase().indexOf('toowoomba')).to.equal(0);
            });

            done(err);
        });
    });

    it('should be able to make a filtered (two rules) request to a test server', function(done) {
        var ruleset = new geofilter.RuleSet([rules.inQLD]),
            filter = ruleset.to('ogc'),
            testRequest = _.extend({}, baseRequest, {
                filter: filter
            });

        wfs.getFeature(testRequest, function(err, results) {
            expect(results).to.be.ok();
            expect(results.type).to.equal('FeatureCollection');

            // check that we have a features array
            expect(Array.isArray(results.features)).to.be.ok();
            expect(results.features.length).to.be.above(0);

            results.features.forEach(function(feature) {
                var featurePos = new geojs.Pos(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);

                expect(feature.properties.suburb.toLowerCase().indexOf('toowoomba')).to.equal(0);
                expect(testBounds.contains(featurePos)).to.be.ok();
            });

            done(err);
        });
    });
});