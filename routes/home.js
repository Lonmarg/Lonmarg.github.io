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

router.get('/', function(req, res, next) {
    let context = {};
	context.subtitle = "pulldowns, UPDATES, DELETES not yet fully implemented";
	// FIND ALL ARMYLISTS
	let promiseGetArmylists = function(){
		let sql = "SELECT * FROM armylists";
		console.log("promiseGetArmyLists");
		return new Promise(function(resolve, reject){
			pool.query(sql, function(err, q_armylists){
				if(err){
					reject();
					next(err);
					return;
				}
				context.armylists = q_armylists;
				resolve(context);
			});
		});
	};

	let promiseGetSquads = function(context){
		let sql = "SELECT * FROM armylists_assaultsquads "+
		"INNER JOIN assaultsquads ON (armylists_assaultsquads.assaultsquadid = assaultsquads.id) " +
		"WHERE armylists_assaultsquads.armylistid = 1";
		console.log("promiseGetSquads");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				queriesToComplete +=1;
				pool.query(sql, function(err, q_assaultsquads){ //REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
					if(err){
						console.log("error in query to get assault squads");
						next(err);
						reject();
						return;
					}
					context.armylists[i].assaultsquads = q_assaultsquads;
					context.armylists[i].numAssaultSquads = context.armylists[i].assaultsquads.length;
					completedQueries++;
					if(completedQueries==queriesToComplete){
						resolve(context);
					}
				});
			}
		});
	};

	let promiseGetMarines = function(context){
		let sql = "SELECT * FROM assaultsquads_spacemarines "+
		"INNER JOIN spacemarines ON (assaultsquads_spacemarines.spacemarineid = spacemarines.id ) " +
		"WHERE assaultsquads_spacemarines.assaultsquadid = 1";
		console.log("promiseGetMarines");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					queriesToComplete +=1;
					pool.query(sql, function(err, q_spacemarines){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
						if(err){
							console.log("error in query to get marines in assault squads");
							reject();
							next(err);
							return;
						}
						context.armylists[i].assaultsquads[j].spacemarines = q_spacemarines;
						// COUNT UP POINT COST HERE
						completedQueries++;
						if(completedQueries == queriesToComplete){
							resolve(context);
						}
					});
				}
			}
		});
	};

	let promiseGetMarineWeapons = function(context){
		let sql = "SELECT equipments.name FROM spacemarines_equipments "+
		"INNER JOIN spacemarines ON (spacemarines_equipments.spacemarineid = spacemarines.id ) " +
		"INNER JOIN equipments ON (spacemarines_equipments.equipmentid = equipments.id ) " +
		"WHERE spacemarines_equipments.spacemarineid = 1";
		console.log("promiseGetMarineWeapons");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					for(let k=0; k<context.armylists[i].assaultsquads[j].spacemarines.length; k++){
						queriesToComplete +=1;
						pool.query(sql, function(err, q_weapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
							if(err){
								console.log("error in query to get marine weapons");
								reject();
								next(err);
								return;
							}
							context.armylists[i].assaultsquads[j].spacemarines[k].weapons = q_weapons;
							completedQueries++;
							if(completedQueries == queriesToComplete){
								resolve(context);
							}
						});
					}
				}
			}
		});
	};

	let promiseGetSergeants = function(context){
		let sql = "SELECT * FROM sergeants WHERE sergeants.assaultsquadid = 1";
		console.log("promiseGetSergeants");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					queriesToComplete +=1;
					pool.query(sql, function(err, q_sergeants){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
						if(err){
							console.log("error in query to get sergeants in assault squads");
							reject();
							next(err);
							return;
						}
						context.armylists[i].assaultsquads[j].sergeants = q_sergeants;
						completedQueries++;
						if(completedQueries == queriesToComplete){
							resolve(context);
						}
					});
				}
			}
		});
	};

	let promiseGetSergeantWeapons = function(context){
		let sql = "SELECT equipments.id, equipments.name FROM sergeants_equipments "+
		"INNER JOIN sergeants ON (sergeants_equipments.sergeantid = sergeants.id ) " +
		"INNER JOIN equipments ON (sergeants_equipments.equipmentid = equipments.id ) " +
		"WHERE sergeants_equipments.sergeantid = 1 AND NOT (equipments.is_sergeant_weapon = 0 AND equipments.is_special_weapon = 1)";
		console.log("promiseGetSergeantWeapons");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					for(let k=0; k<context.armylists[i].assaultsquads[j].sergeants.length; k++){
						queriesToComplete +=1;
						pool.query(sql, function(err, q_weapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
							if(err){
								console.log("error in query to get sergeant weapons");
								reject();
								next(err);
								return;
							}
							context.armylists[i].assaultsquads[j].sergeants[k].weapons = q_weapons;
							// TOTAL THIS SERGEANT'S POINT COST HERE
							completedQueries++;
							if(completedQueries == queriesToComplete){
								resolve(context);
							}
						});
					}
				}
			}
		});
	};

	let promiseGetSergeantSpecialEquipments = function(context){
		let sql = "SELECT equipments.id, equipments.name, equipments.point_cost FROM sergeants_equipments "+
		"INNER JOIN sergeants ON (sergeants_equipments.sergeantid = sergeants.id ) " +
		"INNER JOIN equipments ON (sergeants_equipments.equipmentid = equipments.id) " +
		"WHERE equipments.is_special_weapon = 1 AND equipments.is_sergeant_weapon = 0 AND sergeants_equipments.sergeantid = 1";
		console.log("promiseGetSergeantSpecialEquipments");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					for(let k=0; k<context.armylists[i].assaultsquads[j].sergeants.length; k++){
						queriesToComplete +=1;
						pool.query(sql, function(err, q_specials){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
							if(err){
								console.log("error in query to get special weapons");
								reject();
								next(err);
								return;
							}
							context.armylists[i].assaultsquads[j].sergeants[k].specials = q_specials;
							completedQueries++;
							if(completedQueries == queriesToComplete){
								resolve(context);
							}
						});
					}
				}
			}
		});
	};

	let promiseGetPossibleSergeantWeapons = function(context){
		let sql = "SELECT equipments.id, equipments.name, equipments.point_cost FROM equipments " +
		"WHERE equipments.is_special_weapon = 0";
		console.log("promiseGetPossibleSergeantWeapons");
		return new Promise(function(resolve, reject){
			queriesToComplete = 1;
			completedQueries = 0;
			pool.query(sql, function(err, q_possibleSergeantWeapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
				if(err){
					console.log("error in promiseGetPossibleSergeantWeapons");
					reject();
					next(err);
					return;
				}
				context.possibleSergeantWeapons = q_possibleSergeantWeapons;
				completedQueries++;
				if(completedQueries == queriesToComplete){
					resolve(context);
				}
			});
		});
	};

	let promiseGetPossibleBasicWeapons = function(context){
		let sql = "SELECT equipments.id, equipments.name, equipments.point_cost FROM equipments " +
		"WHERE equipments.is_special_weapon = 0 and equipments.is_sergeant_weapon = 0";
		console.log("promiseGetPossibleBasicWeapons");
		return new Promise(function(resolve, reject){
			pool.query(sql, function(err, q_possibleBasicWeapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
				if(err){
					console.log("error in promiseGetPossibleBasicWeapons");
					reject();
					next(err);
					return;
				}
				context.possibleBasicWeapons = q_possibleBasicWeapons;
				resolve(context);
			});
		});
	};

	let promiseGetPossibleSpecialWeapons = function(context){
		let sql = "SELECT equipments.id, equipments.name, equipments.point_cost FROM equipments " +
		"WHERE equipments.is_special_weapon = 0 and equipments.is_sergeant_weapon = 0";
		console.log("promiseGetPossibleSpecialWeapons");
		return new Promise(function(resolve, reject){
			pool.query(sql, function(err, q_possibleSpecialWeapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
				if(err){
					console.log("error in promiseGetPossibleSpecialWeapons");
					reject();
					next(err);
					return;
				}
				context.possibleSpecialWeapons = q_possibleSpecialWeapons;
				resolve(context);
			});
		});
	};

	promiseGetArmylists().then(function(context){
		return promiseGetSquads(context);		
	}).then(function(context){
		return promiseGetMarines(context);	
	}).then(function(context){
		return promiseGetMarineWeapons(context);	
	}).then(function(context){
		return promiseGetSergeants(context);	
	}).then(function(context){
		return promiseGetSergeantWeapons(context);	
	}).then(function(context){
		return promiseGetSergeantSpecialEquipments(context);	
	}).then(function(context){
		return promiseGetPossibleSergeantWeapons(context);	
	}).then(function(context){
		return promiseGetPossibleBasicWeapons(context);	
	}).then(function(context){
		return promiseGetPossibleSpecialWeapons(context);	
	}).then(function(context){
		res.render('home', context);
	});

});

module.exports = router;