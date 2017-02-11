var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

var server = require('http').createServer(app);

app.use('/peerjs', ExpressPeerServer(server, { debug: true }));

app.use(express.static(__dirname + '/dist'));

app.listen(8080);
