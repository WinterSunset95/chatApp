const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const userArray = [];
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/main/login.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/main/index.html');
});

app.get('/logout', (req, res) => {
  res.sendFile(__dirname + '/main/logout.html');
});

io.on('connection', (socket) => {
  socket.on('userConnect', (user) => {
    console.log('userconnect event')
    console.log(user, ' connected, ID- ', socket.id);
    var name = user;
    var socketId = socket.id;
    userArray.push({name, socketId});
    console.log('user added');
    console.log('curent userArray, ', userArray);
    io.emit('userConnect', name, socketId, userArray);
    
  });
  socket.on('chat message', (msg, name) => {
    io.emit('chat message', msg, name);
    console.log(name, msg);
  });
  socket.on('disconnect', () => {
    try {
      console.log('disconnect event');
      console.log(socket.id, ' disconnected');
      let ssid = socket.id;
      let discon = userArray.find(discon => discon.socketId === ssid);
      let name = discon.name;
      let ind = userArray.indexOf(discon);
      userArray.splice(ind, 1);
      console.log(name, 'disconnected');
      console.log('current userArray', userArray);
      io.emit('userdisconn', name, ssid, userArray);
  }
    catch (err) {
      console.log('User is not found so not removed');
    }
  })
  
});
app.use(express.static(__dirname + '/main'));

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
