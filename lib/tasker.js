var Queue = require('./queue.js');
var nconf = require('nconf');
var _ = require('underscore');



// Load commandline flags
require('./flags');



function Tasker (options, done) {
  'use strict';

  done = done || function () {};
  var tasker = this;
  options = options || {};
  nconf.defaults(options);


  // enxtend tasker with request and helpers
  tasker = _.extend(
    tasker,
    require('./request'),
    {utils: require('./helpers')}
  );

  if (options.path) {
    var Topic = require(options.path);
    return Topic.call(tasker, done);
  }

  return tasker;
}



Tasker.prototype.inboundQueue = new Queue(nconf.get('concurrency'));



module.exports = Tasker;

