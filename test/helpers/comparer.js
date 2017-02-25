var fs = require('fs');
var path = require('path');
var expect = require('expect.js');
var pathComparisons = path.resolve(__dirname, '..', 'comparisons');
const trimTrailingWhitespace = /\s*\n/g;

module.exports = function(data, targetFile, callback) {
  fs.readFile(path.join(pathComparisons, targetFile), 'utf8', function(err, expectedData) {
    expect(err).to.not.be.ok();
    expect(data.replace(trimTrailingWhitespace, ''))
      .to.equal(expectedData.replace(trimTrailingWhitespace, ''));
    callback(err);
  });
};