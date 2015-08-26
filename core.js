var config		= require('config');
var Dispatcher	= require('dispatcher');
var logger		= require('logger');

class Core extends Dispatcher {

	constructor() {
		super();
		this.INITED = 'inited';
	}



	start() {
		logger.info('Core started');
		this.emit(this.INITED);
	}

	stop() {
	}
}

module.exports = new Core();