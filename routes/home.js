const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_wellheup',
    password: 'Akirr@5t@r5und3r',
    database: 'cs340_wellheup'
});

// router.get('/', function(req, res, next) {
// 		let pool = mysql.createPool({
// 		connectionLimit: 10,
// 		host: 'classmysql.engr.oregonstate.edu',
// 		user: 'cs340_wellheup',
// 		password: 'Akirr@5t@r5und3r',
// 		database: 'cs340_wellheup'
// 	});

// 	pool.query("SELECT * FROM armylists", function(err, result)
// 	{
// 		if(err) throw err;
		
		
// 		res.render('equipments', result);

// 	});
// });

// app.get('/', function(req, res, next) {
// 	let context = {};
// 	context.planSubtitle="please show up";
//     pool.query('SELECT * FROM armylists', function(err, rows, fields) {
//         if (err) {
//             next(err + "/");
//             return;
//         }
//         // context.results = JSON.stringify(rows);
// 		res.render('equipments', context);
//     });
// });

router.post('/', function (req, res) {
    let context = {};
    context.planSubtitle="Home";
    context.this ="Hello";
  
    res.render('home', context);
  });

module.exports = router;