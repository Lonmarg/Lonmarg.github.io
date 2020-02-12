//set up Express
let express = require('express');
let app = express();

//set up handlebars
let handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Server credentials
let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_wellheup',
    password: 'Akirr@5t@r5und3r',
    database: 'cs340_wellheup'
});

//set port to use and console message to remind how to end process
app.set('port', 4361);
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
//NOTE: to run w/ forever after installing forever: ./node_modules/forever/bin/forever start app.js 4361

//Define Routes
let path = require('path');//require path to navigate folders
app.use(express.static(path.join(__dirname, 'public')));//Set Static folder
// let home = require('.routes/home');
// app.use('/home', home);//use home.js for home
// let admin = require('./routes/admin');
// app.use('/admin', admin);//use admin.js for admin
//NOTE: I think we can separate our scripts into individual .js files but haven't figured it out yet...

//include body parser so we can parse the bodies of post requests...
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    console.log("I decided to run get/");
    let context = {};
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

app.get('/admin', function(req, res, next) {
    console.log("I decided to run get/");
    let context = {};
    context.pgTitle = "IT LIVES!";

    res.render('admin', context);
});

// app.get('/add-exercise', (req, res, next) => {
//     let context = {};
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
//     let context = {};
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
//     let context = {};
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
//     let context = {};
//     pool.query("DROP TABLE IF EXISTS workouts", function(err) {
//         //replace your connection pool with the your letiable containing the connection pool
//         let createString = "CREATE TABLE workouts(" +
//             "id INT PRIMARY KEY AUTO_INCREMENT," +
//             "name letCHAR(255) NOT NULL," +
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
    let context = {};
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
    //             let curVals = result[0];
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
    //         //replace your connection pool with the your letiable containing the connection pool
    //         let createString = "CREATE TABLE workouts(" +
    //             "id INT PRIMARY KEY AUTO_INCREMENT," +
    //             "name letCHAR(255) NOT NULL," +
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

