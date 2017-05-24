const wfs = require('../');
const expect = require('expect.js');
const geofilter = require('geofilter');
const geojs = require('geojs');
const comparer = require('./helpers/comparer');
const _ = require('underscore');
const baseRequest = {
  url: 'https://maps-public.geo.nyu.edu/geoserver/sdr/wfs',
  typeName: 'sdr:nyu_2451_34564'
};
const lowerCorner = new geojs.Pos('40.60 -74.00');
const upperCorner = new geojs.Pos('40.70 -73.90');
const rules = {
  inBronx: {
    type: 'like',
    args: {
      property: 'borough',
      value: 'Bronx',
      matchCase: false
    }
  },

  // -74.00013,40.600659,-73.900909,40.700422
  inBrooklyn: {
    type: 'bbox',
    args: {
      property: 'geom',
      min: lowerCorner.toString(),
      max: upperCorner.toString()
    }
  }
};

describe('getFeature tests', function() {
  before(function() {
    // NOTE: To use a real server (assuming it is still available) comment out the next line
    require('./mock-server');
  });

  it('should complain when "typeName" is not specified', function(done) {
    wfs.getXML('getFeature', function(err) {
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
      expect(err).to.not.be.ok();
      expect(results).to.be.ok();
      expect(results.type).to.equal('FeatureCollection');

      // check that we have a features array
      expect(Array.isArray(results.features)).to.be.ok();
      expect(results.features.length).to.equal(96);
      // console.dir(results.features);
      done(err);
    });
  });

  it('can filter results based on property name', function(done) {
    var ruleset = new geofilter.RuleSet([rules.inBronx]),
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
        expect(feature.properties.borough.toLowerCase().indexOf('bronx')).to.equal(0);
      });

      done(err);
    });
  });

  it('can filter results based on geometry', function(done) {
    var ruleset = new geofilter.RuleSet([rules.inBrooklyn]),
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
        expect(feature.properties.borough.toLowerCase().indexOf('brooklyn')).to.equal(0);
      });

      done(err);
    });
  });
});
