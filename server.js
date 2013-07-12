var nb = require('vim-netbeans');
var net = require('net');

var listenHost = process.env.HOST || '::';
var listenPort = process.env.PORT || 3219;
var localhost = '127.0.0.1';
var defaultPass = 'changeme';
var passwordRegex = /^([^:]*|\[[0-9a-eA-E:]*\])(?::([^:]*)(?::(.*?))?)?$/;

function pipeAll(from, to, duplex) {
	from.pipe(to);
	from.on('end', to.end.bind(to));
	if (duplex) {
		pipeAll(to, from);
	}
}

var server = new nb.VimServer({debug: true});
server.on('clientAuthed', function (client, password) {
	var m = passwordRegex.exec(password);
	var host = m[1] || localhost;
	var port = Number(m[2]) || 3219;
	var pass = m[3] || defaultPass;
	if (host == defaultPass) {
		pass = host;
		host = localhost;
	}
	console.log('host', host, 'port', port, 'pass', pass);
	var conn = net.connect({
		host: host,
		port: port
	}, function() {
		console.log('opened');
		client.socket.pipe(conn);
		conn.write('AUTH ' + pass + '\n');
	}).on('error', function(e) {
		console.error(e);
	});
	pipeAll(conn, client.socket, true);
	client._cleanup();
});

server.listen(listenPort, listenHost);
