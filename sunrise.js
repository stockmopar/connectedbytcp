// Original by kevincoleman with modifications by stockmopar

// requires & definitions
var TCPConnected = require('./index.js');
Sunrise = new TCPConnected("192.168.1.137");

//user vars
var room = 'Bedroom';
var fadeDuration = 1;
var step = 4;
var sunrise;
// script
var updateFadeLevel = function() {
  Sunrise.GetState(function(error,system){
	Sunrise.GetRoomStateByName(room, function(error,state,level){
		if(state == 0){
			Sunrise.TurnOnRoomWithLevelByName(room, 1, function(){
				sunrise = setTimeout(updateFadeLevel, (fadeDuration * 60));
			});
		}else{
			if (level >= 100) {
			  console.log('Lights are all the way on.');
			  clearInterval(sunrise);
			  Sunrise.GWEnd();
			} else {
			  Sunrise.SetRoomLevelByName(room, Math.min(100,level+step), function(){
				sunrise = setTimeout(updateFadeLevel, (fadeDuration * 60));
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