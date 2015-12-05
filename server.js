var express=require('express');
var app = express();
var request = require('request');
//var session = require("express-session");
var cookieParser = require('cookie-parser');
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'Qwerty@314',
		database : 'mi2k15',
	});

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var allowedID=makeid;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var data = {
			"error":1
		};
	if(username=="admin" && password=="hunter2"){
		data["error"]=0;
		var sessionID = makeid();
		allowedID = sessionID;
		var cookCode = {"sessionID": sessionID}; 
		res.cookie("code", sessionID);
		//console.log(sessionID);
		//console.log("code: ", req.cookies["code"]);
	}
	res.json(data);

});
/*
request('http://moodi.org/api/events', function (error, response, req) {
    //Check for error
    if(error){
        return console.log('Error:', error);
    }

    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }

    //console.log(req);
    req = JSON.parse(req);
    //console.log(req.status);
    console.log(req["data"]);
    console.log(req["data"].length);
    //console.log(req.body.data); 
    for (var i = req["data"].length - 1; i >= 0; i--) {
    	connection.query("INSERT INTO events VALUES(?,?,'','','','','','','','','','','','')",[ req["data"][i]["event_id"] , req["data"][i]["event_name"] ] ,function(err, rows, fields){
				if(!!err){
					console.log("Error Adding Event", err);
					//console.log(err);
				}else{
					console.log("Event Added Successfully ", err);
				}
			}
		);
		//console.log(req["data"][i]);
    };

    //All is good. Print the body
   	// Show the HTML for the Modulus homepage.

});
*/
app.post('/updateEventStanding1',function(req,res){
	var data = {
			"data":"",
			"error":1,
			"events":"",
			"college":""
		};
	if(req.cookies["code"]==allowedID){	
		
		var first_id = req.body.first_id;
		var first_points = Number(req.body.first_points);
		var first_name = req.body.first_name;

		var event_id = req.body.event_id;
		
		if(!!first_id && !!first_name && !!first_points && !!event_id){
			connection.query("UPDATE events SET first_name ='" + first_name + "', first_id=" + first_id + ", first_points=" + first_points + " WHERE event_id = " + event_id,function(err, rows, fields){
				if(!!err){
					data["events"] = "Error updating: "+ err;
					console.log(err);
				}else{
					data["error"] = 0;
					data["events"] = "EventsDB updated Successfully";
					
					connection.query("SELECT * FROM colleges WHERE college_id="+first_id, function(err, rows, fields){
						if(rows.length==1){
							prevPoints = Number(rows[0]["points"]);
							first_points+=prevPoints;
							prevID = rows["events"];
							event_id = String(prevID) + ", " + String(event_id);
							connection.query("UPDATE colleges SET college_name ='" + first_name + "', points=" + first_points + ", events="+ event_id +" WHERE college_id = " + college_id ,function(err, rows, fields){
								if(!!err){
									data["error"]=1;
									data["college"]="collegeDB update FAILED";
									console.log("collegeDB update FAILED");
								}
								else{
									data["college"]="collegeDB updated";
									console.log("collegeDB updated");
								}
							});	
						}
						else{
							connection.query("INSERT INTO colleges VALUES(?,?,?,?)",[ first_id, first_points, first_name, event_id ] ,function(err, rows, fields){
								if(!!err){
									data["error"]=1;
									data["college"]="collegeDB update FAILED";
									console.log("collegeDB update FAILED");
								}
								else{
									data["college"]="collegeDB updated";
									console.log("collegeDB updated");
								}

							});
						}
					});

				}
				res.json(data);
			});
		}else{
			data["data"] = "Please provide all required data";
			res.json(data);
		}
		//console.log(data);
	}
	else{
		//console.log("Invalid credentials");
		data["data"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});

app.post('/updateEventStanding2',function(req,res){
	var data = {
			"error":1,
			"data":"",
			"events":"",
			"college":""
		};
	if(req.cookies["code"]==allowedID){	
		
		var second_id = req.body.second_id;
		var second_points = Number(req.body.second_points);
		var second_name = req.body.second_name;

		var event_id = req.body.event_id;
		
		if(!!second_id && !!second_name && !!second_points && !!event_id){
			connection.query("UPDATE events SET second_name ='" + second_name + "', second_id=" + second_id + ", second_points=" + second_points + " WHERE event_id = " + event_id,function(err, rows, fields){
				if(!!err){
					data["data"] = "Error updating: "+ err;
					console.log(err);
				}else{
					statusArray[status]++;
					data["error"] = 0;
					data["events"] = "EventsDB updated Successfully";
					
					connection.query("SELECT * FROM colleges WHERE college_id="+second_id, function(err, rows, fields){
						if(rows.length==1){
							prevPoints = Number(rows[0]["points"]);
							second_points+=prevPoints;
							prevID = rows["events"];
							event_id = String(prevID) + ", " + String(event_id);
							connection.query("UPDATE colleges SET college_name ='" + second_name + "', points=" + second_points + ", events="+ event_id +" WHERE college_id = " + college_id ,function(err, rows, fields){
								if(!!err){
									data["error"]=1;
									data["college"]="collegeDB update FAILED";
									console.log("collegeDB update FAILED");
								}
								else{
									data["college"]="collegeDB updated";
									console.log("collegeDB updated");
								}
							});	
						}
						else{
							connection.query("INSERT INTO colleges VALUES(?,?,?,?)",[ second_id, second_points, second_name, event_id ] ,function(err, rows, fields){
								if(!!err){
									data["error"]=1;
									data["college"]="collegeDB update FAILED";
									console.log("collegeDB update FAILED");
								}
								else{
									data["college"]="collegeDB updated";
									console.log("collegeDB updated");
								}

							});
						}
					});
				}
				res.json(data);
			});
		}else{
			data["data"] = "Please provide all required data";
			res.json(data);
		}
		//console.log(data);
	}
	else{
		//console.log("Invalid credentials");
		data["data"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});

app.post('/updateEventStanding3',function(req,res){
	var data = {
			"error":1,
			"events":"",
			"college":"",
			"data":""
		};
	if(req.cookies["code"]==allowedID){	
		
		var third_id = req.body.third_id;
		var third_points = Number(req.body.third_points);
		var third_name = req.body.third_name;

		var event_id = req.body.event_id;
		
		if(!!third_id && !!third_name && !!third_points && !!event_id){
			connection.query("UPDATE events SET third_name ='" + third_name + "', third_id=" + third_id + ", third_points=" + third_points + " WHERE event_id = " + event_id,function(err, rows, fields){
				if(!!err){
					data["data"] = "Error updating: "+ err;
					console.log(err);
				}else{
					statusArray[status]++;
					data["error"] = 0;
					data["events"] = "EventsDB updated Successfully";
					
					connection.query("SELECT * FROM colleges WHERE college_id="+third_id, function(err, rows, fields){
						if(rows.length==1){
							prevPoints = Number(rows[0]["points"]);
							third_points+=prevPoints;
							prevID = rows["events"];
							event_id = String(prevID) + ", " + String(event_id);
							connection.query("UPDATE colleges SET college_name ='" + third_name + "', points=" + third_points + ", events="+ event_id +" WHERE college_id = " + college_id ,function(err, rows, fields){
								if(!!err){
									data["error"]=1;
									data["college"]="collegeDB update FAILED";
									console.log("collegeDB update FAILED");
								}
								else{
									data["college"]="collegeDB updated";
									console.log("collegeDB updated");
								}
							});	
						}
						else{
							connection.query("INSERT INTO colleges VALUES(?,?,?,?)",[ third_id, third_points, third_name, event_id ] ,function(err, rows, fields){
								if(!!err){
									data["error"]=1;
									data["college"]="collegeDB update FAILED";
									console.log("collegeDB update FAILED");
								}
								else{
									data["college"]="collegeDB updated";
									console.log("collegeDB updated");
								}

							});
						}
					});
				}
				res.json(data);
			});
		}else{
			data["data"] = "Please provide all required data";
			res.json(data);
		}
		//console.log(data);
	}
	else{
		//console.log("Invalid credentials");
		data["data"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});


app.post('/updateEventStanding4',function(req,res){
	var data = {
			"error":1,
			"data":"",
			"events":"",
			"college":""
		};
	if(req.cookies["code"]==allowedID){	
		
		var fourth_id = req.body.fourth_id;
		var fourth_points = Number(req.body.fourth_points);
		var fourth_name = req.body.fourth_name;

		var event_id = req.body.event_id;
		
		if(!!fourth_id && !!fourth_name && !!fourth_points && !!event_id){
			connection.query("UPDATE events SET fourth_name ='" + fourth_name + "', fourth_id=" + fourth_id + ", fourth_points=" + fourth_points + " WHERE event_id = " + event_id,function(err, rows, fields){
				if(!!err){
					data["data"] = "Error updating: "+ err;
					console.log(err);
				}else{
					statusArray[status]++;
					data["error"] = 0;
					data["events"] = "EventsDB updated Successfully";
					
					connection.query("SELECT * FROM colleges WHERE college_id="+fourth_id, function(err, rows, fields){
						if(rows.length==1){
							prevPoints = Number(rows[0]["points"]);
							fourth_points+=prevPoints;
							prevID = rows["events"];
							event_id = String(prevID) + ", " + String(event_id);
							connection.query("UPDATE colleges SET college_name ='" + fourth_name + "', points=" + fourth_points + ", events="+ event_id +" WHERE college_id = " + college_id ,function(err, rows, fields){
								if(!!err){
									data["error"]=1;
									data["college"]="collegeDB update FAILED";
									console.log("collegeDB update FAILED");
								}
								else{
									data["college"]="collegeDB updated";
									console.log("collegeDB updated");
								}
							});	
						}
						else{
							connection.query("INSERT INTO colleges VALUES(?,?,?,?)",[ fourth_id, fourth_points, fourth_name, event_id ] ,function(err, rows, fields){
								if(!!err){
									data["error"]=1;
									data["college"]="collegeDB update FAILED";
									console.log("collegeDB update FAILED");
								}
								else{
									data["college"]="collegeDB updated";
									console.log("collegeDB updated");
								}

							});
						}
					});
				}
				res.json(data);
			});
		}else{
			data["data"] = "Please provide all required data";
			res.json(data);
		}
		//console.log(data);
	}
	else{
		//console.log("Invalid credentials");
		data["data"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});

http.listen(12346,function(){
	//console.log("Connected & Listen to port 12345");
});