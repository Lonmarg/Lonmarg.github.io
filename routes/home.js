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
    context.subtitle = "pickles";
	pool.query("SELECT * FROM armylists", function(err, result)
	{
		if(err)
		{
			next(err);
			return;
		}
        
        context.headertext = JSON.stringify(result);

        res.render('home', context);
	});

});

module.exports = router;