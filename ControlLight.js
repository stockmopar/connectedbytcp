/*
DESCRIPTION:
This file uses an alternate version of stockmopar's index.js file, called index-alt.js, which has additional functions
This File is still a work in progress

Purpose: Enable control of lights via command line

Abilities: 
  State: by name or lid
  Toggle: by name or lid
  ON: by name or lid
  OFF: by name or lid
  ON: by name or lid
  ON with light level: by name or lid

Command line examples:
  get light state
    node ControlLight.js -a 'state' -ln 'Floor lamp' -d
    node ControlLight.js -a 'state' -l 216799804394159703 -d
  turn on light
    node ControlLight.js -a 'toggle' -ln 'Floor lamp' -d
    node ControlLight.js -a 'toggle' -l 216799804394159703 -d
  turn on light
    node ControlLight.js -a 'on' -ln 'Floor lamp' -d
    node ControlLight.js -a 'on' -l 216799804394159703 -d
  turn off light
    node ControlLight.js -a 'off' -ln 'Floor lamp' -d
    node ControlLight.js -a 'off' -l 216799804394159703 -d
  set light to level
    node ControlLight.js -a 'level' -ln 'Floor lamp' -ll 75 -d
    node ControlLight.js -a 'level' -l 216799804394159703 -ll 75 -d
*/


var helpText = '\n\nSCRIPT: ControlLight.js\n\n';
helpText += 'Usage: node ControlLight.js [FLAG + VALUE]... [FLAG]...\n';

helpText += 'DESCRIPTION:\n';
helpText += 'This file uses an alternate version of stockmopar\'s index.js file, called index-alt.js, which has additional functions\n';
helpText += 'This File is still a work in progress, some call types won\'t work until the index-alt.js file is complete\n\n';
helpText += 'Purpose: Enable control of individual lights via command line\n\n';
helpText += 'MANDATORY ARGUMENTS\n';
helpText += '	-a, 				Action type\n';
helpText += 'AVAILABLE ACTION TYPES\n';
helpText += '		\'state\'     Return light current state\n';
helpText += '		\'toggle\'    Change light state\n';
helpText += '		\'on\'        Turn light on\n';
helpText += '		\'off\'       Turn light off\n';
helpText += '		\'level\'     Change light level\n';
helpText += '	-l				Light ID (example: 216799804394159703)\n';
helpText += '      or\n';
helpText += '	-ln				Light Name (example: \'Floor lamp\') - double quotes required\n\n';
helpText += 'OPTIONAL ARGUMENTS\n';
helpText += '	-ll				Desired Light Level (example: 75)\n';
helpText += '	-d				Enable debugging output\n';


var TCPConnected = require('./index-alt.js');
var ControlLight = new TCPConnected('192.168.3.50');

/* VARIABLES */
var lightName = '';
var lightID = -1;
var lightState = '';
var lightLevel = -1;
var action = '';
var debugPrint = false;
var helpPrint = false;
var outS = "";

/* PROCESS ARGUMENTS - parse all command line arguments and load them into variables for later use */
// Output the help documentation for this file
if (process.argv.indexOf('--help') != -1) {
  helpPrint = true;
}
// Check for Light Name argument
if (process.argv.indexOf('-ln') != -1) {
  lightName = process.argv[process.argv.indexOf('-ln') + 1];
}
// Check for Light ID argument
if (process.argv.indexOf('-l') != -1) {
  lightID = process.argv[process.argv.indexOf('-l') + 1];
}
// Check for Light State argument
if (process.argv.indexOf('-ls') != -1) {
  lightState = process.argv[process.argv.indexOf('-ls') + 1];
}
// Check for Light Level argument
if (process.argv.indexOf('-ll') != -1) {
  lightLevel = process.argv[process.argv.indexOf('-ll') + 1];
}
// Check for Action argument
if (process.argv.indexOf('-a') != -1) {
  action = process.argv[process.argv.indexOf('-a') + 1].toLowerCase();
}
// Check for Debug argument
if (process.argv.indexOf('-d') != -1) {
  debugPrint = true;
}

if (debugPrint) {
  outS = "COMMAND LINE ARGUMENTS\n";
  outS += "\t" + "lightName: " + lightName + "\n";
  outS += "\t" + "lightID: " + lightID + "\n";
  outS += "\t" + "lightState: " + lightState + "\n";
  outS += "\t" + "action: " + action + "\n";
  outS += "\t" + "debugPrint: " + debugPrint + "\n";
  outS += "\n";
  console.log(outS);
}

if (helpPrint) {
  console.log(helpText);
} else {
  /* PRIMARY CONTROL CODE */
  ControlLight.Init(function(error) {
    if (!error) {
      ControlLight.GetState(function(error, system) {
        if (action == 'state') {
          //Get light State
          if (lightID != -1) {
            //process by ID
            ControlLight.GetDeviceState(lightID, function(error, state, level) {
              if (debugPrint)
                console.log('State: ' + state + ' at Level: ' + level);
              if (state == 1) console.log('ON,' + level);
              else console.log('OFF,' + level);
              ControlLight.GWEnd();
            });
          } else if (lightName != '') {
            //process by Name
            ControlLight.GetDeviceStateByName(lightName, function(
              error,
              state,
              level
            ) {
              if (debugPrint)
                console.log('State: ' + state + ' at Level: ' + level);
              if (state == 1) console.log('ON,' + level);
              else console.log('OFF,' + level);
              ControlLight.GWEnd();
            });
          }
        } else if (action == 'toggle') {
          //change state of Light
          if (lightID != -1) {
            //process by ID
            ControlLight.GetDeviceState(lightID, function(error, state, level) {
              if (debugPrint)
                console.log('State: ' + state + ' at Level: ' + level);
              if (state == 1) {
                ControlLight.TurnOffDevice(lightID, function(error) {
                  if (error) console.error(error.message);
                  ControlLight.GWEnd();
                });
              } else {
                ControlLight.TurnOnDevice(lightID, function(error) {
                  if (error) console.error(error.message);
                  ControlLight.GWEnd();
                });
              }
            });
          } else if (lightName != '') {
            //process by Name
            ControlLight.GetDeviceStateByName(lightName, function(
              error,
              state,
              level
            ) {
              if (state == 1) {
                ControlLight.TurnOffDeviceByName(lightName, function(error) {
                  if (error) console.error(error.message);
                  ControlLight.GWEnd();
                });
              } else {
                ControlLight.TurnOnDeviceByName(lightName, function(error) {
                  if (error) console.error(error.message);
                  ControlLight.GWEnd();
                });
              }
            });
          }
        } else if (action == 'on') {
          //Turn On Light
          if (lightID != -1) {
            //process by ID
            ControlLight.TurnOnDevice(lightID, function(error) {
              if (error) console.error(error.message);
              ControlLight.GWEnd();
            });
          } else if (lightName != '') {
            //process by Name
            ControlLight.TurnOnDeviceByName(lightName, function(error) {
              if (error) console.error(error.message);
              ControlLight.GWEnd();
            });
          }
        } else if (action == 'off') {
          //Turn Off Light
          if (lightID != -1) {
            //process by ID
            ControlLight.TurnOffDevice(lightID, function(error) {
              if (error) console.error(error.message);
              ControlLight.GWEnd();
            });
          } else if (lightName != '') {
            //process by Name
            ControlLight.TurnOffDeviceByName(lightName, function(error) {
              if (error) console.error(error.message);
              ControlLight.GWEnd();
            });
          }
        } else if (action == 'level') {
          //Set Light to Level
          if (lightID != -1) {
            //process by ID
            ControlLight.GetDeviceState(lightID, function(error, state, level) {
              if (state == 1) {
                ControlLight.SetDeviceLevel(lightID, lightLevel, function(
                  error
                ) {
                  if (error) console.error(error.message);
                  ControlLight.GWEnd();
                });
              } else {
                ControlLight.TurnOnDeviceWithLevel(
                  lightID,
                  lightLevel,
                  function(error) {
                    if (error) console.error(error.message);
                    ControlLight.GWEnd();
                  }
                );
              }
            });
          } else if (lightName != '') {
            //process by Name
            ControlLight.GetDeviceStateByName(lightName, function(
              error,
              state,
              level
            ) {
              if (state == 1) {
                ControlLight.SetDeviceLevelByName(
                  lightName,
                  lightLevel,
                  function(error) {
                    if (error) console.error(error.message);
                    ControlLight.GWEnd();
                  }
                );
              } else {
                ControlLight.TurnOnDeviceWithLevelByName(
                  lightName,
                  lightLevel,
                  function(error) {
                    if (error) console.error(error.message);
                    ControlLight.GWEnd();
                  }
                );
              }
            });
          }
        }
      });
    } else {
      console.log('There was an issue initializing the token');
      if (debugPrint) console.log(error.message);
    }
  });
}
