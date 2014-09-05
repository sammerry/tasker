var cheerio = require('cheerio'),
    Deferred = require('deferred'),
    promisify = Deferred.promisify,
    nconf = require('nconf'),
    fs = require('fs'),
    parseString = require('xml2js').parseString;



/**
 *  node file operations
 */
module.exports.readdir = promisify(fs.readdir);
module.exports.readFile = promisify(fs.readFile, 1);
module.exports.writeFile = promisify(fs.writeFile);




/**
 * a promise friendly synchronous map
 */
module.exports.mapSync = function (task) {

  function worker (array) {
    var out = [];
    var len = array.length;

    while(len--) {
      var data = array[len]
      var d2 = task.call(this, data)
      out.push(d2);
    }

    return out;
  }

  return worker;
}




/**
 * converts from string to jquery
 */
module.exports.toJquery = function (string) {
  var dfd = new Deferred();
  try {
    dfd.resolve(cheerio.load(string));
  } catch (e) {
    dfd.reject(e);
  }
  return dfd.promise();
};




/**
 * writes some value to a file
 */
module.exports.toFile = function (string) {
  fs.writeFile(nconf.get('export:file_name'), string, function (err) {
    if (err) return dfd.reject(err);
    dfd.resolve()
  })
}




/**
 * converts from string to json
 */
module.exports.toJSON = function (string) {
  var dfd = new Deferred();
  try {
    dfd.resolve(JSON.parse(string));
  } catch (e) {
    dfd.reject(e);
  }
  return dfd.promise();
};




/**
 * converts json to string
 */
module.exports.JSONtoString = function (json) {
  var dfd = new Deferred();
  var string;
  try {
    string = JSON.stringify(json);
    dfd.resolve(string)
  } catch (e) {
    dfd.reject(e);
  }
  return dfd.promise();
}




/**
 * converts from string to xml
 */
module.exports.toXML = function (string) {
  var dfd = new Deferred();

  parseString(string,
    nconf.get('xml'),
  function (err, result) {
    if (!!err) dfd.reject(err);
    dfd.resolve(result);
  });

  return dfd.promise();
};

