require('babel/register');


var core		= require('core');
var server	= require('server');


core.on(core.INITED, () => server.start());
core.start();
