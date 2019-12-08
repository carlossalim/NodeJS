const MongoClient = require ('mongodb').MongoClient;

//Connection
const url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, client){
		if(err){
			return console.dir(err);
		}
		console.log('Connect to MongoDB');

		//InsertDocuments(client, function(){
		//FindDocuments(client, function(){
		//QueryDocuments(client, function(){
		//	client.close();
		///});	
		
		//UpdateDocuments(client, function(){
		//	client.close();
		//});

		DeleteDocuments(client, function(){
			client.close();
		});	
		
		
});

const InsertDocument = function (client, callback){
	//get Collection
	const dbo = client.db("myproject");
	console.log(dbo);
	//insert Docs
	dbo.collection("users").insert({
			name: 'Carlos  Campos',
			email: 'carlossalim@hotmail.com'
	}, function(err,result){
		if(err){
			return console.dir(err);
		}
		console.log('Inserted document');
		console.log(result);
		callback(result);
	});	

}

const InsertDocuments = function (client, callback){
	//get Collection
	const dbo = client.db("myproject");
	console.log(dbo);
	//insert Docs
	dbo.collection("users").insertMany([{
			name: 'Carlos  2',
			email: 'carlossalim@hotmail.com'
			},{
			name: 'Carlos  3',
			email: 'carlossalim@hotmail.com'
			},{
			name: 'Carlos  4',
			email: 'carlossalim@hotmail.com'
			}], function(err,result){
		if(err){
			return console.dir(err);
		}
		console.log('Inserted document');
		console.log(result);
		callback(result);
	});	

}


const FindDocuments = function (client, callback){
	//get Collection
	const dbo = client.db("passport");
	//Find Docs
	dbo.collection("users").find({}).toArray( function(err,docs){
		if(err){
			return console.dir(err);
		}
		console.log('Found  the following records/truples  ');
		console.log(docs);
		callback(docs);
	});	

}


const QueryDocuments = function (client, callback){
	//get Collection
	const dbo = client.db("myproject");
	//Query Docs
	dbo.collection("users").find({"name":"Carlos  3"}).toArray( function(err,docs){
		if(err){
			return console.dir(err);
		}
		console.log('Found  the following records/truples  ');
		console.log(docs);
		callback(docs);
	});	

}


const UpdateDocuments = function (client, callback){
	//get Collection
	const dbo = client.db("myproject").collection("users");
	console.log(dbo);
	//update Docs
	dbo.updateOne({name:"Carlos  2"},{$set: { "email" : "update2@email.com" }}, 
		function(err,results){
			if(err){
				return console.dir(err);
			}
			console.log('Updates records/truples  ');
			console.log(results);
			callback(results);
		});	

}


const DeleteDocuments = function (client, callback){
	//get Collection
	const dbo = client.db("myproject").collection("users");
	console.log(dbo);
	//update Docs
	dbo.deleteOne({name:"Carlos  3"}, 
		function(err,results){
			if(err){
				return console.dir(err);
			}
			console.log('Updates records/truples  ');
			console.log(results);
			callback(results);
		});	

}