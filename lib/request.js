var r = require('request'),
    nconf = require('nconf'),
    outReq = [],
    Deferred = require('deferred');




module.exports.get = function (opt) {
  opt.method = 'GET';
  return request(opt);
};




module.exports.put = function (opt) {
  opt.method = 'PUT';
  return request(opt);
};




module.exports.post = function (opt) {
  opt.method = 'POST';
  return request(opt);
};




module.exports.del = function (opt) {
  opt.method =  'DELETE';
  return request(opt);
};



module.exports.request = request;



function request (options) {

  console.log('queueing', outReq.length);

  var dfd = new Deferred();

  if (typeof options === 'string') {
    options = {uri: options};
  }


  function callback (err, res) {
    if (!!err) return dfd.reject(err);

    if (res.statusCode < 200 || res.statusCode > 299) {
      console.log(res.statusCode, res.body);
      dfd.reject(new Error(res.statusCode));
    }
    // some sort of request logging
    var o = options;
    var uri = (!!o.uri) ? o.uri : o.url;
    console.log(res.statusCode +' :: res returned for :: ' + options.method, o.uri)
    dfd.resolve(res.body);
  }

  outReq.push([options, callback]);

  return dfd.promise();
}




/*
 * Throttle outbound requests
 */
setInterval(function () {
  var args = outReq.pop();
  if(!args) return;
  r.apply(this, args);
}, nconf.get('request_throttle'));
