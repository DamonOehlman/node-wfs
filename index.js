/* jshint node: true */
'use strict';

/**
  # node-wfs

  This is a simple [WFS](http://en.wikipedia.org/wiki/Web_Feature_Service)
  client for node.

  ## Example Usage

  <<< examples/parks.js

**/

var async = require('async');
var debug = require('debug')('wfs');
var formatter = require('formatter');
var fs = require('fs');
var path = require('path');
var request = require('request');
var stripBom = require('strip-bom');
var _ = require('underscore');
var operations = ['getFeature'];

var baseNamespaces = {
  wfs: 'http://www.opengis.net/wfs',
  ogc: 'http://www.opengis.net/ogc',
  gml: 'http://www.opengis.net/gml',
  xsi: 'http://www.w3.org/2001/XMLSchema-instance'
};

// define some required attributes
var requestRequiredAttributes = {
  getFeature: ['typeName']
};

var reStatusOK = /^(2|3)/;
var reTrailingWhitespace = /\s+(\n)/gm;
var loadedTemplates = {};

function getTemplate(operation, opts, callback) {
  // if the template has already been loaded, then send it back
  if (loadedTemplates[operation]) {
    return callback(null, loadedTemplates[operation]);
  }

  // read the file and update the loadedTemplates
  fs.readFile(path.resolve(__dirname, 'templates', operation + '.xml'), 'utf8', function(err, data) {
    var template;

    // if we managed to load the template correctly, do that now
    if (! err) {
      template = loadedTemplates[operation] = formatter(data);
    }

    callback(err, template);
  });
}

function getXML(operation, opts, callback) {
  var data;
  var namespaces;
  var requiredAttributes = requestRequiredAttributes[operation] || [];

  // check for a the (operation, callback) variant
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }

  // initialise opts
  opts = opts || {};

  // initialise the output format
  opts.outputFormat = opts.outputFormat || 'JSON';

  // initialise the WFS version
  opts.version = opts.version || '2.1.0';

  // check the required attributes
  for (var ii = 0, count = requiredAttributes.length; ii < count; ii++) {
    var attr = requiredAttributes[ii];

    if (typeof opts[attr] == 'undefined') {
      return callback(new Error('Attribute "' + attr + '" is required for a "' + operation + '" request'));
    }
  }

  // clone the opts to create the data
  data = _.extend({}, opts, {
    namespaces: stringifyNamespaces(_.defaults(opts.namespaces || {}, baseNamespaces))
  });

  // get the template, and
  getTemplate(operation, opts, function(err, template) {
    callback(err, err ? undefined : template(data).replace(reTrailingWhitespace, '$1'));
  });
}

function stringifyNamespaces(namespaces) {
  var lines = [];

  for (var key in namespaces) {
    lines[lines.length] = 'xmlns:' + key + '="' + namespaces[key] + '"';
  }

  return lines.join(' ');
}

// export the getXML function
exports.getXML = getXML;

// initialise the operation handlers
operations.forEach(function(operation) {
  exports[operation] = function(opts, callback) {
    // ensure we have opts
    opts = opts || {};

    // ensure that a url has been supplied
    if (! opts.url) {
      return callback(new Error('A url is required for a "' + operation + '" requuest'));
    }

    // get the xml for the specified request
    getXML(operation, opts, function(err, xml) {
      var requestOpts = {
        url: opts.url,
        body: xml
      };

      debug('generated xml for operation "' + operation + '"', xml);
      debug('making request to: ' + opts.url);

      request.post(requestOpts, function(err, response, body) {
        if (err) {
          debug('received error: ', err);
          return callback(err);
        }

        if (response && (! reStatusOK.test(response.statusCode))) {
          err = new Error('Received status code "' + response.statusCode +
            '" for the response');
        }

        // if we have a body, and the expected output is JSON, attempt a conversion
        // (if it isn't an object already)
        if (body && opts.outputFormat === 'JSON' && typeof body == 'string') {
          try {
            // Removes UTF-8 byte order mark and NULL bytes from body
            body = stripBom(body.replace(/\0/g, ''));
            body = JSON.parse(body);
          }
          catch (e) {
            err = new Error('Expected JSON, but could not JSON parse the response');
          }
        }

        callback(err, body);
      });
    });
  };
});
