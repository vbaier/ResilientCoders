var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/resilient_coders',{ useNewUrlParser: true });

var personSchema = mongoose.Schema({
   name: String,
   age: Number,
   nationality: String
});
var Person = mongoose.model("Person", personSchema);

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.static('public'));
app.use(express.static('images'));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.get('/', function (req, res) {
 res.render('hello_world');
});

app.get('/person', function(req, res){
   res.render('person');
});

app.post('/person', function(req, res){
   
   console.log(req.body);
   var personInfo = req.body; //Get the parsed information
   
   if(!personInfo.name || !personInfo.age || !personInfo.nationality){
      res.render('show_message', {
         message: "Sorry, you provided worng info", type: "error"});
   } else {
      var newPerson = new Person({
         name: personInfo.name,
         age: personInfo.age,
         nationality: personInfo.nationality
      });
		
      newPerson.save(function(err, Person){
         if(err)
            res.render('show_message', {message: "Database error", type: "error"});
         else
            res.render('show_message', {
               message: "New person added", type: "success", person: personInfo});
      });
   }
});

app.get('/people', function(req, res){
   Person.find(function(err, response){
      res.json(response);
   });
});

app.put('/people/:id', function(req, res){
   Person.findByIdAndUpdate(req.params.id, req.body, function(err, response){
      if(err) res.json({message: "Error in updating person with id " + req.params.id});
      res.json(response);
   });
});

app.delete('/people/:id', function(req, res){
   Person.findByIdAndRemove(req.params.id, function(err, response){
      if(err) res.json({message: "Error in deleting record id " + req.params.id});
      else res.json({message: "Person with id " + req.params.id + " removed."});
   });
});

app.listen(port, function () {
 console.log(`Example app listening on port ${port}!`);
});