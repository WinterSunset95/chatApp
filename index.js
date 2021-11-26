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
    console.log('A user by the name ', user, ' conencted.');
    console.log('Attempting to remove any other users by that same name')
    try {
      let torm = userArray.find(torm => torm.name === user);
      console.log('variable torm, ', torm);
      let ind = userArray.indexOf(torm);
      console.log('ind is, ', ind);
      if (ind == -1) {
        console.log('no user removed')
      }
      else {
        console.log('ind, ', ind);
        userArray.splice(ind, 1);
        console.log(torm, ' removed from userArray');
        console.log('current userArray, ', userArray);
      }
    }
    catch (err) {
      console.log('no user removed');
    }
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
      console.log(socket.id, ' disconnected');
      let ssid = socket.id;
      let discon = userArray.find(discon => discon.socketId === ssid);
      let name = discon.name;
      console.log(name, 'disconnected');
      io.emit('userdisconn', name, ssid, userArray);
  }
    catch (err) {
      console.log('err-');
    }
  })
  
});
app.use(express.static(__dirname + '/main'));

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
