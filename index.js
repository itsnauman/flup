/**
 * Module dependencies.
 */

var net = require("net");
var chalk = require("chalk");
var program = require('commander');

// List of all active client connections
var clientSockets = [];

program
  .version('0.0.1')
  .option('-s, --server <host>', 'Start flup chat server')
  .option('-c, --client <host>', 'Start a chat client')
  .parse(process.argv);

/**
 * Send message to all active clients
 * @param  {[String]} message
 * @param  {[type]} senderSock Socket object
 */

var brodcast = function (message, senderSock) {
  clientSockets.forEach(function (sock) {
    if (sock === senderSock) { return; }
    sock.write(chalk.green("[" + sock.name + "]: ") + message);
  });
}

if (program.server) {

  var flup = net.createServer({allowHalfOpen: true}, function(conn) {
    conn.name = conn.remoteAddress + ":" + conn.remotePort
    brodcast(chalk.bold.cyan("Entered Chat Room :)"), conn);
    clientSockets.push(conn);

    conn.on('data', function(data) {
      brodcast(data, conn);
    });

    conn.on('end', function() {
      clientSockets.splice(clientSockets.indexOf(conn), 1)
      brodcast('Left Chat Room :(', conn);
      process.stdout.write(conn.name + " Left");
    });
  });

  flup.on('error', function(e) {
    process.stdout.write(chalk.bold.red(e));
  });

  var port = program.server.split(":")[1]
  var host = program.server.split(":")[0]

  flup.listen(port, host);

  console.log("Listening on " + host + ":" + port);
}

if (program.client) {

  var client = new net.Socket();
  client.setEncoding('utf8');

  var port = program.client.split(":")[1]
  var host = program.client.split(":")[0]

  client.connect(port, host, function() {
    console.log("Connected to server!");
  });

  client.on('data', function(data) {
    process.stdout.write(data);
  });

  client.on('error', function(e) {
    if (e.code === "ECONNREFUSED") {
      console.log(chalk.bold.red("Error: Connecting to wrong host and port!"));
    } else {
      console.log(chalk.bold.red(e.code));
    }
  });

  client.on('close', function(had_error) {
    process.exit(0);
  });

  process.stdin.resume();

  process.stdin.on('readable', function() {
    process.stdout.write(chalk.bold.blue("> "));
  });

  process.on("SIGINT", function() {
    console.log('Interrupted');
    process.exit(0);
  });

  process.stdin.on('data', function(data) {
    client.write(data);
  });
}
