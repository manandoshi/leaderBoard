function getColleges (id) {
  $.post('http://moodi.org/api/college', {"city": id}, function(data){
      //console.log("success?");
      //console.log(data);
      $(".select-college").html("");
      stuff = data;
      for (var i = data["data"].length - 1; i >= 0; i--) {
        //data["data"][i]
        appendstr = "<option value="+ stuff["data"][i]["clg_id"] +"> " + stuff["data"][i]["clg_name"] + " </option>";
        $(".select-college").append(appendstr);
      };
  });
}

function submit () {
  var position = $(".select-position").children().filter(":selected")[0].value;
  var url = "/addResult";
  var clg_id = $(".select-college").children().filter(":selected")[0].value;
  var clg_name = $(".select-college").children().filter(":selected").html();
  var event_id = $(".select-event").children().filter(":selected")[0].value;
  var points = $("#points").val();

  console.log("position:", position);
  $.post(url, {"clg_id": clg_id, "clg_name": clg_name, "event_id": event_id,"points":points, "position":position}, function(data){
    alert(data.message);
    //console.log(data);
  });

}

$(document).ready(function()
{
  $.ajax(
    {
      type: 'GET',
      url: 'http://moodi.org/api/events',
      success: function(data)
      {
        stuff=data;
        for (var i = 0; i < stuff["data"].length; i++) 
        {
          //console.log(stuff[i]["event_name"]);
          
          appendstr = "<option value="+ stuff["data"][i]["event_id"] +">" + stuff["data"][i]["event_name"] + "</option>";
          //console.log(appendstr);
          $(".select-event").append(appendstr);
          //console.log(appendstr);
        
        };
      }
    }
  );

  $.ajax(
    {
      type: 'GET',
      url: 'http://moodi.org/api/city',
      success: function(data)
      {
        
        stuff=data;
        for (var i = 0; i < stuff["data"].length; i++) 
        {
          //console.log(stuff[i]["event_name"]);
          
          appendstr = "<option value="+ stuff["data"][i]["city_id"] +" onclick='getColleges(this.value)'> " + stuff["data"][i]["city_name"] + " </option>";
          //console.log(appendstr);
          $(".select-city").append(appendstr);
          //console.log(appendstr);
        
        }; 
      }
    }
  );

  /*$.ajax(
    {
      type: 'POST',
      url: 'http://moodi.org/api/college',
      success: function(data)
      {
        stuff=data;
        for (var i = 0; i < stuff["data"].length; i++) 
        {
          appendstr = "<li city_id="+ i +" id=city_li> " + stuff["data"][i]["city_name"] + " </li>";
          console.log(appendstr);
          $(".dropdown-menu.city_name").append(appendstr);
        
        };
        
        $("#city_li").on("click", function()
        {
          $(".dropdown-toggle.city_name").html($(this).html());
        }
        
        ); 
      }
    }
  );*/
  
}); 