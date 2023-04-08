// console.log("a new file started in a different thread")

var net = require("net");
var path = require('path');
var fs = require("fs");
var sockpath = '/home/f1/tmp/previewer.sock';
if (fs.existsSync(sockpath)) {
  fs.unlinkSync(sockpath, function (err) {
    if (err) {
      console.error("Error deleting Unix socket: ".concat(err));
    } else {
      console.log('Unix socket deleted successfully');
    }
  });
}
var server = net.createServer(function (socket) {
  socket.on('data', function (d) {
    process.send(d.toString());
    socket.write('message from electron received');
  });
});
server.listen(sockpath, function () {});

// unixSocketServer.on('connection', (d) => {
// unixSocketServer.write('you have connected to electron');
// });

// SET THIS TO BLOCKING