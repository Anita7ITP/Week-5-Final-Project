var express = require('express');
var app = express();
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var nedbstore = require('nedb-session-store')(session);
var mongojs = require('mongojs');
var config = require('./config.js');

const uuidV1 = require('uuid/v1');


var bodyParser = require('body-parser');


var db = mongojs(config.mlabstring, ["itpstudents"]);
var db = mongojs(config.username+":"+config.password+"@ds125628.mlab.com:25628/dwdspring", ["itpstudents"]);

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser);



app.use(
	session(
		{
			secret: 'secret',
			cookie: {
				 ITPYear: 1 * 2 
				},
			store: new nedbstore({
			filename: 'sessions.db'
			})
		}
	)
);

function generateHash(password) {
	return bcrypt.hashSync(password);
}

function compareHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}


// Main page
app.get('/', function(req, res) {
	console.log(req.session.username);

	if (!req.session.username) {
		res.render('login.ejs', {}); 
	} else {
		// Give them the main page
  		//res.send('session user-id: ' + req.session.userid + '. ');
		res.render('main.ejs', req.session);
	}
});

app.get('/registration', function(req, res) {
	res.render('registration.ejs', {});
});

app.post('/register', function(req, res) {
	var passwordHash = generateHash(req.body.password);
	var registration = {
		"student_username": req.body.username,
		"choose_password": passwordHash
		'ITP_Grad_Year':req.body.year
		"Time_Available":req.body.time
		"Email_Id":req.body.email
		'Gender':req.body.gender
		"Country_of_Origin"	:req.body.country
	};

	db.insert(registration);
	console.log("inserted " + registration);
	res.send("Registered <a href=\"/\">Sign In</a>" );
	
});

app.get('/logout', function(req, res) {
	delete req.session.username;
	res.redirect('/');
});

// Post from login page
app.post('/login', function(req, res) {

	// Check username and password in database
	db.findOne({"username": req.body.username},
		function(err, doc) {
			if (doc != null) {
				
				// Found user, check password				
				if (compareHash(req.body.password, doc.password)) {				
					// Set the session variable
					req.session.username = doc.username;

					// Put some other data in there
					req.session.lastlogin = Date.now();

					res.redirect('/');
					
				} else {

					res.send("Invalid <a href=\"/\">Try again</a>");

				}
			} 
		}
	);
	

});

app.listen(8080);
