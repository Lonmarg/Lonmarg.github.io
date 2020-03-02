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
	context.subtitle = "THIS TEXT PROVES HANDLEBARS WORKS";
	// FIND ALL ARMYLISTS
	pool.query("SELECT * FROM armylists", function(err, q_armylists)
	{
		if(err){
			next(err);
			return;
		}
		else{
			context.armylists = q_armylists;
			// FIND ALL SQUADS IN EACH ARMYLIST
			// NOTE: WE COULD MAKE BETTER USE OF CALLBACKS IF WE PUT EACH QUERY IN A next() statement and named them outside the current query
			context.armylists.forEach(armylist => {
				pool.query("SELECT * FROM armylists_assaultsquads "+
					"INNER JOIN assaultsquads ON (armylists_assaultsquads.assaultsquadid = assaultsquads.id) " +
					"WHERE armylists_assaultsquads.armylistid = 1", function(err, q_assaultsquads){ //REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
					if(err){
						next(err);
						return;
					}
					else{
						armylist.assaultsquads=q_assaultsquads;
						// FIND ALL MARINES IN EACH SQUAD
						armylist.assaultsquads.forEach(assaultsquad => {
							pool.query("SELECT * FROM assaultsquads_spacemarines "+
								"INNER JOIN spacemarines ON (assaultsquads_spacemarines.spacemarineid = spacemarines.id ) " +
								"WHERE assaultsquads_spacemarines.assaultsquadid = 1", function(err, q_spacemarines){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
								if(err){
									next(err);
									return;
								}
								else{
									assaultsquad.spacemarines=q_spacemarines;
									// FIND ALL WEAPONS FOR EACH MARINE IN SQUAD
									assaultsquad.spacemarines.forEach(spacemarine => {
										pool.query("SELECT * FROM spacemarines_equipments "+
											"INNER JOIN spacemarines ON (spacemarines_equipments.spacemarineid = spacemarines.id ) " +
											"WHERE spacemarines_equipments.spacemarineid = 1", function(err, q_weapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
											if(err){
												next(err);
												return;
											}
											else{
												spacemarine.weapons=q_weapons;
											}
										});
									})
								}
							});
							// !!!!!! PERHAPS WE SHOULD ADD A CONDITIONAL HERE FOR WHETHER OR NOT THE SQUAD HAS A SERGEANT?
							// FIND SQUAD SERGEANT
							pool.query("SELECT * FROM sergeants WHERE sergeants.assaultsquadid = 1", function(err, q_sergeants){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION using asaultsquad.id
								if(err){
									next(err);
									return;
								}
								else{
									assaultsquad.sergeants=q_sergeants;
									// FIND ALL WEAPONS FOR EACH MARINE IN SQUAD
									assaultsquad.sergeants.forEach(sergeant => {
										pool.query("SELECT * FROM sergeants_equipments "+
											"INNER JOIN sergeants ON (sergeants_equipments.sergeantid = sergeants.id ) " +
											"WHERE sergeants_equipments.sergeantid = 1", function(err, q_weapons){//REPLACE THE 1 WITH A QUESTION MARK FOR DYNAMIC INTERPRETATION
											if(err){
												next(err);
												return;
											}
											else{
												sergeant.weapons=q_weapons;
											}
										});
									})
									// !!!! ADD A SPECIAL QUERY FOR SPECIAL EQUIPMENTS
								}
							});
						})
					}
				});
			})
		}
        context.stringOfArmylists = JSON.stringify(q_armylists);
        
        res.render('home', context);
    });
});

module.exports = router;