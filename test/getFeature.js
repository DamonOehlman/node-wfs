var wfs = require('../'),
    expect = require('expect.js'),
    geofilter = require('geofilter'),
    comparer = require('./helpers/comparer'),
    _ = require('underscore'),
    baseRequest = {
        url: 'http://localhost:8080/geoserver/wfs',
        typeName: 'gov:toilets'
    },
    rules = {
        likeSand: {
            type: 'like',
            args: {
                property: 'name',
                value: 'belmore*',
                matchCase: false
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
            comparer(data, 'getFeature-boston-sediment.xml', done);
        });
    });

    it('should be able to make the request to a test server', function(done) {
        wfs.getFeature(baseRequest, function(err, results) {
            expect(results).to.be.ok();
            expect(results.type).to.equal('FeatureCollection');
            
            // check that we have a features array
            expect(Array.isArray(results.features)).to.be.ok();
            expect(results.features.length).to.be.above(50);
            
            // console.dir(results.features);
            
            done(err);
        });
    });
    
    it('should be able to make a filtered request to a test server', function(done) {
        var ruleset = new geofilter.RuleSet([rules.likeSand]),
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
                expect(feature.properties.name.toLowerCase().indexOf('belmore')).to.equal(0);
            });
            
            done(err);
        });
    });
});