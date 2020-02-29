const express = require('express');
const router = express.Router();
const mysql = require('mysql');

router.get('/', function(req, res, next) {
	let pool = mysql.createPool({
		connectionLimit: 10,
		host: 'classmysql.engr.oregonstate.edu',
		user: 'cs340_wellheup',
		password: 'Akirr@5t@r5und3r',
		database: 'cs340_wellheup'
	});
   
    let context = {};
    context.subtitle = "THIS TEXT PROVES HANDLEBARS WORKS";
	pool.query("SELECT * FROM armylists", function(err, q_armylists)
	{
		if(err)
		{
			next(err);
			return;
		}
        context.stringOfArmylists = JSON.stringify(q_armylists);
        context.armylists = q_armylists;

        res.render('home', context);
    });

    //FOR EACH ARMYLIST
    //count number of squads and update context.armylist.numSquads
    //add the squad to the armylist's 

    //we need to make an ArmyLists_AssaultSquads table to get further than this
    // context.armylists.array.forEach(element => {
    //     pool.query("SELECT * FROM assaultsquads INNER JOIN WHERE ")
    // });
    

});

module.exports = router;