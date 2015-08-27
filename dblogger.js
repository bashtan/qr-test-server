var utils	= require('utils');
var fs = require("fs");
var config	= require('config');

var db = null;
var db_name = "";

var dblogger = {
	start: ()=> {

		if(!fs.existsSync(config.path.trm_logs)) fs.mkdirSync(config.path.trm_logs);

		db_name = config.path.trm_logs +  utils.timestamp('${year}${month}${date}' + '.db');
		var exists = fs.existsSync(db_name);
		if(!exists)fs.openSync(db_name, "w");

		var sqlite3 = require("sqlite3").verbose();
		db = new sqlite3.Database(db_name);

		if(!exists){
			db.serialize(function() {
				if(!exists) {
					db.run("CREATE TABLE trm_stat (cl_id TEXT, trm_id TEXT, connect_date TEXT, disconnect_date TEXT, connect_time INTEGER, message INTEGER)");
				}
			});
		}
	},
	stop: ()=> {
		db.close();
	},

	log: (trm_info) => {
		if(db_name != utils.timestamp('${year}${month}${date}' + '.db')){
			dblogger.stop();
			dblogger.start();
		}
		db.serialize(function() {
			switch (trm_info.type){
				case 'start':
					//insert
					var stmt = db.prepare("INSERT INTO trm_stat VALUES (?, ?,?,?,?,?)");
					stmt.run(trm_info.cl_id, trm_info.id, utils.timestamp('${date}.${month}.${year} ${hours}:${minutes}:${seconds}'), null,0,0);
					stmt.finalize();
					break;
				case 'message':
					//update
					var stmt = db.prepare("UPDATE trm_stat set message=1 WHERE cl_id=?");
					stmt.run(trm_info.cl_id);
					stmt.finalize();
					break;
				case 'close':
					//update
					var datediff = parseInt(Math.abs(trm_info.start_date.getTime() - new Date().getTime())/1000);
					var stmt = db.prepare("UPDATE trm_stat set disconnect_date=?, connect_time=?  WHERE cl_id=?");
					stmt.run(utils.timestamp('${date}.${month}.${year} ${hours}:${minutes}:${seconds}'), datediff, trm_info.cl_id);
					stmt.finalize();
					break;
			}

		});
	}
}
module.exports = dblogger;