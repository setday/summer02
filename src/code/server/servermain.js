const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io');
const server = io(http);
const PORT = process.env.PORT || 8081;

console.log('start');

const SERVER_URL =
'https://sleepy-sands-27635.herokuapp.com/';

const cars = [];

server.on('connection', function (socket) {
  cars.forEach((i) => { server.emit('addCar', socket.id); });
  cars.forEach((i) => { server.emit('addCar', i); });
  cars.push(socket.id);
  cars.forEach((i) => { server.emit('updateAll'); });

  socket.on('update', (speed, x, y, z, angle, wheelRotY) => {
    cars.forEach((i) => {
      if (i !== socket.id) {
        server.emit('update', socket.id, speed, x, y, z, angle, wheelRotY);
      }
    });
  });

  socket.on('speedSet', (speed) => {
    cars.forEach((i) => {
      if (i !== socket.id) {
        server.emit('speedSet', socket.id, speed);
      }
    });
  });

  socket.on('wheelRotYSet', (wheelRotY) => {
    cars.forEach((i) => {
      if (i !== socket.id) {
        server.emit('wheelRotYSet', socket.id, wheelRotY);
      }
    });
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Datauiugguigugfgukgfguigukf-server</h1>');
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
