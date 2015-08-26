var logger			= require('logger');
var WebSocketServer = new require('ws');
var webSocketServer = new WebSocketServer.Server({port: 3001});
var url = require('url');

class Server {
	constructor() {
		this._clients = {};
	}

	_register(id, ws) {
		this._clients[id] = { ws: ws };
		ws.on('close', () =>  {
			this._unregister(id);
		});

		ws.on('message', event => {
			try{
				this._clients[id].ws.send(event)
			}catch (e){
				this._unregister(id);
			}
		});
	}

	_unregister(id) {
		if(!this._clients[id]) return logger.log('No such connection');
		logger.save('terminal', id + ' disconnected');
		delete this._clients[id];
	}

	start() {
		logger.save('all', 'Server started');

		webSocketServer.on('connection', ws=> {
			var location = url.parse(ws.upgradeReq.url, true);
			var id = location.query.id ? location.query.id :Math.random();
			logger.save('terminal', id + ' connected');
			this._register(id, ws);
		});
	}
	stop() {
	}
}

module.exports = new Server();