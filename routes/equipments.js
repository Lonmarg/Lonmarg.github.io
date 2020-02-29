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

module.exports = router;