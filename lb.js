function details (clg_id) {
	//alert(clg_id);
	window.location.replace("/details.html?id="+clg_id);
}
$(document).ready(function(){
	/*var events;
	$.ajax(
	  	{
	    	type: 'GET',
	    	url: 'http://moodi.org/api/events',
	    	success: function(data)
	    	{
	      		events=data;
	      		
	    	}
	  	}
	);*/
	$.get("/leaderboard",function(data){
		for (var i = 0; i < data.length; i++) {

			var gold = (data[i].first)?(data[i].first.split(",").length):(0);
			var silver = (data[i].second)?(data[i].second.split(",").length):(0);
			var bronze = (data[i].third)?(data[i].third.split(",").length):(0);
			var H = (data[i].fourth)?(data[i].fourth.split(",").length):(0);
			var appendstr="";
			appendstr+="<tr>";
			appendstr+=("<td value="+data[i].clg_id+" onclick=details("+data[i].clg_id+")>"+data[i].clg_name+"</td>");
			appendstr+=("<td>"+data[i].points+"</td>");
			appendstr+=("<td>"+gold+"</td>");
			appendstr+=("<td>"+silver+"</td>");
			appendstr+=("<td>"+bronze+"</td>");
			appendstr+=("<td>"+H+"</td>");
			appendstr+="</tr>"
			$(".table").append(appendstr);
		};
	})

});