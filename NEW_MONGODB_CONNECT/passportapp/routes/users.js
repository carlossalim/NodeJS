const express = require('express');
const session = require('express-session');
const router = express.Router();

//connect MongoDB
const mongojs = require('mongojs');
const db = mongojs('localhost:27017/passportapp',['users']);

var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');


//MongoDb Connection
const MongoClient = require ('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

// Login Page - GET
router.get('/login', function(req, res){
	res.render('login');
});

// Register Page - GET
router.get('/register', function(req, res){
	res.render('register');
});


// Register Page - POST - BEGIN
router.post('/register'
	,[
	//Validation
	check('name','Name is required').not().isEmpty(),
	check('email','Email is required').not().isEmpty(),
	check('email').isEmail().withMessage('Email is not valid'),
	check('username').not().isEmpty().withMessage('Username is required'),
	check('password','Password is required').not().isEmpty(),
	check('password2','Password2 is required').not().isEmpty(),
	
	check('password2')
		.custom((value,{req, loc, path}) => {
            if (value !== req.body.password) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        })
		.withMessage('Passwords are different')
 	]
	,function(req, res){
	const errors = validationResult(req);

	console.log('Adding user ...');	
	const name = req.body.name; 
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;
  	
	

  	if (!errors.isEmpty()) {
  		console.log('Form has errors ...');
  		console.log(errors);
  		//return res.status(422).json({ errors: errors.array() })

  		res.render('register',{
  			errorResults: errors,
  			name: name, 
			email: email,
			username: username,
			password: password,
			password2: password2
  		})
  	}	
  	else{
		console.log('Success ...');
		var newUser ={
			name: name, 
			email: email,
			username: username,
			password: password
		}

		
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(newUser.password, salt, function(err, hash){
				newUser.password = hash;
			});
		});
		

		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
			if(err){
				return console.dir(err);
			}
			console.log('Connect to MongoDB');
			insertUser(client, function(){
					client.close();
			});	
		});		
		
		
		const insertUser = function (client, callback){
			const dbo = client.db("passportapp");
			dbo.collection("users").insertOne(newUser, function(err,result){
				if(err){
					return console.dir(err);
				}
				//success message
				console.log('User added');
				req.flash('success','You are registered in our system.');

				//Redirect after registration
				res.location('/');
				res.redirect('/');

				//console.log(result);
				callback(result);
			});	
		}
	
	}	
});
// Register Page - POST - END


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
 db.users.findOne({_id: mongojs.ObjectId(id)}, function(err, user){
 	done(err, user);
 });
});

passport.use(new LocalStrategy(
	function(username, password, done){
		db.on('error', function() {
 			 console.log('we had an error.');
		});
		db.users.findOne({username: username}, function(err, user){
			if(err) {
				return done(err);
			}
			if(!user){
				console.log('Incorrect username');
				return done(null, false, {message: 'Incorrect username'});
			}

			bcrypt.compare(password, user.password, function(err, isMatch){
				if(err) {
					return done(err);
				}
				if(isMatch){
					return done(null, user);
				} else {
					console.log('Incorrect password');
					return done(null, false, {message: 'Incorrect password'});
				}
			});
		});
	}
	));


// Login - POST -BEGIN
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: 'Invalid Username Or Password' }), 
  function(req, res){
  	console.log('Auth Successfull');
  	res.redirect('/');
  });
// Login - POST -END



router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
});


module.exports = router;	