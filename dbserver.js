var config = require('./config.js');
//console.log(config);

var mongojs = require('mongojs');
var express = require('express');
var app = express();

var db = mongojs(config.mlabstring, ["itpstudents"]);
// db.itpstudents.save({"test":"a test"}, function(err, saved) {
//   if( err || !saved ) console.log("Not saved");
//     else console.log("Saved");
// });

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/templatetest', function(req, res) {
	var data = {students: [{FirstName: "Jen", LastName: "Chambers"},{FirstName: "Viola", LastName: "Lee"}, {FirstNameame: "Barry", LastName: "Jackson"}]};

    res.render('forfriendtemplate.ejs', data);
});


var count = 0;

var itpstudents = [];

app.get('/formpost', function(req, res) {

db.itpstudents.save({"submission":req.query.textfield}, function(err, saved) {
    if( err || !saved ) console.log("Not saved");
      else console.log("Saved");
  });
  

  res.redirect('/display');
});


app.get('/one', function(req, res) {
  //req.query._id
  db.itpstudents.findOne({_id: mongojs.ObjectId(req.query._id)}, function(err, saved) {
    res.send("You pulled out: " + JSON.stringify(saved));
  });

});



app.get('/display', function(req, res) {

  db.itpstudents.find({}, function(err, saved) {
    if (err || !saved) {
    	console.log("No results");
    }
    else {
      console.log(saved);
      res.render('forfrienddisplay.ejs', {colordata:saved});


    }
  });

});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});