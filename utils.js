
var query = context => {
	return name => {
		let path = name.split('.');
		let result  = context[name];
		let inside = context;
		for (let i = 0; i < path.length; i++) {
			inside = inside[path[i]];
			if(!inside) break;
			result = inside;
		};
		return result;
	};
};

var regexp = /\$\{[^}]*\}/g;
var template = template => {
	return context => {
		return template.replace(regexp, coincidence => {
			let path = coincidence.replace(/\$\{(.*?)\}/, '$1');
			let result = query(context)(path);
			if(!result) result = coincidence;
			return result;
		});
	};
};

var timestamp = format => {
	var now = new Date();
	var date = {};

	date.date = now.getDate();
	if(date.date < 10) date.date = '0' + date.date;
	date.month = now.getMonth() + 1;
	if(date.month < 10) date.month = '0' + date.month;
	date.year = now.getFullYear();

	date.hours = now.getHours();
	if(date.hours < 10) date.hours = '0' + date.hours;
	date.minutes = now.getMinutes();
	if(date.minutes < 10) date.minutes = '0' + date.minutes;
	date.seconds = now.getSeconds();
	if(date.seconds < 10) date.seconds = '0' + date.seconds;

	return template(format || '${date}.${month}.${year} ${hours}:${minutes}:${seconds}')(date);
};

var possible = "-=_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


var level = exp => {
	return Math.ceil(Math.abs(0.3 * Math.pow(Math.abs(exp + 1), 0.5) - 0.6));
};


module.exports = {
	timestamp:				timestamp,
	template:				template,
	query:					query
};