var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.use(express.static(__dirname + '/dist'));

var server = app.listen(process.env.PORT || 8080);

app.use('/peerjs', ExpressPeerServer(server, { debug: true }));
