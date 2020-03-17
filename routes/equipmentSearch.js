const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let pool = mysql.createPool({
	connectionLimit: 10,
	host: 'classmysql.engr.oregonstate.edu',
	user: 'cs340_wellheup',
	password: 'Akirr@5t@r5und3r',
	database: 'cs340_wellheup'
});

router.get('/equipmentSearch', function(req, res, next) {
	let context = {};
	let sql = "SELECT * FROM equipments";
	pool.query(sql, function(err, q_equipments){
		if(err){
			next(err);
			return;
		}
		context.equipments = q_equipments
		res.render('equipmentSearch', context);
	});
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	renderHomeContext(res, next);
});

module.exports = router;