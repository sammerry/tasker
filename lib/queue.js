var async = require('async'),
    Deferred = require('deferred'),
    EventEmitter = require('events').EventEmitter,
    util = require('util');

function Queue (consumer, limit) {
  var self = this;
  EventEmitter(self);

  function defaultConsumer (item, next) {
    try {
      item.task(item.data, next);
    } catch (e) {
      next();
    }
  }

  if (typeof consumer !== 'function') {
    limit = consumer;
    consumer = defaultConsumer;
  }

  var q = async.queue(consumer, limit);

  self.push = q.push;
  self.length = q.length;
  self.concurrency = q.concurrency
  self.process = q.process;

  q.drain = function () {
    self.emit('drain');
  };

  q.empty = function () {
    self.emit('empty');
  };

  q.saturated = function () {
    self.emit('saturated');
  };

  self.getDfdDrain = function () {
    var dfd = Deferred();
    if (self.length() < 1) {
      dfd.resolve();
    } else {
      self.once('drain', function () {
        dfd.resolve();
      });
    }
    return dfd.promise();
  }

  return self;
}
Queue.prototype = async.queue;
util.inherits(Queue, EventEmitter);

module.exports = Queue;
