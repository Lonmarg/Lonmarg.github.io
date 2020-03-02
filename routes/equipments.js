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
	
	context.jsscripts = ["deleteEntry.js"];
    
    pool.query("SELECT * FROM equipments", function(err, q_equipments)
	{
		if(err)
		{
			next(err);
			return;
		}
        context.equipments = q_equipments;

        res.render('equipments', context);
    });
});

router.delete('/:id', function(req, res) {
	let pool = mysql.createPool({
		connectionLimit: 10,
		host: 'classmysql.engr.oregonstate.edu',
		user: 'cs340_wellheup',
		password: 'Akirr@5t@r5und3r',
		database: 'cs340_wellheup'
    });
	
	//Figure out how to deal with dependencies where we delete an item that is currently being used
	
	var sql = "DELETE FROM equipments WHERE id = ?";
	var inserts = [req.params.id];
	sql = pool.query(sql, inserts, function(error, results, fields) {
		if(error) {
			console.log(error)
			res.write(JSON.stringify(error));
			res.status(400);
			res.end();
		} else {
			res.status(202).end();
		}
	})
})

router.post('/add', function(req, res) {
	
	console.log("Added a thing!");
	
	//Figure out how to parse the JSON data object!!!
	
	//console.log(JSON.parse(req.data));
	
	// let pool = mysql.createPool({
		// connectionLimit: 10,
		// host: 'classmysql.engr.oregonstate.edu',
		// user: 'cs340_wellheup',
		// password: 'Akirr@5t@r5und3r',
		// database: 'cs340_wellheup'
    // });
	
	// var sql = "DELETE FROM equipments WHERE id = ?";
	// var inserts = [req.params.id];
	// sql = pool.query(sql, inserts, function(error, results, fields) {
		// if(error) {
			// console.log(error)
			// res.write(JSON.stringify(error));
			// res.status(400);
			// res.end();
		// } else {
			// res.status(202).end();
		// }
	// })
})

module.exports = router;