const MongoClient = require ('mongodb').MongoClient;

//Connection
const url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, client){
		if(err){
			return console.dir(err);
		}
		console.log('Connect to MongoDB');

		InsertDocuments(client, function(){
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