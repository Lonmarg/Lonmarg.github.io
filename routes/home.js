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
    console.log("get/ is trying to query");
    
    var context = {};
	pool.query("SELECT * FROM armylists", function(err, result)
	{
		if(err)
		{
			next(err);
			return;
		}
		
		res.render('home', result);
        context.results = JSON.stringify(result);
	});
});

module.exports = router;