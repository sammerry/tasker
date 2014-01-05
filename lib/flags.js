module.exports = function () {
  process.argv.forEach(function (val, index, array) {
    function logHelp () {
      process.stdout.write("\n-v verbose\n-l to lowercase\n-f file path\n-s suppress errors\n-upsert upcert all entries : defaults to save\n-tb use timebucketing for osm timestamp and update timestamp\n-sc places all nodes, ways and relations in the 'geo' collection\n-k removes all attributes except ones supplied in comma separated list EX: -k way:user,timestamp\n-i includes all attributes except ones supplied in comma separated list EX: -i way:user,timestamp\n-host host name\n-db database\n-u username\n-p password\n-port port\n-h help\n\n");
    }

    if (index > 1) {
      switch (val) {
        case '-l':
          console.log(array);
        break;
        default:
          logHelp();
          process.kill();
        break;
      }
    }
  });

  return process;
};
