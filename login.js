var login = function(){
  var user=$('#user').val();
  var pwd=$('#pwd').val();
  var data = {username:user, password: pwd};
  $.post( '/login', data, function(recv) {
        console.log("hidden shit");
        if (recv["error"]==0)
        {
          window.location.replace("/assignPoints.html");
        }
        else{
          alert("Incorrect username/Password");
        }
      },
       'json' // I expect a JSON response
    );
}

$(document).keypress(function(event)
{
  if(event.which == 13)
  {
    login();
  }
});