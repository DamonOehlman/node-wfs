var wfs = require('../'),
    expect = require('expect.js'),
    comparer = require('./helpers/comparer'),
    baseIceCores = {
        url: 'http://giswebservices.massgis.state.ma.us/geoserver/wfs',
        typeName: 'massgis:MORIS.BH_SEDGRABS_PT'
    };
    
describe('getFeature tests', function() {
    it('should complain when "typeName" is not specified', function(done) {
        wfs.getXML('getFeature', function(err, data) {
            expect(err).to.be.ok();
            done();
        });
    });
    
    it('should be able to generate the xml for a non-filtered request', function(done) {
        wfs.getXML('getFeature', baseIceCores, function(err, data) {
            comparer(data, 'getFeature-boston-sediment.xml', done);
        });
    });

    it('should be able to make the request to a test server', function(done) {
        wfs.getFeature(baseIceCores, function(err, results) {
            done(err);
        });
    });
});