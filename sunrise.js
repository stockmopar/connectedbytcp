// requires & definitions
var TCPConnected = require('./index.js');
Sunrise = new TCPConnected("10.0.1.35");
var time = new Date();
var level = 0;

//user vars
var room = 'Bedroom';
var fadeDuration = 30;



// script
var updateFadeLevel = function() {
  Sunrise.GetState(function(error,system){
    
    // report status
	Sunrise.GetRoomStateByName(room, function(error,state,level){
		console.log("State: " + state + " at Level: " + level);
	});
    
    // set bulb brightness
	Sunrise.SetRoomLevelByName(room, level);
    
    // turn the light on if it’s switched off
	if(state == 0){
		Sunrise.TurnOnRoomByName(room);
	}
    
    // stop incrementing if they’re all the way on...
    if (level >= 100) {
      console.log('Lights are all the way on.');
      clearInterval(sunrise);
    } else {
      // ... or increment light level
      level++;
    }
    
  });
}

// run the script
var sunrise = setInterval(updateFadeLevel, (fadeDuration * 60));