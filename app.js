//set up Express
let express = require('express');
let app = express();
let path = require('path');

//set up handlebars
let handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//Setup Routes
const homeRouter = require('./routes/home');
const equipmentsRouter = require('./routes/equipments');
const spacemarinesRouter = require('./routes/spacemarines')
const sergeantsRouter = require('./routes/sergeants')

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

//include body parser so we can parse the bodies of post requests...
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Assign routes
app.use('/', homeRouter);
app.use('/equipments', equipmentsRouter);
app.use('/spacemarines', spacemarinesRouter);
app.use('/sergeants', sergeantsRouter);

//Handle errors
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

//Needed for routes, no idea what this does
module.exports = app;