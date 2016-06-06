const BluetoothDevice = require('web-bluetooth');
/**
 * Services:
 *  - fa00 - contains 'write without response' characteristics starting with fa...
 *  - fb00 - contains 'notify' characteristics starting with fb...
 *  - fc00 - contains 'write' characteristic ffc1, not currently used
 *  - fd21 - contains 'read write notify' characteristics fd22, fd23, fd24
 *  - fd51 - contains 'read write notify' characteristics fd52, fd53, fd54
 *  - fe00 - contains characteristics fe01, fe02, not currently used
 */

'use strict';
let liftLandFlipService = makeUUID('fa00'),
    liftLandFlipCharacteristic = makeUUID('fa0b'),
    service1 = makeUUID('fb00'),
    s1Char1 = makeUUID('fb0f'),
    s1Char2 = makeUUID('fb0e'),
    s1Char3 = makeUUID('fb1b'),
    s1Char4 = makeUUID('fb1c'),
    service2 = makeUUID('fd21'),
    s2Char1 = makeUUID('fd22'),
    s2Char2 = makeUUID('fd23'),
    s2Char3 = makeUUID('fd24'),
    service3 = makeUUID('fd51'),
    s3Char1 = makeUUID('fd52'),
    s3Char2 = makeUUID('fd53'),
    s3Char3 = makeUUID('fd54'),
    liftRawValue = [4, steps.fa0b++, 2, 0, 1, 0],
    flipRawValue = [4, steps.fa0b++, 2, 4, 0, 0, 2, 0, 0, 0],
    landRawValue = [4, steps.fa0b++, 2, 0, 3, 0];

const blue = new BluetoothDevice(
  {namePrefix: 'T',
  optional_services: [service1,service2,service3,liftLandFlipService]
});
let connectButton = document.getElementById('connectBtn'),
    takeOffButton = document.getElementById('takeOffBtn'),
    flipButton = document.getElementById('flipBtn'),
    landButton = document.getElementById('landBtn'),
    emergencyButton = document.getElementById('emergencyBtn'),
    disconnectButton = document.getElementById('disconnectBtn'),
    steps = {
      'fa0a': 1,
      'fa0b': 1,
      'fa0c': 1
    };

function makeUUID(uniqueSegment) {
  return '9a66' + uniqueSegment + '-0800-9191-11e4-012d1540cb8e';
}

function prepWriteValue(commandArray) {
  var buffer = new ArrayBuffer(commandArray.length);
  var command = new Uint8Array(buffer);
  command.set(commandArray);
  return command;
}

blue.addCharacteristic(liftLandFlipCharacteristic,liftLandFlipService,['read','write','notify']);
blue.addCharacteristic(s1Char1,service1,['read','write','notify']);
blue.addCharacteristic(s1Char2,service1,['read','write','notify']);
blue.addCharacteristic(s1Char3,service1,['read','write','notify']);
blue.addCharacteristic(s1Char4,service1,['read','write','notify']);
blue.addCharacteristic(s2Char1,service2,['read','write','notify']);
blue.addCharacteristic(s2Char2,service2,['read','write','notify']);
blue.addCharacteristic(s2Char3,service2,['read','write','notify']);
blue.addCharacteristic(s3Char1,service3,['read','write','notify']);
blue.addCharacteristic(s3Char2,service3,['read','write','notify']);
blue.addCharacteristic(s3Char3,service3,['read','write','notify']);

connectButton.addEventListener('click', () => {
    $('.spinner').show();
    blue.connect().then(()=>{
      blue.startNotifications(s1Char1, e =>{console.log('in')});
      blue.startNotifications(s1Char2, e =>{console.log('in')});
      blue.startNotifications(s1Char3, e =>{console.log('in')});
      blue.startNotifications(s1Char3, e =>{console.log('in')});
      blue.startNotifications(s2Char1, e =>{console.log('in')});
      blue.startNotifications(s2Char2, e =>{console.log('in')});
      blue.startNotifications(s2Char3, e =>{console.log('in')});
      blue.startNotifications(s1Char1, e =>{console.log('in')});
      blue.startNotifications(s2Char2, e =>{console.log('in')});
      blue.startNotifications(s3Char3, e =>{console.log('in')});
      $('.spinner').hide();
      $('.connected-footer').show();
      $('#connected-controls').show();
      $('#app-status').text = 'Connected!'
    });
});

takeOffButton.addEventListener('click', () => {
  let preppedValue = prepWriteValue(liftRawValue);
  blue.writeValue(liftLandFlipCharacteristic, preppedValue);
});

flipButton.addEventListener('click', () => {
  let preppedValue = prepWriteValue(flipRawValue);
  blue.writeValue(liftLandFlipCharacteristic, preppedValue);
});

landButton.addEventListener('click', () => {
  let preppedValue = prepWriteValue(landRawValue);
  blue.writeValue(liftLandFlipCharacteristic, preppedValue);
});

// emergencyButton.addEventListener('click', () => {
//   console.log('emergency!');
//   emergencyCutOff();
// });

disconnectButton.addEventListener('click', () => {
  blue.disconnect();
});


// 'Travis_' for Airborne Cargo drone. Change to 'RS_' for Rolling Spider.
// const DRONE_BLUETOOTH_NAME_PREFIX = 'Travis_';
//
// let App = function() {
//
//   let connectButton = document.getElementById('connectBtn'),
//     takeOffButton = document.getElementById('takeOffBtn'),
//     flipButton = document.getElementById('flipBtn'),
//     landButton = document.getElementById('landBtn'),
//     emergencyButton = document.getElementById('emergencyBtn'),
//     disconnectButton = document.getElementById('disconnectBtn'),
//     connected = false,
//     droneDevice = null,
//     gattServer = null,
//     // Used to store the 'counter' that's sent to each characteristic
//     steps = {
//       'fa0a': 1,
//       'fa0b': 1,
//       'fa0c': 1
//     },
//     services = {},
//     characteristics = {};
//
//
//   function getUUID(uniqueSegment) {
//     return '9a66' + uniqueSegment + '-0800-9191-11e4-012d1540cb8e';
//   }
//
//   function startNotificationsForCharacteristic(serviceID, characteristicID) {
//
//     console.log('Start notifications for', characteristicID);
//
//     return new Promise((resolve, reject) => {
//       return _getCharacteristic(serviceID, characteristicID)
//         .then(characteristic => {
//           console.log('Got characteristic, now start notifications', characteristicID, characteristic);
//           characteristic.startNotifications()
//             .then(() => {
//               console.log('Started notifications for', characteristicID);
//
//               characteristic.addEventListener('characteristicvaluechanged', event => {
//
//                 console.log('Notification from:', characteristicID, event);
//
//                 const value = event.target.value;
//
//                 if (characteristicID === 'fb0e') {
//
//                   var eventList = ['fsLanded', 'fsTakingOff', 'fsHovering',
//                     'fsUnknown', 'fsLanding', 'fsCutOff'];
//
//                   var array = new Uint8Array(value);
//
//                   if (eventList[array[6]] === 'fsHovering') {
//                     console.log('Hovering - ready to go');
//                   } else {
//                     console.log('Not hovering... Not ready', array[6]);
//                   }
//                   if ([1, 2, 3, 4].indexOf(array[6]) >= 0) {
//                     console.log('Flying');
//                   }
//                   else {
//                     console.log('Not flying');
//                   }
//
//                 }
//               });
//
//               resolve();
//           });
//
//         })
//         .catch(error => {
//           console.error('startNotifications error', error);
//           reject();
//         });
//     });
//
//   }
//
//   function discover() {
//     console.log('Searching for drone...');
//     return navigator.bluetooth.requestDevice({
//         filters: [
//           {
//             namePrefix: DRONE_BLUETOOTH_NAME_PREFIX
//           },
//           {
//             services: [
//               getUUID('fa00'),
//               getUUID('fb00'),
//               getUUID('fd21'),
//               getUUID('fd51')
//             ]
//           }
//         ]
//       })
//       .then((device) => {
//         console.log('Discovered drone', device);
//         droneDevice = device;
//       });
//   }
//
//   /**
//    * XXX Not sure why we need to keep calling this, but if we don't, we often get "GATT Service no longer exists" errors
//    */
//   function connectGATT() {
//
//     console.log('Connect GATT');
//
//     return droneDevice.gatt.connect()
//       .then(server => {
//         console.log('GATT server', server);
//         gattServer = server;
//       });
//   }
//
//   function _getService(serviceID) {
//
//     return new Promise((resolve, reject) => {
//
//       const service = services[serviceID];
//
//       // If we already have it cached...
//       /*
//       if (service) {
//         console.log('Return cached service', service);
//         resolve(service);
//       } else {
//       */
//
//         console.log('Get service', getUUID(serviceID));
//
//         return gattServer.getPrimaryService(getUUID(serviceID))
//           .then(service => {
//             console.log('Obtained service', service);
//             services[serviceID] = service;
//             resolve(service);
//           })
//           .catch(error => {
//             console.error('_getService error', error);
//             reject(error);
//           });
//
//       //}
//
//     });
//
//   }
//
//   function _getCharacteristic(serviceID, characteristicID) {
//
//     return new Promise((resolve, reject) => {
//
//       const char = characteristics[characteristicID];
//
//       // If we already have it cached...
//       /*
//       if (char) {
//         console.log('Return cached characteristic', char);
//         resolve(char);
//       } else {
//       */
//
//         return _getService(serviceID)
//           .then(service => {
//             return service.getCharacteristic( getUUID(characteristicID) )
//           })
//           .then(characteristic => {
//             characteristics[characteristicID] = characteristic;
//             console.log('Obtained characteristic', characteristic);
//             resolve(characteristic);
//           })
//           .catch(error => {
//             console.error('_getCharacteristic error', error);
//             reject(error);
//           });
//
//       //}
//
//     });
//
//   }
//
//   function _writeCommand(characteristic, commandArray) {
//
//     var buffer = new ArrayBuffer(commandArray.length);
//     var command = new Uint8Array(buffer);
//     command.set(commandArray);
//
//     console.log('Write command', command);
//
//     return characteristic.writeValue(command);
//
//   }
//
//   function writeTo(serviceID, characteristicID, commandArray) {
//
//     return _getCharacteristic(serviceID, characteristicID)
//       .then(characteristic => {
//         console.log('Got characteristic, now write');
//         return _writeCommand(characteristic, commandArray)
//           .then(() => {console.log('Written command');});
//       });
//
//   }
//
//   function connect() {
//     $('#connectBtn').hide();
//     $('.spinner').show();
//
//     return discover()
//       .then(() => { console.log('disovering'); return connectGATT(); })
//       .then(() => { return wait(100); })
//       .then(() => { return startNotifications() })
//       .then(() => {
//         connected = true;
//         console.log('connected!');
//         $('.spinner').hide();
//         $('.connected-footer').show();
//         $('#connected-controls').show();
//         $('#app-status').text = 'Connected!';
//       });
//
//   }
//
//
//   function takeOff() {
//
//     document.getElementById("app-status").innerHTML = 'Taking off!';
//     return droneDevice.gatt.connect()
//       .then(() => {
//         setTimeout(()=>{
//             document.getElementById("app-status").innerHTML = 'Airborne';
//         },3000);
//         return writeTo('fa00', 'fa0b', [4, steps.fa0b++, 2, 0, 1, 0]);});
//
//   }
//
//   function flip() {
//
//     console.log('Flip...');
//     return droneDevice.gatt.connect()
//       .then(() => {return writeTo('fa00', 'fa0b', [4, steps.fa0b++, 2, 4, 0, 0, 2, 0, 0, 0]);});
//
//   }
//
//   function land() {
//
//     console.log('Land...');
//     document.getElementById("app-status").innerHTML = 'Landing!';
//     setTimeout(()=>{
//         document.getElementById("app-status").innerHTML = 'Landed';
//     },4000);
//     return droneDevice.gatt.connect()
//       .then(() => {return writeTo('fa00', 'fa0b', [4, steps.fa0b++, 2, 0, 3, 0]);});
//
//   }
//
//   function emergencyCutOff() {
//
//     console.warn('Emergency cut off');
//     return droneDevice.gatt.connect()
//       .then(() => {return writeTo('fa00', 'fa0c', [0x02, steps.fa0c++ & 0xFF, 0x02, 0x00, 0x04, 0x00]);});
//
//   }
//
//   function disconnect() {
//     console.log('disconnecting ---');
//     connectButton.innerHTML = 'CONNECT';
//     droneDevice.disconnect();
//     $('.connected-footer').hide();
//     $('#connected-controls').hide();
//     $('#connectBtn').show();
//
//   }
//
//   function wait(millis) {
//     console.log('wait', millis);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         console.log('waited');
//         resolve();
//       }, millis);
//     });
//   }
//
//   connectButton.addEventListener('click', () => {
//     if (!connected) {
//       connect();
//     }
//   });
//
//   takeOffButton.addEventListener('click', () => {
//     console.log('taking off!');
//     takeOff();
//   });
//
//   flipButton.addEventListener('click', () => {
//     console.log('flipping!');
//     flip();
//   });
//
//   landButton.addEventListener('click', () => {
//     console.log('landing!');
//     land();
//   });
//
//   emergencyButton.addEventListener('click', () => {
//     console.log('emergency!');
//     emergencyCutOff();
//   });
//
//   disconnectButton.addEventListener('click', () => {
//     console.log('disconnecting');
//     disconnect();
//   });
//
//   function startNotifications() {
//
//     console.log('Start notifications...');
//
//     return startNotificationsForCharacteristic('fb00', 'fb0f')
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fb00', 'fb0e')})
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fb00', 'fb1b')})
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fb00', 'fb1c')})
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fd21', 'fd22')})
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fd21', 'fd23')})
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fd21', 'fd24')})
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fd51', 'fd52')})
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fd51', 'fd53')})
//       .then(() => {return wait(100);})
//       .then(() => {return startNotificationsForCharacteristic('fd51', 'fd54')})
//       .then(() => {return wait(100);})
//       .then(() => {console.log('Finished starting notifications');})
//       .catch((error) => {console.error('Failed to start notifications', error);});
//
//   }
//
// };
//
// App();
//
// var htm = '<button id="connectBtn">CONNECT</button><button id="takeOffBtn">TAKE OFF</button><button id="flipBtn">FLIP</button><button id="landBtn">LAND</button><button id="emergencyBtn">EMERGENCY LAND</button>)'
// console.log(JSON.stringify(htm));
