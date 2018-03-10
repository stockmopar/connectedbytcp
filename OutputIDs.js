/*
DESCRIPTION:
This file uses an alternate version of stockmopar's index.js file, called index-alt.js, which has additional functions
This File is still a work in progress
Purpose: Enable output of room and light values to the command line

Abilities:
  Tree: output all rooms and lights
  Room: output all rooms
  Lights: output all lights
  Details: switch to also output all values
  By Room: switch to just output the contents of a specific room number

Command line examples:
  list Both room and light ids in a tree
    node OutputIDs.js -T -d
    node OutputIDs.js -L -R -d
  list room ids
    node OutputIDs.js -R -d
  list light ids
    node OutputIDs.js -L -d
  list light ids for a room
    node OutputIDs.js -L -rn "Living Room" -d
    node OutputIDs.js -L -r 1 -d
*/

var helpText = '\n\nSCRIPT: OutputIDs.js\n\n';
helpText += 'Usage: node OutputIDs.js [FLAG + VALUE]... [FLAG]...\n';

helpText += 'DESCRIPTION:\n';
helpText += 'This file uses an alternate version of stockmopar\'s index.js file, called index-alt.js, which has additional functions\n';
helpText += 'This File is still a work in progress\n';
helpText += 'Purpose: Enable output of room and light values to the command line\n\n';

helpText += 'Abilities:\n';
helpText += '  Tree: output all rooms and lights\n';
helpText += '  Room: output all rooms\n';
helpText += '  Lights: output all lights\n';
helpText += '  Details: switch to also output all values\n';
helpText += '  By Room: switch to just output the contents of a specific room number\n\n';

helpText += 'Command line examples:\n';
helpText += '  list Both room and light ids in a tree\n';
helpText += '    node OutputIDs.js -T -d\n';
helpText += '    node OutputIDs.js -L -R -d\n';
helpText += '  list room ids\n';
helpText += '    node OutputIDs.js -R -d\n';
helpText += '  list light ids\n';
helpText += '    node OutputIDs.js -L -d\n';
helpText += '  list light ids for a room\n';
helpText += '    node OutputIDs.js -L -rn "Living Room" -d\n';
helpText += '    node OutputIDs.js -L -r 1 -d\n\n';

var TCPConnected = require("./index-alt.js");
var OutputIDs = new TCPConnected("192.168.3.50");

/* VARIABLES */
var roomName = "";
var roomID = -1;
var lightName = "";
var lightID = -1;
var listLights = false;
var listRooms = false;
var listAllRooms = true;
var listTree = false;
var listDetails = false;
var action = "";
var debugPrint = false;
var helpPrint = false;
var outputJSON = false;
var outS = "";

/* PROCESS ARGUMENTS */
// Output the help documentation for this file
if (process.argv.indexOf('--help') != -1) {
  helpPrint = true;
}
if (process.argv.indexOf("-L") != -1) {
  listLights = true;
}
if (process.argv.indexOf("-R") != -1) {
  listRooms = true;
}
if (process.argv.indexOf("-T") != -1) {
  listTree = true;
}
if (process.argv.indexOf("-D") != -1) {
  listDetails = true;
}
if (process.argv.indexOf("-rn") != -1) {
  roomName = process.argv[process.argv.indexOf("-rn") + 1];
}
if (process.argv.indexOf("-r") != -1) {
  roomID = process.argv[process.argv.indexOf("-r") + 1];
}
if (process.argv.indexOf("-ln") != -1) {
  lightName = process.argv[process.argv.indexOf("-ln") + 1];
}
if (process.argv.indexOf("-l") != -1) {
  lightID = process.argv[process.argv.indexOf("-l") + 1];
}
if (process.argv.indexOf("-a") != -1) {
  action = process.argv[process.argv.indexOf("-a") + 1].toLowerCase();
}
if (process.argv.indexOf("-d") != -1) {
  debugPrint = true;
}
if (process.argv.indexOf("-json") != -1) {
  outputJSON = true;
}
if (debugPrint){
  outS = "COMMAND LINE ARGUMENTS\n";
  outS += "\t" + "listLights: " + listLights + "\n";
  outS += "\t" + "listRooms: " + listRooms + "\n";
  outS += "\t" + "listTree: " + listTree + "\n";
  outS += "\t" + "listDetails: " + listDetails + "\n";
  outS += "\t" + "roomName: " + roomName + "\n";
  outS += "\t" + "roomID: " + roomID + "\n";
  outS += "\t" + "lightName: " + lightName + "\n";
  outS += "\t" + "lightID: " + lightID + "\n";
  outS += "\t" + "action: " + action + "\n";
  outS += "\t" + "debugPrint: " + debugPrint + "\n";
  outS += "\t" + "outputJSON: " + outputJSON + "\n";
  outS += "\n";
  console.log(outS);
}

if (helpPrint) {
  console.log(helpText);
} else {
  /* PRIMARY CONTROL CODE */
  OutputIDs.Init(function(error) {
    if (!error) {
      var tRooms = [];
      OutputIDs.GetState(function (error, system) {
        OutputIDs.ReturnRoomsArray(function(error, tR) {
          tRooms = tR;
          var rCount = 0;
          if (outputJSON) {
            var jsonS = "[";
            tRooms.forEach(function(room) {
              if (rCount > 0) jsonS += ",";
              else rCount++;
              jsonS += '{"r":' + room.rid;
              var rState = 0;

              var jsonSSUB = "";
              var devices = room.device;
              var dCount = 0;
              var lCount = 0;

              if (typeof devices.did !== "undefined") {
                if (dCount > 0) jsonSSUB += ",";
                jsonSSUB +=
                  '{"l":"' + devices.did + '","s":' + devices.state;
                if (isNaN(devices.level)) {
                  jsonSSUB += ',"ll":0';
                } else {
                  jsonSSUB += ',"ll":' + devices.level;
                  lCount += parseInt(devices.level);
                }

                if (devices.offline == "1") jsonSSUB += ',"o":1';
                else jsonSSUB += ',"o":0';

                if (devices.state != "0") rState = 1;

                jsonSSUB += "}";
                dCount += 1;
              } else {
                devices.forEach(function(device) {
                  if (dCount > 0) jsonSSUB += ",";
                  jsonSSUB +=
                    '{"l":"' + device.did + '","s":' + device.state;
                  if (isNaN(device.level)) {
                    jsonSSUB += ',"ll":0';
                  } else {
                    jsonSSUB += ',"ll":' + device.level;
                    lCount += parseInt(device.level);
                  }

                  if (device.offline == "1") jsonSSUB += ',"o":1';
                  else jsonSSUB += ',"o":0';

                  if (device.state != "0") rState = 1;

                  jsonSSUB += "}";
                  dCount += 1;
                });
              }

              jsonS += ',"s":' + rState;
              jsonS += ',"ll":' + lCount / dCount;
              jsonS += ',"d":[' + jsonSSUB + "]}";
            });
            jsonS += "]";
            console.log(jsonS);
          } else if (listTree || (listRooms && listLights)) {
            listAllRooms = true;
            if (roomID != -1) listAllRooms = false;
            outS = "";
            tRooms.forEach(function(room) {
              if (listAllRooms || room.rid == roomID) {
                outS += "rid: " + room.rid + "\n";
                outS += "name: " + room.name + "\n";
                outS += "color: " + room.color + "\n";
                if (listDetails) {
                  outS += "\t" + "desc: " + room.desc + "\n";
                  outS += "\t" + "known: " + room.known + "\n";
                  outS += "\t" + "type: " + room.type + "\n";
                  outS += "\t" + "colorid: " + room.colorid + "\n";
                  outS += "\t" + "img: " + room.img + "\n";
                  outS += "\t" + "power: " + room.power + "\n";
                  outS += "\t" + "poweravg: " + room.poweravg + "\n";
                  outS += "\t" + "energy: " + room.energy + "\n";
                }
                var devices = room.device;
                outS += "\n";

                if (typeof devices.did !== "undefined") {
                  outS += "\t\t" + "did: " + devices.did + "\n";
                  outS += "\t\t" + "name: " + devices.name + "\n";
                  outS += "\t\t" + "state: " + devices.state + "\n";
                  outS += "\t\t" + "level: " + devices.level + "\n";
                  if (listDetails) {
                    outS += "\t\t\t" + "known: " + devices.known + "\n";
                    outS += "\t\t\t" + "lock: " + devices.lock + "\n";
                    outS += "\t\t\t" + "offline: " + devices.offline + "\n";
                    outS += "\t\t\t" + "node: " + devices.node + "\n";
                    outS += "\t\t\t" + "port: " + devices.port + "\n";
                    outS += "\t\t\t" + "nodetype: " + devices.nodetype + "\n";
                    outS += "\t\t\t" + "colorid: " + devices.colorid + "\n";
                    outS += "\t\t\t" + "type: " + devices.type + "\n";
                    outS += "\t\t\t" + "rangemin: " + devices.rangemin + "\n";
                    outS += "\t\t\t" + "power: " + devices.power + "\n";
                    outS += "\t\t\t" + "poweravg: " + devices.poweravg + "\n";
                    outS += "\t\t\t" + "energy: " + devices.energy + "\n";
                    outS += "\t\t\t" + "score: " + devices.score + "\n";
                    outS += "\t\t\t" + "productid: " + devices.productid + "\n";
                    outS += "\t\t\t" + "prodbrand: " + devices.prodbrand + "\n";
                    outS += "\t\t\t" + "prodmodel: " + devices.prodmodel + "\n";
                    outS += "\t\t\t" + "prodtype: " + devices.prodtype + "\n";
                    outS += "\t\t\t" + "prodtypeid: " + devices.prodtypeid + "\n";
                    outS += "\t\t\t" + "classid: " + devices.classid + "\n";
                    outS += "\t\t\t" + "subclassid: " + devices.subclassid + "\n";
                  }
                  outS += "\n";
                } else {
                  devices.forEach(function (device) {
                    outS += "\t\t" + "did: " + device.did + "\n";
                    outS += "\t\t" + "name: " + device.name + "\n";
                    outS += "\t\t" + "tate: " + device.state + "\n";
                    outS += "\t\t" + "level: " + device.level + "\n";
                    if (listDetails) {
                      outS += "\t\t\t" + "known: " + device.known + "\n";
                      outS += "\t\t\t" + "lock: " + device.lock + "\n";
                      outS += "\t\t\t" + "offline: " + device.offline + "\n";
                      outS += "\t\t\t" + "node: " + device.node + "\n";
                      outS += "\t\t\t" + "port: " + device.port + "\n";
                      outS += "\t\t\t" + "nodetype: " + device.nodetype + "\n";
                      outS += "\t\t\t" + "colorid: " + device.colorid + "\n";
                      outS += "\t\t\t" + "type: " + device.type + "\n";
                      outS += "\t\t\t" + "rangemin: " + device.rangemin + "\n";
                      outS += "\t\t\t" + "power: " + device.power + "\n";
                      outS += "\t\t\t" + "poweravg: " + device.poweravg + "\n";
                      outS += "\t\t\t" + "energy: " + device.energy + "\n";
                      outS += "\t\t\t" + "score: " + device.score + "\n";
                      outS += "\t\t\t" + "productid: " + device.productid + "\n";
                      outS += "\t\t\t" + "prodbrand: " + device.prodbrand + "\n";
                      outS += "\t\t\t" + "prodmodel: " + device.prodmodel + "\n";
                      outS += "\t\t\t" + "prodtype: " + device.prodtype + "\n";
                      outS += "\t\t\t" + "prodtypeid: " + device.prodtypeid + "\n";
                      outS += "\t\t\t" + "classid: " + device.classid + "\n";
                      outS += "\t\t\t" + "subclassid: " + device.subclassid + "\n";
                    }
                    outS += "\n";
                  });
                }
              }
            });
            console.log(outS);
          } else if (listRooms) {
            listAllRooms = true;
            if (roomID != -1) listAllRooms = false;
            outS = "";
            tRooms.forEach(function(room) {
              if (listAllRooms || room.rid == roomID) {
                outS += "rid: " + room.rid + "\n";
                outS += "name: " + room.name + "\n";
                outS += "color: " + room.color + "\n";
                if (listDetails) {
                  outS += "\t" + "desc: " + room.desc + "\n";
                  outS += "\t" + "known: " + room.known + "\n";
                  outS += "\t" + "type: " + room.type + "\n";
                  outS += "\t" + "colorid: " + room.colorid + "\n";
                  outS += "\t" + "img: " + room.img + "\n";
                  outS += "\t" + "power: " + room.power + "\n";
                  outS += "\t" + "poweravg: " + room.poweravg + "\n";
                  outS += "\t" + "energy: " + room.energy + "\n";
                }
                outS += "\n";
              }
            });
            console.log(outS);
          } else if (listLights) {
            listAllRooms = true;
            if (roomID != -1) listAllRooms = false;
            outS = "";
            tRooms.forEach(function(room) {
              var devices = room.device;
              if (listAllRooms || room.rid == roomID) {
                if (typeof devices.did !== "undefined") {
                  outS += "did: " + devices.did + "\n";
                  outS += "name: " + devices.name + "\n";
                  outS += "state: " + devices.state + "\n";
                  outS += "level: " + devices.level + "\n";
                  if (listDetails) {
                    outS += "\t" + "known: " + devices.known + "\n";
                    outS += "\t" + "lock: " + devices.lock + "\n";
                    outS += "\t" + "offline: " + devices.offline + "\n";
                    outS += "\t" + "node: " + devices.node + "\n";
                    outS += "\t" + "port: " + devices.port + "\n";
                    outS += "\t" + "nodetype: " + devices.nodetype + "\n";
                    outS += "\t" + "colorid: " + devices.colorid + "\n";
                    outS += "\t" + "type: " + devices.type + "\n";
                    outS += "\t" + "rangemin: " + devices.rangemin + "\n";
                    outS += "\t" + "power: " + devices.power + "\n";
                    outS += "\t" + "poweravg: " + devices.poweravg + "\n";
                    outS += "\t" + "energy: " + devices.energy + "\n";
                    outS += "\t" + "score: " + devices.score + "\n";
                    outS += "\t" + "productid: " + devices.productid + "\n";
                    outS += "\t" + "prodbrand: " + devices.prodbrand + "\n";
                    outS += "\t" + "prodmodel: " + devices.prodmodel + "\n";
                    outS += "\t" + "prodtype: " + devices.prodtype + "\n";
                    outS += "\t" + "prodtypeid: " + devices.prodtypeid + "\n";
                    outS += "\t" + "classid: " + devices.classid + "\n";
                    outS += "\t" + "subclassid: " + devices.subclassid + "\n";
                  }
                  outS += "\n";
                } else {
                  devices.forEach(function(device) {
                    outS += "did: " + device.did + "\n";
                    outS += "name: " + device.name + "\n";
                    outS += "tate: " + device.state + "\n";
                    outS += "level: " + device.level + "\n";
                    if (listDetails) {
                      outS += "\t" + "known: " + device.known + "\n";
                      outS += "\t" + "lock: " + device.lock + "\n";
                      outS += "\t" + "offline: " + device.offline + "\n";
                      outS += "\t" + "node: " + device.node + "\n";
                      outS += "\t" + "port: " + device.port + "\n";
                      outS += "\t" + "nodetype: " + device.nodetype + "\n";
                      outS += "\t" + "colorid: " + device.colorid + "\n";
                      outS += "\t" + "type: " + device.type + "\n";
                      outS += "\t" + "rangemin: " + device.rangemin + "\n";
                      outS += "\t" + "power: " + device.power + "\n";
                      outS += "\t" + "poweravg: " + device.poweravg + "\n";
                      outS += "\t" + "energy: " + device.energy + "\n";
                      outS += "\t" + "score: " + device.score + "\n";
                      outS += "\t" + "productid: " + device.productid + "\n";
                      outS += "\t" + "prodbrand: " + device.prodbrand + "\n";
                      outS += "\t" + "prodmodel: " + device.prodmodel + "\n";
                      outS += "\t" + "prodtype: " + device.prodtype + "\n";
                      outS += "\t" + "prodtypeid: " + device.prodtypeid + "\n";
                      outS += "\t" + "classid: " + device.classid + "\n";
                      outS += "\t" + "subclassid: " + device.subclassid + "\n";
                    }
                    outS += "\n";
                  });
                }
              }
            });
            console.log(outS);
          }
          OutputIDs.GWEnd();
        });
      });
    } else {
      console.log("There was an issue initializing the token");
      if (debugPrint) console.log(error.message);
    }
  });
}