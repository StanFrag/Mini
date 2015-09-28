/*************************************
//
// bonebreaker app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var device  = require('express-device');
var Q  = require('q');
var PF = require('pathfinding');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Factory = require('./routes/schemas.js');

/*
// Connection a la base de donnée
mongoose.connect('mongodb://localhost/Mini', function(err) {
  if (err) { throw err; }
});

// recuperation de la connection
var db = mongoose.connection;

var mapCollection = db.collection('maps');

//Lets try to Find a user
mapCollection.findOne({title: 'Test 1'}, function (err, map) {
  if (err) {
    console.log(err);
  } else {
  	console.log(map);
  }
});
*/

// Socket
require('./routes/socket.js')(io, Q, PF);

// Serveur
var runningPortNumber = process.env.PORT;

console.log("lancement");

app.configure(function(){
	// I need to access everything in '/public' directly
	app.use(express.static(__dirname + '/public'));

	//set the view engine
	app.set('view engine', 'ejs');
	app.set('views', __dirname +'/views');

	app.use(device.capture());
});


// logs every request
app.use(function(req, res, next){
	// output every request in the array
	console.log({method:req.method, url: req.url, device: req.device});

	// goes onto the next function in line
	next();
});

app.get("/", function(req, res){
	res.render('index', {});
});

server.listen(runningPortNumber || 3000);
console.log("Server started at port", runningPortNumber || 3000);

