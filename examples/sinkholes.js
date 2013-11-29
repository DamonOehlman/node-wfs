var geofilter = require('geofilter');
var wfs = require('..');

// create some rules for geofilter to work with
var rules = {};

// define the isSinkhole rule
rules.isSinkhole = {
  type: 'like',
  args: {
      property: 'TEXTNOTE',
      value: 'sinkhole',
      matchCase: false
  }
};

// define the inQLD rule
rules.inQLD = {
  type: 'bbox',
  args: {
      property: 'the_geom',
      min: '-28.94 138.01',
      max: '-9.54 154.42'
  }
};

function handleFeatures(err, results) {
  if (err) {
    return console.log('ERROR: ', err);
  }

  if (results.features) {
    console.log('found ' + results.features.length + ' caves');
    results.features.forEach(function(feature) {
      console.log('found feature: ' + feature.id);
    });
  }
}

wfs.getFeature({
  url: 'http://envirohack.research.nicta.com.au/geotopo_250k/ows',
  typeName: 'Terrain:caves',
  filter: new geofilter.RuleSet([rules.isSinkhole, rules.inQLD]).to('ogc'),
}, handleFeatures);