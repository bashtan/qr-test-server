class Dispatcher {

	constructor() {
		this._events = {};
	}

	on(name, callback, context) {
		var events = this._events[name] || (this._events[name] = []);
		events.push({
			callback: callback,
			context: context || this
		});
		return this;
	}

	off(name, callback) {
		if(!name) {
			this._events = {};
			return this;
		}
		var retain = this._events[name];
		if(!retain) return this;
		this._events[name] = retain = retain.filter(({callback: func}) => callback !== func);
		if (!retain.length) delete this._events[name];
		return this;
	}

	emit(name, params) {
		var events = this._events[name];
		if (events) Dispatcher.emitEvents(events, params);
		return this;
	}

	static emitEvents(events, params) {
		events.forEach(({callback, context}) => {
			callback.call(context, params);
		});
	}
}

module.exports = Dispatcher;