//set up Express
var express = require('express');
var app = express();

//set up handlebars
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Server credentials
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs290_wellheup',
    password: '9378',
    database: 'cs290_wellheup'
});
//set port to use
app.set('port', 4361);

//require path to navigate folders
var path = require('path');
//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

//include body parser so we can parse the bodies of post requests...
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    console.log("I decided to run get/");
    var context = {};
    context.pgTitle = "IT LIVES!";
    // pool.query('SELECT * FROM workouts', function(err, rows, fields) {
    //     if (err) {
    //         next(err + "/showall");
    //         return;
    //     }
    //     context.results = JSON.stringify(rows);
    //     context.table = rows;
    // });
    // pool.query("SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema='cs290_wellheup' AND table_name='workouts'", function(err, columns, fields) {
    //     if (err) {
    //         next(err);
    //         return;
    //     }
    //     context.columns = columns;
    //     context.columns.shift();
    //     res.render('home', context);
    // });
    res.render('home', context);
});

/*[DOESN'T WORK FOR SOME REASON?]
app.get('/members', (req, res, next)=>{
	res.json(pool.workouts);
});*/

// app.get('/add-exercise', (req, res, next) => {
//     var context = {};
//     //pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES ('burpees', '10', '100', '2019-9-9', 'FALSE')", function (err, result){
//     pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result) {
//         if (err) {
//             next(err + " /add-exercise");
//             return;
//         }
//         context.results = "Inserted id " + result.id;
//     });
//     pool.query("SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema='cs290_wellheup' AND table_name='workouts'", function(err, columns, fields) {
//         if (err) {
//             next(err + " /add-exercise");
//             return;
//         }
//         context.columns = columns;
//         context.columns.shift();
//         context.planSubtitle = "New Entry Added";
//         res.render('home', context);
//     });
// });

// app.get('/:id', (req, res, next) => {
//     var context = {};
//     pool.query('SELECT * FROM workouts WHERE id = (?)', req.params.id, function(err, rows, fields) {
//         if (err) {
//             next(err + " /:id");
//             return;
//         }
//         context.results = JSON.stringify(rows);
//     });
//     pool.query("SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema='cs290_wellheup' AND table_name='workouts'", function(err, columns, fields) {
//         if (err) {
//             next(err + " /:id");
//             return;
//         }
//         context.columns = columns;
//         context.columns.shift();
//         context.planSubtitle = "Showing exercise:" + context.columns[0].id;
//         res.render('home', context);
//     });
// });

// /*app.get('/showall', (req, res, next) => {
//     var context = {};
//     context.pgTitle = "Test showall";
//     pool.query('SELECT * FROM workouts', function(err, rows, fields) {
//         if (err) {
//             next(err + " /showall");
//             return;
//         }
//         context.results = JSON.stringify(rows);
//         context.table = rows;
//         res.render('home', context);
//     });
// });*/

// app.get('/reset-table', function(req, res, next) {
//     var context = {};
//     pool.query("DROP TABLE IF EXISTS workouts", function(err) {
//         //replace your connection pool with the your variable containing the connection pool
//         var createString = "CREATE TABLE workouts(" +
//             "id INT PRIMARY KEY AUTO_INCREMENT," +
//             "name VARCHAR(255) NOT NULL," +
//             "reps INT," +
//             "weight INT," +
//             "date DATE," +
//             "lbs BOOLEAN)";

//         pool.query(createString, function(err) {
//             context.planSubtitle = "Table Reset";
//             res.render('home', context);
//         });
//     });
// });

// function next(err) {
//     console.log(err);
// } //[TEST PURPOSES ONLY]

app.post('/', (req, res, next) => {
    var context = {};
    // if (req.body['Add Exercise']) {
    //     console.log("Add Exercise");
    //     pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result, fields) {
    //         if (err) {
    //             next(err + " /add-exercisepost");
    //             return;
    //         }
    //         console.log("inserted id " + JSON.stringify(result.id));
    //         context.planSubtitle = "Exercise Added";
    //     });
    // } if (req.body['Edit Exercise']) {
    //     console.log("Edit Exercise");
    //     pool.query("SELECT * FROM workout WHERE id=?", [req.body.id], function(err, result) {
    //         if (err) {
    //             next(err);
    //             return;
    //         }
    //         if (result.length == 1) {
    //             var curVals = result[0];
    //             pool.query("UPDATE workout SET (name=?, reps=?, weight=?, date=?, lbs=?) WHERE id=? ", [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.lbs || curVals.lbs, req.body.id],
    //                 function(err, result) {
    //                     if (err) {
    //                         next(err);
    //                         return;
    //                     }
    //                     context.results = "Updated " + result.changedRows + " rows.";
    //                     context.planSubtitle = "Exercise Update";
    //                 });
    //         }
    //     });
    // } if (req.body["Delete Exercise"]) {
    //     console.log("Delete Exercise");
    //     pool.query('DELETE * FROM workouts WHERE id = (?)', req.body.id, function(err, rows, fields) {
    //         if (err) {
    //             next(err + " /:id");
    //             return;
    //         }
    //         context.planSubtitle = "Exercise Update";
    //     });
    // } if (req.body['Reset Table']) {
    //     console.log("Reset Table");
    //     pool.query("DROP TABLE IF EXISTS workouts", function(err) {
    //         //replace your connection pool with the your variable containing the connection pool
    //         var createString = "CREATE TABLE workouts(" +
    //             "id INT PRIMARY KEY AUTO_INCREMENT," +
    //             "name VARCHAR(255) NOT NULL," +
    //             "reps INT," +
    //             "weight INT," +
    //             "date DATE," +
    //             "lbs BOOLEAN)";

    //         pool.query(createString, function(err) {});
    //         context.planSubtitle = "Table Reset";
    //         //res.render('home', context);
    //     });
    // } 
    // // else {
    // //     context.planSubtitle("Failed attempted action");
    // // }
    // pool.query('SELECT * FROM workouts', function(err, rows, fields) {
    //     if (err) {
    //         next(err + " /");
    //         return;
    //     }
    //     context.results = JSON.stringify(rows);
    //     context.table = rows;
    // });
    // pool.query("SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema='cs290_wellheup' AND table_name='workouts'", function(err, columns, fields) {
    //     if (err) {
    //         next(err + " /");
    //         return;
    //     }
    //     context.columns = columns;
    //     context.columns.shift();
    //     res.render('home', context);
    // });
    setTimeout(function(){ res.render('home', context); }, 3000);
    res.render('home', context);
});

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});