function city_li () {
  console.log("Yo");
  $(".dropdown-toggle.city_name").html($(this).html());
  console.log($(this).html());
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
          
          appendstr = "<li event_id="+ i +" id=event_li> " + stuff["data"][i]["event_name"] + " </li>";
          //console.log(appendstr);
          $(".dropdown-menu.event_name").append(appendstr);
        
        };
        
        $("#event_li").on("click", function()
        {
          $(".dropdown-toggle.event_name").html($(this).html());
        }
        
        ); 
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
          appendstr = "<li city_id="+ i +" id=city_li onclick=\"city_li(this)\"> " + stuff["data"][i]["city_name"] + " </li>";
          //console.log(appendstr);
          $(".dropdown-menu.city_name").append(appendstr);
          
        };
        console.log("This is annoying: "+ $("#city_li").first().html());

        $("#city_li").on("click", function()
        {
          console.log("Yo");
          $(".dropdown-toggle.city_name").html($(this).html());
          console.log($(this).html());
        }
        
        ); 
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