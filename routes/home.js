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
   renderHomeContext(res, next);
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	if(req.body.updateArmylist){//update query
		updateArmylist(req, res, next);
	}
	else if(req.body.removeArmylist){//delete query
		removeArmylist(req, res, next);
	}
	else if(req.body.addArmylist){//add query
		addArmylist(req, res, next);
	}
	else if(req.body.updateAssaultSquad){
		updateAssaultSquad(req, res, next);
	}
	else if(req.body.removeAssaultSquad){
		removeAssaultSquad(req, res, next);
	}
	else if(req.body.addAssaultSquad){
		addAssaultSquad(req, res, next);
	}
	// else if(req.body.updateSergeant){

	// }
	// else if(req.body.removeSergeant){

	// }
	else if(req.body.addSergeant){
		addSergeant(req, res, next);
	}
	// else if(req.body.removeSpecialEquipment){
	// 	//this should associate/dissociate the equip from the unit
	// }
	// else if(req.body.addSpecialEquipment){
	// 	//this should associate/dissociate the equip from the unit
	// }
	// else if(req.body.updateMarine){

	// }
	// else if(req.body.removeMarine){

	// }
	// else if(req.body.addMarine){

	// }
	else{
	renderHomeContext(res, next);
	}

});

function renderHomeContext(res, next){
	let context = {};
	context.subtitle = "pulldowns, and add/remove/updating marines or sergants still don't work";
	// FIND ALL ARMYLISTS
	let promiseGetArmylists = function(){
		let sql = "SELECT * FROM armylists";
		//console.log("promiseGetArmyLists");
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
		"WHERE armylists_assaultsquads.armylistid = (?)";
		//console.log("promiseGetSquads");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				queriesToComplete +=1;
				pool.query(sql, [context.armylists[i].id], function(err, q_assaultsquads){ //REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
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
		"WHERE assaultsquads_spacemarines.assaultsquadid = (?)";
		//console.log("promiseGetMarines");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					queriesToComplete +=1;
					pool.query(sql, [context.armylists[i].assaultsquads[j].assaultsquadid], function(err, q_spacemarines){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
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
		"WHERE spacemarines_equipments.spacemarineid = (?)";
		//console.log("promiseGetMarineWeapons");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					for(let k=0; k<context.armylists[i].assaultsquads[j].spacemarines.length; k++){
						queriesToComplete +=1;
						pool.query(sql, [context.armylists[i].assaultsquads[j].spacemarines[k].id], function(err, q_weapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
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
		let sql = "SELECT * FROM sergeants WHERE sergeants.assaultsquadid = (?)";
		//console.log("promiseGetSergeants");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					queriesToComplete +=1;
					pool.query(sql, [context.armylists[i].assaultsquads[j].id], function(err, q_sergeants){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
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
		"WHERE sergeants_equipments.sergeantid = (?) AND NOT (equipments.is_sergeant_weapon = 0 AND equipments.is_special_weapon = 1)";
		//console.log("promiseGetSergeantWeapons");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					for(let k=0; k<context.armylists[i].assaultsquads[j].sergeants.length; k++){
						queriesToComplete +=1;
						pool.query(sql, [context.armylists[i].assaultsquads[j].sergeants[k].id], function(err, q_weapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
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
		"WHERE equipments.is_special_weapon = 1 AND equipments.is_sergeant_weapon = 0 AND sergeants_equipments.sergeantid = (?)";
		//console.log("promiseGetSergeantSpecialEquipments");
		return new Promise(function(resolve, reject){
			queriesToComplete = 0;
			completedQueries = 0;
			for(let i=0; i< context.armylists.length; i++){
				for(let j=0; j<context.armylists[i].assaultsquads.length; j++){
					for(let k=0; k<context.armylists[i].assaultsquads[j].sergeants.length; k++){
						queriesToComplete +=1;
						pool.query(sql, [context.armylists[i].assaultsquads[j].sergeants[k].id], function(err, q_specials){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
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
		//console.log("promiseGetPossibleSergeantWeapons");
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
		//console.log("promiseGetPossibleBasicWeapons");
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
		//console.log("promiseGetPossibleSpecialWeapons");
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
}

function updateArmylist(req, res, next){
	pool.query("SELECT * FROM armylists WHERE id=?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			let curVals = result[0];
			pool.query("UPDATE armylists SET name=? WHERE id=?",
				[req.body.armyName || curVals.name, req.body.id],
				function(err, result){
				if(err){
					next(err);
					return;
				}
				renderHomeContext(res, next);
			});
		}
	});
}

function removeArmylist(req, res, next){
	pool.query("SELECT * FROM armylists WHERE armylists.id=?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			let curVals = result[0];
			pool.query("DELETE FROM armylists WHERE armylists.id=?",	[req.body.id], function(err, result){
				if(err){
					next(err);
					return;
				}
				renderHomeContext(res, next);
			});
		}
	});
}

function addArmylist(req, res, next){
	pool.query("INSERT INTO armylists (armylists.name) VALUES (?)",
		[req.body.armyName],
		function(err, result){
		if(err){
			next(err);
			return;
		}
		renderHomeContext(res, next);
	});
}

function updateAssaultSquad(req, res, next){
	pool.query("SELECT * FROM assaultsquads WHERE id=?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			let curVals = result[0];
			if(req.body.hasjumppacks == 'on'){
				req.body.hasjumppacks = 1;
			}
			else{
				req.body.hasjumppacks = 0;
			}
			pool.query("UPDATE assaultsquads SET name=?, has_jumppacks=? WHERE id=?",
				[req.body.squadName || curVals.name, req.body.hasjumppacks, req.body.id],
				function(err, result){
				if(err){
					next(err);
					return;
				}
				renderHomeContext(res, next);
			});
		}
	});
}

function removeAssaultSquad(req, res, next){
	pool.query("SELECT * FROM assaultsquads WHERE assaultsquads.id=?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			let curVals = result[0];
			pool.query("DELETE FROM assaultsquads WHERE assaultsquads.id=?",	[req.body.id], function(err, result){
				if(err){
					next(err);
					return;
				}
				renderHomeContext(res, next);
			});
		}
	});
}

function addAssaultSquad(req, res, next){
	if(req.body.hasjumppacks == 'on'){
		req.body.hasjumppacks = 1;
	}
	else{
		req.body.hasjumppacks = 0;
	}
	pool.query("INSERT INTO assaultsquads (assaultsquads.name, assaultsquads.has_jumppacks) VALUES (?, ?)",
		[req.body.squadName, req.body.hasjumppacks],
		function(err, result){
		if(err){
			next(err);
			return;
		}
		pool.query("INSERT INTO armylists_assaultsquads (armylistid, assaultsquadid) VALUES (?, ?)",
			[req.body.armylistid, result.insertId],
			function(err, result){
			if(err){
				next(err);
				return;
			}
			renderHomeContext(res, next);
		});
	});
}

function updateSergeant(req, res, next){
	pool.query("SELECT * FROM sergeants WHERE id=?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			let curVals = result[0];
			pool.query("UPDATE sergeants SET name=? WHERE id=?",
				[req.body.sergeantName || curVals.name, req.body.id],
				function(err, result){
				if(err){
					next(err);
					return;
				}
				
				//query sergeants_equipments about entry with sergeantid and weaponid
				//update that weaponid to be new one
				pool.query("SELECT * FROM sergeants_equipments WHERE sergeantid=? AND equipmentid=?", [req.body.id, ], function(err, result){
					if(err){
						next(err);
						return;
					}
					if(result.length == 1){
						let curVals = result[0];
						pool.query("UPDATE sergeants SET name=? WHERE id=?",
							[req.body.squadName || curVals.name, req.body.id],
							function(err, result){
							if(err){
								next(err);
								return;
							}
							
							//query sergeants_equipments about entry with sergeantid and weaponid
							//update that weaponid to be new one
							renderHomeContext(res, next);
						});
					}
				});
			});
		}
	});
}

function removeSergeant(req, res, next){
	pool.query("SELECT * FROM sergeants WHERE sergeants.id=?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			let curVals = result[0];
			pool.query("DELETE FROM sergeants WHERE sergeants.id=?",	[req.body.id], function(err, result){
				if(err){
					next(err);
					return;
				}
				renderHomeContext(res, next);
			});
		}
	});
}

function addSergeant(req, res, next){
	pool.query("INSERT INTO sergeants (sergeants.name, sergeants.assaultsquadid) VALUES (?, ?)",
		[req.body.sergeantName, req.body.assaultsquadid],
		function(err, result){
		if(err){
			next(err);
			return;
		}
		newSergent = result;
		pool.query("INSERT INTO sergeants_equipments (sergeantid, equipmentid) VALUES (?, ?)",
			[newSergent.insertId, req.body.weapon1],
			function(err, result){
			if(err){
				next(err);
				return;
			}
			pool.query("INSERT INTO sergeants_equipments (sergeantid, equipmentid) VALUES (?, ?)",
				[newSergent.insertId, req.body.weapon2],
				function(err, result){
				if(err){
					next(err);
					return;
				}
				renderHomeContext(res, next);
			});
		});
	});
}

module.exports = router;