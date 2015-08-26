require('babel/register');


var core		= require('core');
var logger		= require('logger');
var server	= require('server');


core.on(core.INITED, () => server.start());
core.start();
