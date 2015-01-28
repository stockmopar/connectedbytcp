// requires & definitions
var TCPConnected = require('./index.js');
Sunrise = new TCPConnected("10.0.1.3");

//user vars
var room = 'Bedroom';
var fadeDuration = 30;
var step = 1;
var sunrise;

// script
var updateFadeLevel = function() {
  Sunrise.GetState(function(error,system){
  	Sunrise.GetRoomStateByName(room, function(error,state,level){
  		if(state == 0){
  			Sunrise.TurnOnRoomWithLevelByName(room, 1, function(){
  				sunrise = setTimeout(updateFadeLevel, (fadeDuration * 600));
  			});
  		}else{
  			if (level >= 100) {
  			  console.log('Lights are all the way on.');
  			  clearInterval(sunrise);
  			  Sunrise.GWEnd();
  			} else {
  			  Sunrise.SetRoomLevelByName(room, Math.min(100,level+step), function(){
  				sunrise = setTimeout(updateFadeLevel, (fadeDuration * 600));
  			  } );
  			}
  		}
  	});
  });
}

// run the script
Sunrise.Init(function(error){
	if(!error){
		sunrise = setTimeout(updateFadeLevel, (fadeDuration * 60));
	}else{
		console.log("There was an issue initializing the token");
	}
});
