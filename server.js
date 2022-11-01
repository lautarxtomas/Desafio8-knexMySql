import * as io from "socket.io";
import express from 'express';
import { createServer } from 'http';

import ClienteSql from './sql.js'
import { options } from './options/mysql.js';
import { options2 } from './options/SQLite3.js';

const app = express(); 
const server = createServer(app); 
const socketIo = new io.Server(server);

const sql = new ClienteSql(options);
const sqlite = new ClienteSql(options2);

sqlite.crearTabla()
sql.crearTablaMessage()

let mensajes = [];
let productos = [];

app.use(express.static('public'));

socketIo.on('connection', function(socket){
    console.log('Un cliente se ha conectado')
    socket.emit('mensajes', mensajes)
    socket.emit('productos', productos)

    socket.on('nuevo-mensaje', async function(data) {
        mensajes.push(data)
        await sqlite.saveMessage(data)
        socketIo.sockets.emit('mensajes', mensajes);
    });

    socket.on('nuevo-producto', async function(data){
        productos.push(data)
        await sql.save(data)
        socketIo.sockets.emit('productos', productos);
    })
});

const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))