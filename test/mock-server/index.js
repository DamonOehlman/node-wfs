const path = require('path');
const fs = require('fs');
const nock = require('nock');

// nock.recorder.rec()

nock('https://maps-public.geo.nyu.edu:443', {"encodedQueryParams":true})
  .post('/geoserver/sdr/wfs', getRequestFile('GetFeature.xml'))
  .reply(200, getResponseFile('GetFeature.json'));

nock('https://maps-public.geo.nyu.edu:443', {"encodedQueryParams":true})
  .post('/geoserver/sdr/wfs', getRequestFile('GetFeature_propertyName.xml'))
  .reply(200, getResponseFile('GetFeature_propertyName.json'));

nock('https://maps-public.geo.nyu.edu:443', {"encodedQueryParams":true})
  .post('/geoserver/sdr/wfs', getRequestFile('GetFeature_geometry.xml'))
  .reply(200, getResponseFile('GetFeature_geometry.json'));

function getRequestFile(filename) {
  return fs.readFileSync(path.join(__dirname, 'requests', filename), 'utf-8');
}

function getResponseFile(filename) {
  return fs.readFileSync(path.join(__dirname, 'responses', filename), 'utf-8');
}
