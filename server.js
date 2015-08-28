var logger			= require('logger');
var WebSocketServer = new require('ws');
var webSocketServer = new WebSocketServer.Server({port: 3001});
var url = require('url');

class Server {
	constructor() {
		this._clients = {};
	}

	_register(id, cl_id, ws, start_date) {
		this._clients[cl_id] = { ws: ws };
		this._clients[cl_id].start_date = start_date;
		ws.on('close', () =>  this._unregister(cl_id, id));

		ws.on('message', event => {
			try{
				if(event == 'end') logger.save('db', {cl_id:cl_id,id:id, type:'message'});
				this._clients[cl_id].ws.send(event)
			}catch (e){
				this._unregister(cl_id);
			}
		});
	}

	_unregister(cl_id, id) {
		if(!this._clients[cl_id]) return logger.log('No such connection');
		logger.save('db', {cl_id:cl_id, id:id, type:'close',start_date: this._clients[cl_id].start_date});
		delete this._clients[cl_id];
	}

	start() {
		logger.save('all', 'Server started');

		webSocketServer.on('connection', ws=> {
			var cl_id = Math.random();
			var id = Math.random();
			try{
				var location = url.parse(ws.upgradeReq.url, true);
				id = location.query.id? location.query.id:Math.random();
			}catch(e){
				id = Math.random();
			}
			logger.save('db', {cl_id: cl_id, id:id, type:'start'});
			this._register(id, cl_id, ws, new Date());
		});
	}
	stop() {
	}
}

module.exports = new Server();