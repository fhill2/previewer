// console.log("a new file started in a different thread")

const net = require("net")
const path = require('path')
const fs = require("fs")


const sockpath = '/home/f1/tmp/previewer.sock'


if (fs.existsSync(sockpath)) {
  fs.unlinkSync(sockpath, (err) => {
    if (err) {
      console.error(`Error deleting Unix socket: ${err}`);
    } else {
      console.log('Unix socket deleted successfully');
    }
  });
}

const server = net.createServer((socket) => {

socket.on('data', (d) => {
  process.send(d.toString())
  socket.write('message from electron received');
});


});

server.listen(sockpath, () => {});

// unixSocketServer.on('connection', (d) => {
  // unixSocketServer.write('you have connected to electron');
// });



// SET THIS TO BLOCKING


