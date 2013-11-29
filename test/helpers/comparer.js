var fs = require('fs');
var path = require('path');
var expect = require('expect.js');
var pathComparisons = path.resolve(__dirname, '..', 'comparisons');

module.exports = function(data, targetFile, callback) {
  fs.readFile(path.join(pathComparisons, targetFile), 'utf8', function(err, expectedData) {
    expect(err).to.not.be.ok();
    expect(data).to.equal(expectedData);
    callback(err);
  });
};