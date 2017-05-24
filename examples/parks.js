const geofilter = require('geofilter');
const wfs = require('..');

const rules = {
  isPark: {
    type: 'like',
    args: {
      property: 'type',
      value: 'Park',
      matchCase: false
    }
  },

  // -74.00013,40.600659,-73.900909,40.700422
  inBrooklyn: {
    type: 'bbox',
    args: {
      property: 'geom',
      min: '40.60 -74.00',
      max: '40.70 -73.90'
    }
  }
};

function handleFeatures(err, results) {
  if (err) {
    return console.log('ERROR: ', err);
  }

  if (results.features) {
    console.log('found ' + results.features.length + ' parks');
    results.features.forEach(function(feature) {
      console.log(`${feature.properties.name} (feature id: ${feature.id})`);
    });
  }
}

wfs.getFeature({
  url: 'https://maps-public.geo.nyu.edu/geoserver/sdr/wfs',
  typeName: 'sdr:nyu_2451_34564',
  filter: new geofilter.RuleSet([rules.isPark, rules.inBrooklyn]).to('ogc'),
}, handleFeatures);
