const express = require('express');
const app = express();
const server = require('http').Server(app);
const client = require('http').client;
const io = require('socket.io')(server);
const _io = require('socket.io-client');

var _socket;

io.on('connection', (socket) => {
  //console.log(socket);
  socket.emit('login', 'login success!');
  
  socket.on('send_data', (list) => {
    console.log(list);
    require('./admin').data_x = [];
    require('./admin').data_y = [];
    require('./admin').data_w = 0;
    require('./admin').data_c = [];
    require('./admin').data_x = list.data_x;
    require('./admin').data_y = list.data_y;
    require('./admin').data_w = list.data_w;
    require('./admin').data_c = list.data_c;
    socket.disconnect();
  });
  
  socket.on('send_text', (text) => {
    console.log(text)
    require('./admin').list_text.push(text);
    socket.disconnect();
  });

  socket.on('player_info', (data) => {
    console.log(data);
    require('./admin').users.push(data);
    socket.disconnect();
  });
  
});

/* grab IP infomation */

const lan_info = () => {
  let nets = require('os').networkInterfaces();
  let results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  return results;
}

module.exports = {
  io: io,
  _io: _io,
  server: server,
  client: client,
  app: app,
  express: express,
  _socket: _socket,
  lan_info: lan_info
};