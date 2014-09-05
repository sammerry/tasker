var Queue = require('./queue.js');
var Deferred = require('deferred');
var nconf = require('nconf');
var _ = require('underscore');



// Load commandline flags
require('./flags');



function Tasker (options, done) {
  done = done || function () {};
  var tasker = this;
  nconf.set(options)



  // enxtend tasker with request and helpers
  tasker = _.extend(
    tasker,
    require('./request'),
    {utils: require('./helpers')}
  );

  var Topic = require(options.path);
  return Topic.call(tasker, done);
}



Tasker.prototype.inboundQueue = new Queue(nconf.get('concurrency'));



module.exports = Tasker;
