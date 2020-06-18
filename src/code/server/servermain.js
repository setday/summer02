const app = require('express')();
const http = require('https').createServer(app);
const io = require('socket.io');
const cors = require('cors');
const whitelist = ['http://localhost:8080'];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  }
};
const server = io(http);
const PORT = process.env.PORT || 3000;

console.log('start');

const SERVER_URL =
'https://sleepy-sands-27635.herokuapp.com/';

const cars = [];

server.on('connection', function (socket) {
  cars.forEach((i) => { server.to(i).emit('addCar', socket.id); });
  cars.forEach((i) => { server.to(socket.id).emit('addCar', i); });
  cars.push(socket.id);
  cars.forEach((i) => { server.to(i).emit('updateAll'); });

  socket.on('update', (speed, x, y, z, angle, wheelRotY) => {
    cars.forEach((i) => {
      if (i !== socket.id) {
        server.to(i).emit('update', socket.id, speed, x, y, z, angle, wheelRotY);
      }
    });
  });

  socket.on('speedSet', (speed) => {
    cars.forEach((i) => {
      if (i !== socket.id) {
        server.to(i).emit('speedSet', socket.id, speed);
      }
    });
  });

  socket.on('wheelRotYSet', (wheelRotY) => {
    cars.forEach((i) => {
      if (i !== socket.id) {
        server.to(i).emit('wheelRotYSet', socket.id, wheelRotY);
      }
    });
  });
});

app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', true);
});

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('<h1>Data-server</h1>');
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
