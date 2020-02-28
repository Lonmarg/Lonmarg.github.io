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
   
    var context = {};
	pool.query("SELECT * FROM armylists", function(err, result)
	{
		if(err)
		{
			next(err);
			return;
		}
        // context = JSON.stringify(result);
        // result.subtitle = "subtitle";
		
		// var stuffToDisplay = {};
		// stuffToDisplay.headertext = "I passed some stuff to handlebars via home.js!";
		
		// res.render('home', stuffToSend);
        //res.send('test text')
	});
	
	var stuffToDisplay = {};
	stuffToDisplay.headertext = "I passed some stuff to handlebars via home.js!";
		
	res.render('home', stuffToSend);
});

module.exports = router;