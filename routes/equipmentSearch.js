const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let pool = mysql.createPool({
	connectionLimit: 10,
	// host: 'classmysql.engr.oregonstate.edu',
	host: 'localhost',
	//user: 'cs340_wellheup',
	user: 'root',
	//password: 'Akirr@5t@r5und3r',
	database: 'cs340_wellheup'
});

router.get('/', function(req, res, next) {
	displayEquipments(req, res, next);
});

router.post('/', function(req, res, next) {
	if(req.body.Search){
		console.log('searching')
		searchEquipments(req, res, next);
	}
	else{
		displayEquipments(req, res, next);
	}
	
});

function displayEquipments(req, res, next){
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
}

function searchEquipments(req, res, next){
	if(req.body.is_sergeant_weapon){
		req.body.is_sergeant_weapon=1;
	}
	else{
		req.body.is_sergeant_weapon=0;
	}
	if(req.body.is_special_weapon){
		req.body.is_special_weapon=1;
	}
	else{
		req.body.is_special_weapon=0;
	}
	let context = {};
	let sql = "SELECT * FROM equipments WHERE id"+req.body.idMod+"? AND is_sergeant_weapon=? AND is_special_weapon=? AND point_cost"+req.body.point_costMod+"?";
	pool.query(sql, [req.body.id, req.body.is_sergeant_weapon, req.body.is_special_weapon, req.body.point_cost], function(err, q_equipments){
		if(err){
			next(err);
			return;
		}
		context.equipments = q_equipments
		res.render('equipmentSearch', context);
	});
}

module.exports = router;