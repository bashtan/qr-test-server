var logger			= require('logger');
var express = require('express');
var app = express();
var url = require('url');

class Server {
	constructor() {
		this._clients = {};
	}

	_register(id, cl_id, req,res, start_date) {
		if(!this._clients)
			this._clients = {};
		logger.save('db', {cl_id:cl_id, id:id, type:'open',start_date: start_date});

		this._clients[cl_id] = { req: req, res:res };
		this._clients[cl_id].start_date = start_date;

		res.writeHead(200, {
			'Content-Type': 'text/event-stream',  // <- Important headers
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		});
		res.write('\n');

		req.on('close', () =>  this._unregister(cl_id, id));

		this._clients[cl_id].int = setInterval(this._sendMess.bind(this, this._clients[cl_id]), 2000);
	}

	_sendMess(cl){
		var msg = Math.random();
		console.log('cl.req='+cl);
		console.log('cl.req='+cl.req);
		cl.res.write("data: "+ msg + "\n\n");
	}

	_unregister(cl_id, id) {
		if(!this._clients[cl_id]) return logger.log('No such connection');
		logger.save('db', {cl_id:cl_id, id:id, type:'close',start_date: this._clients[cl_id].start_date});
		clearInterval(this._clients[cl_id].int);
		delete this._clients[cl_id];
	}

	start() {
		logger.save('all', 'Server started');
		this._clients = null;
		var template = ' \
<!DOCTYPE html> <html> <body> \
	<script type="text/javascript"> \
		    var source = new EventSource("/events/"); \
		    source.onmessage = function(e) { \
		        document.body.innerHTML += e.data + "<br>"; \
		    }; \
</script> </body> </html>';

		app.get('/', function(req, res) {
			res.send(template);  // <- Return the static template above
		});


		app.get('/events/', (req, res) => {
			var cl_id = Math.random();
			var id = Math.random();
			this._register(id, cl_id, req, res, new Date());


		});
		app.listen(8080);
	}
	stop() {
	}
}

module.exports = new Server();