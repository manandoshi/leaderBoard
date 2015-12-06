function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function(){
	id=getUrlVars().id;
	//$.get("/eventlistshort",function(data){
	//	var events = data;
	$.post("/details",{"clg_id":id},function(data){
		console.log(data.first[0].event_name);
		$("h1").html(data.clg_name);
		console.log(data);
		for (var i = 0; i < Math.max(((data.first)?(data.first.length):(0)),((data.second)?(data.second.length):(0)),((data.third)?(data.third.length):(0)),((data.fourth)?(data.fourth.length):(0))); i++) {
			console.log("umm");
			var appendstr = "";
			appendstr += "<tr>";
			appendstr += "<td>"+((data.first[i])?(data.first[i].event_name):(" "))+"</td>";
			appendstr += "<td>"+((data.first[i])?(data.first[i].first_points):(" "))+"</td>";
			appendstr += "<td>"+((data.second[i])?(data.second[i].event_name):(" "))+"</td>";
			appendstr += "<td>"+((data.second[i])?(data.second[i].second_points):(""))+"</td>";
			appendstr += "<td>"+((data.third[i])?(data.third[i].event_name):(" "))+"</td>";
			appendstr += "<td>"+((data.third[i])?(data.third[i].third_points):(" "))+"</td>";
			appendstr += "<td>"+((data.fourth[i])?(data.fourth[i].event_name):(" "))+"</td>";
			appendstr += "<td>"+((data.fourth[i])?(data.fourth[i].fourth_points):(" "))+"</td>";
			appendstr += "</tr>";
			//appendstr.replace("undefined", "-");
			console.log(appendstr);
			$("table").append(appendstr);
		};

	});
	//});
	
});