var wfs = require('../'),
    expect = require('expect.js'),
    comparer = require('./helpers/comparer');
    
describe('getFeature tests', function() {
    it('should complain when "typeName" is not specified', function(done) {
        wfs.getXML('getFeature', function(err, data) {
            expect(err).to.be.ok();
            done();
        });
    });
    
    it('should be able to generate the xml for a non-filtered request', function(done) {
        wfs.getXML('getFeature', { typeName: 'antarctic_ice_cores' }, function(err, data) {
            comparer(data, 'getFeature-antarctic_ice_cores.xml', done);
        });
    });
});