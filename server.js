var logger			= require('logger');
var WebSocketServer = new require('ws');
var webSocketServer = new WebSocketServer.Server({port: 3001});
var url = require('url');

class Server {
	constructor() {
		this._clients = {};
	}

	_register(id, ws) {
		logger.log('Terminal ' + id + ' registered');
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
		logger.log('Terminal ' + id + ' unregistered');
		delete this._clients[id];
	}

	start() {
		logger.info('Server started');
		logger.save('terminal', "asdasd");
		webSocketServer.on('connection', ws=> {
			var location = url.parse(ws.upgradeReq.url, true);
			var id = location.query.id ? location.query.id :Math.random();
			this._register(id, ws);
		});
	}
	stop() {


	}
}

module.exports = new Server();