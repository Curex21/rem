'use strict'

var app = require('express')(),
	http = require('http').createServer(app),
	io = require('socket.io')(http),
	port = process.env.PORT || 3000,     //asigno un puerto de entrada a la conexion
	publicDir = `${__dirname}/public`   // direccion del directorio de los html cliente y servidor

  // servidor web escucha el puerto y envia mensaje de ejecución
  http.listen(port, () => {
	console.log('Iniciando Express y Socket.IO en localhost:%d', port)
})

// aplicación
  app
  // ruta de ciente , usuaros para ver el streaming
  	.get('/', (req, res) => {
      //
  		res.sendFile(`${publicDir}/client.html`)
  	})
  // ruta servidor, emisión de video por parte de usuarios
  	.get('/streaming', (req, res) => {
  		res.sendFile(`${publicDir}/server.html`)
  	})
// socket.io
io.on('connection', (socket) => {
	socket.on('streaming', (image) => {
		io.emit('play stream', image)
		//console.log(image)
	})
})
