const express = require('express');
const router = express.Router();
const mysql = require('mysql');

router.get('/', function(req, res, next) {
	console.log("get/ is running from home.js");
	let pool = mysql.createPool({
		connectionLimit: 10,
		host: 'classmysql.engr.oregonstate.edu',
		user: 'cs340_wellheup',
		password: 'Akirr@5t@r5und3r',
		database: 'cs340_wellheup'
	});

	pool.query("SELECT * FROM armylists", function(err, result)
	{
		if(err)
		{
			next(err);
			return;
		}
		
		res.render('home', result);

	});
});

module.exports = router;