var net = require('net');

var listenHost = process.env.HOST || '::';
var listenPort = process.env.PORT || 3219;
var localhost = '127.0.0.1';
var defaultPass = 'changeme';
var authRegex = /^AUTH ([^:]*|\[[0-9a-eA-E:]*\])(?::([^:]*)(?::(.*?))?)?$/;

function pipeAll(from, to, duplex) {
	from.pipe(to);
	from.on('end', to.end.bind(to));
	if (duplex) pipeAll(to, from);
}

function authClient(client, data) {
	var str = data.toString('utf8');
	var lines = str.split('\n');
	var m = authRegex.exec(lines[0]);
	if (!m) return client.end();
	var rest = lines.slice(1).join('\n');
	var host = m[1] || localhost;
	var port = Number(m[2]) || 3219;
	var pass = m[3] || defaultPass;
	if (host == defaultPass) {
		pass = host;
		host = localhost;
	}
	var local = client.remoteAddress + ':' + client.remotePort;
	console.log('connection from', local, 'to', [host, port, pass].join(':'))
	var conn = net.connect({
		host: host,
		port: port
	}, function() {
		conn.write('AUTH ' + pass + '\n' + rest);
		pipeAll(conn, client, true);
	}).on('error', function(e) {
		console.error(e);
		client.end();
	});
	client.on('close', function() {
		console.log('connection from', local, 'closed')
	});
}

var server = net.createServer(function(client) {
	client.once('data', authClient.bind(this, client));
});

server.listen(listenPort, listenHost);
