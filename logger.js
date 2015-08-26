var config	= require('config');
var debug	= require('debug');
var fs		= require('fs');
var utils	= require('utils');

var levels = {};

var logger = {
	log:		debug('log'),
	info:		debug('info'),
	warn:		debug('warn'),
	error:		debug('error'),
	file:		debug('file'),
	save:		(level, ...params) => {
		if(!fs.existsSync(config.path.trm_logs)) fs.mkdirSync(config.path.trm_logs);
		var stream = levels[level] || fs.createWriteStream(config.path.logs[level] || config.path.trm_logs + utils.timestamp('${year}${month}${date}')+ '_' + level + '.log', { flags : 'a' });
		stream.write(utils.timestamp('${hours}:${minutes}:${seconds}') + ' ' + params.toString().replace(/\n/g, '') + '\n');
	}
};
logger.log.color		= 6;
logger.info.color		= 2;
logger.warn.color		= 5;
logger.error.color		= 1;
logger.file.color		= 4;

module.exports = logger;