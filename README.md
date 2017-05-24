
# node-wfs

This is a simple [WFS](http://en.wikipedia.org/wiki/Web_Feature_Service)
client for node.


[![NPM](https://nodei.co/npm/wfs.png)](https://nodei.co/npm/wfs/)

[![Build Status](https://api.travis-ci.org/DamonOehlman/node-wfs.svg?branch=master)](https://travis-ci.org/DamonOehlman/node-wfs) [![bitHound Score](https://www.bithound.io/github/DamonOehlman/node-wfs/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/node-wfs) 

## Example Usage

```js
const geofilter = require('geofilter');
const wfs = require('wfs');

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

```

## License(s)

### MIT

Copyright (c) 2017 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
