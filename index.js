var express = require('express')
	, stylus = require('stylus')
	, nib = require('nib')
	, sio = require('socket.io')
	, fs = require('fs');

var app = express.createServer();

app.configure(function () {
	app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
	app.use(express.static(__dirname + '/public'));
	app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });
	app.set('views', __dirname);
	app.set('view engine', 'jade');

	function compile (str, path) {
		return stylus(str)
			.set('filename', path)
			.use(nib());
	};
});

app.get('/', function (req, res) {
	res.render('index', { layout: false });
});

app.get('/login', function (req, res){
	try{
		var sid = req.query.sid;
		var pw = req.query.pw;
		res.send('0');
	}catch (e){
		res.send('ERROR');
	}
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	var addr = app.address();
	console.log('   app listening on http://' + addr.address + ':' + addr.port);
});

var io = sio.listen(app);

io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 20);
});

var port = 5000;
if (process.env.PORT) {
	port = Number(process.env.PORT);
}

io.sockets.on('connection', function (socket) {

	socket.on('order', function (data) {
		console.log("@@@@@@@@@@@@@@@@@@>>"+data.uid);
		socket.broadcast.emit('print', {'uid':data.uid});
	});

	socket.on('disconnect', function (data) {
	});

});
