$(document).ready(function(){
	var events;
	$.ajax(
	  	{
	    	type: 'GET',
	    	url: '/eventlist',
	    	success: function(data)
	    	{
	      		//events=data;
	      		for (var i = 0; i < data.length; i++) {
	      			var appendstr="";
					appendstr+="<tr>";
					appendstr+=("<td>"+data[i].event_name+"</td>");
					appendstr+=("<td>"+((data[i].first_name)?(data[i].first_name):("-"))+"</td>");
					appendstr+=("<td>"+((data[i].first_points)?(data[i].first_points):('0'))+"</td>");
					appendstr+=("<td>"+((data[i].second_name)?(data[i].second_name):("-"))+"</td>");
					appendstr+=("<td>"+((data[i].second_points)?(data[i].second_points):('0'))+"</td>");
					appendstr+=("<td>"+((data[i].third_name)?(data[i].third_name):("-"))+"</td>");
					appendstr+=("<td>"+((data[i].third_points)?(data[i].third_points):('0'))+"</td>");
					appendstr+=("<td>"+((data[i].fourth_name)?(data[i].fourth_name):("-"))+"</td>");
					appendstr+=("<td>"+((data[i].fourth_points)?(data[i].fourth_points):('0')) +"</td>");
					appendstr+="</tr>";
					$(".table").append(appendstr);
	      		};
	    	}
	  	}
	);
	
	/*$("button").on("click", function(){
		window.location.replace("/leaderboard.html");
	});*/
});