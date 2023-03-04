const express = require('express')
const app = express()
const port = 3000
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

userConnected = 0;

app.use(express.static('public2'));

// app.get('/', (req, res) => {
//   res.send('<h1>Segunda prueba con NodeJS</h1>')
// })
var listaUsuarios = [];
io.on('connection', (socket) => {
    userConnected++;
    console.log('Numero de usuarios conectados: ' + userConnected);
    socket.nombre='';

    socket.on('ponmeNombre', (nombre) => {
       console.log('Nombre: ' + nombre);

       if(socket.nombre == ""){
        listaUsuarios.push(nombre);
       }
       else{
        var pos = listaUsuarios.indexOf(socket.nombre)
        listaUsuarios[pos] = nombre;
       }
           
        socket.nombre = nombre;

        io.emit('nuevoUsuarioEnServidor', listaUsuarios);
    });

    socket.on('mensaje', function (data) {
    
        datosMensaje = {
            nombre: socket.nombre,
            mensaje: data
        }
        io.emit('mensajeServidor', datosMensaje);
    });
    

    socket.on('disconnect', () => {
        userConnected--;
        console.log(`Usuario ${socket.nombre} desconectado`);
    });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})