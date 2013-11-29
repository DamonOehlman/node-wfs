# node-wfs

This is a simple [WFS](http://en.wikipedia.org/wiki/Web_Feature_Service)
client for node.


[![NPM](https://nodei.co/npm/wfs.png)](https://nodei.co/npm/wfs/)

[![Build Status](https://travis-ci.org/DamonOehlman/node-wfs.png?branch=master)](https://travis-ci.org/DamonOehlman/node-wfs)

## Example Usage

```js
var geofilter = require('geofilter');
var wfs = require('wfs');

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
```

## License(s)

### MIT

Copyright (c) 2013 Damon Oehlman <damon.oehlman@gmail.com>

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
