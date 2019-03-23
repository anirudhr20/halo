var express = require('express');
var app = express();
var firebase = require('firebase');
const path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const publicPath = path.join(__dirname,'./public');

app.use(express.static(publicPath));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));


var config = {
    apiKey: "AIzaSyATOxPRjEjaDBRSUO_y7rid7aZrZ47NT2s",
    authDomain: "halo2-1ce47.firebaseapp.com",
    databaseURL: "https://halo2-1ce47.firebaseio.com",
    projectId: "halo2-1ce47",
    storageBucket: "halo2-1ce47.appspot.com",
    messagingSenderId: "165597915231"
  };
  firebase.initializeApp(config);

app.get('/dashboard', function (req, res) {

	console.log("HTTP Get Request");
	var patientReference = firebase.database().ref("/Patients/");

	//Attach an asynchronous callback to read the data
	patientReference.on("value", 
			  function(snapshot) {
					console.log(snapshot.val());
					var bdata = snapshot.val()
					var data = bdata.Lohith
					//console.log(data)
					var a = data.age;

					var n = data.name;
					//console.log(n);
					res.render('bro',{name:n,age:a});

					patientReference.off("value");
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});
app.get('/dashboard/:name',function(req,res){
	var name = req.params.name;
	
	var patientReference = firebase.database().ref("/Patients/"+name);
	
	//Attach an asynchronous callback to read the data
	patientReference.on("value", 
			  function(snapshot) {
					console.log(snapshot.val());
					var data = snapshot.val()
					var a = data.age;
					var n = data.name;
					var h = data.heartRate;
					var m = data.medicines;
					var s = data.symptoms;
					//console.log(data.Age)
					//res.json(snapshot.val());
					res.render('mf',{name:n,age:a,heartRate:h,medicines:m,symptoms:s});
					//res.json(snapshot.val());
					patientReference.off("value");
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
})
//Create new instance
app.put('/dashboard', function (req, res) {

	console.log("HTTP Put Request");

	var name = req.body.name;
	var age = req.body.age;
	var heartRate = req.body.HeartRate;
	var medicines = req.body.medicines;
	var symptoms = req.body.symptoms;

	var referencePath = '/Patients/'+name+'/';
	var patientReference = firebase.database().ref(referencePath);
	patientReference.set({name: name, age: age,HeartRate:heartRate,medicines:medicines,symptoms:symptoms}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("Data saved successfully.");
					}
			});
});

//Update existing instance
app.post('/dashboard/:name', function (req, res) {

	console.log("HTTP POST Request");
	var name = req.params.name;
	//var age = req.body.Age;
	//var heartRate = req.body.HeartRate;
	var medicines = req.body.medicines;
	//var symptoms = req.body.Symptoms;

	var referencePath = '/Patients/'+name+'/';
	var patientReference = firebase.database().ref(referencePath);
	patientReference.update({medicines:medicines}, 
				 function(error) {
					if (error) {
						res.send("Data could not be updated." + error);
					} 
					else {
						res.redirect('/dashboard/Lohith');
					}
			    });
});

//Delete an instance
/*app.delete('/', function (req, res) {

   console.log("HTTP DELETE Request");
   //todo
});*/
app.get('/test',(req,res)=>{
	res.render('new');
})
var server = app.listen(8080, function () {
  
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});

