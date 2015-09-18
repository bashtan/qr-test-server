var logger	= require('logger');
var express = require('express');
var app = express();
var url = require('url');

class Server {
	constructor() {
		this._clients = {};
		this._clientsCount = 0;
	}

	_register(id, cl_id, req,res, start_date) {
		if(!this._clients)
			this._clients = {};
		logger.save('db', {cl_id:cl_id, id:id, type:'open',start_date: start_date});
		this._clientsCount ++;

		this._clients[cl_id] = { req: req, res:res, cl_id: cl_id, name: this._getName() };
		this._clients[cl_id].start_date = start_date;

		res.writeHead(200, {
			'Content-Type': 'text/event-stream',  // <- Important headers
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		});
		res.write('\n');

		req.on('close', () =>  this._unregister(cl_id, id));


	}
	_getName(){
		var names = ['Алексий',
			'Алина',
			'Алена',
			'Маруся',
			'Афоний',
			'Всеволод'
			, 'Феодора'
			, 'Аксинья'
			, 'Габриела'
			, 'Парамон'
			, 'Ильгизар'
			, 'Генрих'
			, 'Евпраксия'
			, 'Ясон'
			, 'Искандер'];
		var max = names.length, min = 0;
		return names[Math.floor(Math.random() * (max - min)) + min];

	}
	_sendMess(cl){
		if(this._clientsCount > 0){
			var msg = Math.random();
			var act = [];
			for(cl in this._clients){
				act.push(this._clients[cl].name)
			}

			for(cl in this._clients){
				console.info('Message for -> '+this._clients[cl].name + ' active users('+this._clientsCount+') ['+act.join(', ')+']')
				this._clients[cl].res.write("data: Привет "+this._clients[cl].name + ' #' + msg + "\n\n");
			}

		}
	}

	_unregister(cl_id, id) {
		this._clientsCount --;

		if(!this._clients[cl_id]) return logger.log('No such connection');
		logger.save('db', {cl_id:cl_id, id:id, type:'close',start_date: this._clients[cl_id].start_date});

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
		        document.body.innerHTML = e.data + "<br>"; \
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
		setInterval(this._sendMess.bind(this), 2000);
		app.listen(3001);
	}
	stop() {
	}
}

module.exports = new Server();