const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

// variable de la sala
var sala = [];
// variable de los usuarios conectados a la sala
var usuariosConectados = 1;
// variable de los usuarios
var usuarios = [];

io.on('connection', (socket) => {

  // funcion para dcuando se desconecta un usuario
  socket.on('disconnect', () => {

    usuariosConectados--;
    var userIndex = usuarios.indexOf(socket.username);
    sala.splice(userIndex, 1);
    io.to(socket.room).emit('userHasDisconnected', socket.username);
    io.to(socket.room).emit('usersConnected', sala);
    io.to(socket.room).emit('numUsersConnected', usuariosConectados);
    
  });

  // funcion para cuando se conecta un usuario o se cambia el nombre
  socket.on('setUsername', (userData)=>{
    socket.username = userData.username;

    datoNombre = {nuevoNombre: userData.username, antiguoNombre: socket.username};

    socket.username = userData.username;
    socket.room = userData.room;

    socket.join(userData.room);

    usuariosConectados++;
    sala.push({userID: socket.id, username: socket.username, userImg: userData.userImg})
    io.to(socket.room).emit('userHasConnected', socket.username);
    io.to(socket.room).emit('usersConnected', sala);
    io.to(socket.room).emit('numUsersConnected', usuariosConectados);
    
  })

  // funcion para cuando se envia un mensaje
  socket.on('message', (msg)=>{
    datosMsg = {username: socket.username, clientID: socket.clientID, serverID: socket.id, msg: msg.msg, time: msg.time}
    io.to(socket.room).emit('message', datosMsg);
  });

  // funcion para cuando se esta escribiendo
  socket.on("userTyping", (data)=>{
    io.emit('userTyping', {userID: socket.id, isTyping: data.isTyping});
  })
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})