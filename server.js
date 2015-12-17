var express=require('express');
var app = express();
var request = require('request');
//var session = require("express-session");
var cookieParser = require('cookie-parser');
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
var connection = mysql.createConnection({
		host     	: 'localhost',
		user     	: 'root',
		password 	: 'Qwerty@314',
		database 	: 'fuehrer',
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
app.use(cookieParser());
app.use('/', express.static(__dirname));

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
// RUN ONCE
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
					console.log(err);
					console.log("Error Adding Event", err);
					console.log(err);
					//console.log(err);
					console.log(err);
				}else{
					console.log("Event Added Successfully ", err);
					console.log(err);
				}
			}
		);
		//console.log(req["data"][i]);
    };

    //All is good. Print the body
   	// Show the HTML for the Modulus homepage.

});
*/
function add_team (clg_id,points,clg_name,position,event_id,ret,res) {
	console.log("\n ADDING NEW CLG");
	connection.query("SELECT * FROM clg WHERE clg_id="+clg_id,function(err,rows,fields){
		
		if (err){
			console.log(err);
			ret.error += 32;
			ret.message = err;
			res.json(ret);
			//return;
		}
		if(rows.length == 1){
			console.log("\n CLG found in DB");
			var p = Number(rows[0].points)+points;
			var s = rows[0][position]+","+String(event_id);
			s = (s.length && s[0] == ',') ? s.slice(1) : s;

			connection.query("UPDATE clg SET points="+p+","+position+"='"+s+"' WHERE clg_id="+clg_id, function(err,rows,fields){
				if(err){
					console.log(err);
					ret.error += 8;
					ret.message = err;
					res.json(ret);
					//return;
				}
				console.log("\n UPDATED DB");
			});
		}
		//else if(rows.length==0){
		else{
			console.log("\n NOT FOUND IN DB");
			connection.query("INSERT INTO clg (clg_id,clg_name,points,"+ position +") VALUES ("+clg_id+",'"+clg_name+"',"+points+","+event_id+")", function(err,rows,fields){
				if(err){
					console.log(err);
					ret.error += 16;
					ret.message = err;
					res.json(ret);
					//return;
				}
				console.log("\n ADDED CLG entry");
			});
		}
	});
	res.json(ret);
}

app.post('/addResult',function(req,res){
	if(req.cookies["code"]==allowedID){
		var ret = {
				"error":0,
				"message":"Done :)",
			};

		var clg_id 		= 	Number(req.body.clg_id);
		var points 		= 	Number(req.body.points);
		var clg_name 	= 	req.body.clg_name;
		var event_id 	= 	Number(req.body.event_id);
		var pos 		= 	Number(req.body.position);

		var old_clg_id=null;
		var old_points=null;
		var old_clg_name=null;

		var position;
		//console.log("Pos:",pos)
		if (pos === 1) {
			position = "first";
		}
		else if(pos === 2){
			position = "second";
		}
		else if(pos === 3){
			position = "third";
		}
		else if(pos === 4){
			position = "fourth";
		}
		else{
			ret.message = "Invalid pos.";
			ret.error+=1;
			res.json(ret);
			return
		}

		if(!clg_id || !clg_name || !points || !event_id || !pos){
			ret.error += 2;
			ret.message = "Required data: clg_id, points, clg_name, event_id, position";
			res.json(ret);
			return
		}

		connection.query("SELECT * FROM leaderboard_events WHERE event_id=" + event_id, function(err,rows,fields){
			if (err){
				console.log(err);
				ret.error += 256;
				ret.message = err;
				res.json(ret);
				//return;
			}
			console.log("\n CHECK-EVENT");
			if (rows.length==1) {
				//console.log("rows[0]:" ,rows[0]);
				old_clg_id 		= 	rows[0][position+"_id"];
				old_clg_name	= 	rows[0][position+"_name"];
				//console.log("!!old_clg_name:",old_clg_name," !!old_clg_id:", old_clg_id);
				old_points		=	Number(rows[0][position+"_points"]);
				console.log("\n Old winners found?: \n");
				console.log("old_clg_name:",old_clg_name," old_clg_id:", old_clg_id);
				if(old_points === points && old_clg_name===clg_name && old_clg_id===clg_id){
					//return;
				}
				if(old_clg_id){
					console.log("\n YESS!");
					connection.query("SELECT * FROM clg WHERE clg_id="+old_clg_id,function(err,rows,fields){
						if (err){
							console.log("64:",err);
							ret.error += 64;
							ret.message = err;
							res.json(ret);
							//return;
						}
						if(rows.length==1){
							var p = rows[0].points-old_points;
							var s = rows[0][position].split(",");
							console.log("We need to remove event from s:", s);
							for(var i = s.length - 1; i >= 0; i--) {
			    				if(Number(s[i]) === Number(event_id)) {
			       					console.log("Uh oh");
			       					s.splice(i, 1);
			       					break;
			    				}
							}
							console.log("New s:", s);

							pString = s.join(",");
							console.log("pString:", pString);
							connection.query("UPDATE clg SET points = "+p+", "+position+"='"+pString+"' WHERE clg_id="+old_clg_id,function(err,rows,fields){
								if(err){
									console.log("128:",err);
									ret.error += 128;
									ret.message = err;
									res.json(ret);
									//return;
								}
								console.log("\n DELETE PREV DATA");
								add_team(clg_id,points,clg_name,position,event_id,ret,res);
							});
						}
					});
				}
				else{
					add_team(clg_id,points,clg_name,position,event_id,ret,res);
				}
			};
			connection.query("UPDATE leaderboard_events SET "+position+"_name='"+clg_name+"', "+position+"_id="+clg_id+", "+position+"_points="+points+" WHERE event_id="+event_id,function(err,rows,fields){
				if (err){
					console.log(err);
					ret.error += 4;
					ret.message = err;
					res.json(ret);
					//return;
				}
			});
		});
	}
	else{
		console.log("Unauthorized access detected")
	}	
});

app.get("/leaderboard", function(req,res){
	connection.query("SELECT * FROM clg ORDER BY points DESC", function(err,rows,fields){
		if(!!err){
			console.log("ERR260: " + err);
			//res.json(err);
			//return;
		}
		res.json(rows);
	});
});

app.get("/eventlist",function(req,res){
	connection.query("SELECT * FROM leaderboard_events", function(err,rows,fields){
		if(err){
			console.log(err);
		}
		res.json(rows);
	});
});

app.get("/eventlistshort",function(req,res){
	connection.query("SELECT event_id, event_name FROM leaderboard_events", function(err,rows,fields){
		if(err){
			console.log(err);
		}
		res.json(rows);
	});
});

app.post("/details",function(req,res){
	clg_id = req.body.clg_id;
	
	var first;
	var second;
	var third;
	var fourth;

	var data = {
		"clg_name":"",
		"first":"",
		"second":" ",
		"third":" ",
		"fourth":" "
	}

	connection.query("SELECT * FROM clg WHERE clg_id="+clg_id,function(err,rows,fields){
		if(err){
			console.log("damn it");
		}
		if(rows.length==1){
			first = ((rows[0].first)?(rows[0].first.split(",")):([]));
			second = ((rows[0].second)?(rows[0].second.split(",")):([]));
			third = ((rows[0].third)?(rows[0].third.split(",")):([]));
			fourth = ((rows[0].fourth)?(rows[0].fourth.split(",")):([]));
			data.clg_name = rows[0].clg_name;
			console.log("\n first:", first);
		}
		var flag = [false,false,false,false];

		var fstr = "";
		var sstr = "";
		var tstr = "";
		var fostr = "";

		for (var i = 0; i < first.length; i++) {
			fstr = fstr + " event_id="+first[i];
			if(i != first.length-1){
				fstr += " OR";
			}
		};
		for (var i = 0; i < second.length; i++) {
			sstr = sstr + " event_id="+second[i];
			if(i != second.length-1){
				sstr += " OR";
			}
		};
		for (var i = 0; i < third.length; i++) {
			tstr = tstr + " event_id="+third[i];
			if(i != third.length-1){
				tstr += " OR";
			}
		};
		for (var i = 0; i < fourth.length; i++) {
			fostr = fostr + " event_id="+fourth[i];
			if(i != fourth.length-1){
				fostr += " OR";
			}
		};

		connection.query("SELECT event_name, first_points FROM leaderboard_events WHERE"+ fstr,function(err,rows,fields){
			if(err){
				console.log("ERR 314");
			}
			//console.log(rows[0].event_name);
			data.first = ((rows)?(rows):("-"));
			console.log(data.first);
			connection.query("SELECT event_name, second_points FROM leaderboard_events WHERE"+ sstr,function(err,rows,fields){
				if(err){
					console.log("ERR 314");
				}
				//console.log(rows[0].event_name);
				data.second = ((rows)?(rows):('-'));
				console.log("II: ",data.second);
				connection.query("SELECT event_name, third_points FROM leaderboard_events WHERE"+ tstr,function(err,rows,fields){
					if(err){
						console.log("ERR 314");
					}
					//console.log(rows[0].event_name);
					data.third = ((rows)?(rows):("-"));
					console.log(data.first);
					connection.query("SELECT event_name, fourth_points FROM leaderboard_events WHERE"+ fostr,function(err,rows,fields){
						if(err){
							console.log("ERR 314");
						}
						//console.log(rows[0].event_name);
						data.fourth = ((rows)?(rows):("-"));
						console.log(data.first);
						res.json(data);
					});
				});
			});
		});

		/*for (var i = 0; i < first.length; i++) {
			connection.query("SELECT event_name FROM events WHERE event_id="+Number(first[i]),function(err,rows,fields){
				if(err){
					console.log("ERR 314");
				}
				//console.log(rows[0].event_name);
				data.first+=(rows[0].event_name+",");
				//console.log(data.first);
				if(i == first.length-1 ){
					flag[0]=true;
				}
			});
		};
		for (var i = 0; i < second.length; i++) {
			connection.query("SELECT event_name FROM events WHERE event_id="+Number(second[i]),function(err,rows,fields){
				data.second+=(rows[0].event_name+",");
				if(i == second.length-1 ){
					flag[1]=true;
				}
			});
		};
		for (var i = 0; i < third.length; i++) {
			connection.query("SELECT event_name FROM events WHERE event_id="+Number(third[i]),function(err,rows,fields){
				data.third+=(rows[0].event_name+",");
				if(i == third.length-1 ){
					flag[2]=true;
				}
			});
		};
		for (var i = 0; i < fourth.length; i++) {
			connection.query("SELECT event_name FROM events WHERE event_id="+Number(fourth[i]),function(err,rows,fields){
				data.fourth+=(rows[0].event_name+",");
				if(i == fourth.length-1 ){
					flag[0]=true;
				}

			});
		};*/
		
	});
});


var port =  process.env.OPENSHIFT_NODEJS_PORT || 8080;   // Port 8080 if you run locally
var address =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"; // Listening to localhost if you run locally
app.listen(port, address);
/*http.listen(12346,function(){
	console.log("Connected & Listen to port 12345");
});*/