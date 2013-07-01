var arDrone = require('ar-drone');
var client = arDrone.createClient();
var EventEmitter = require('events').EventEmitter;

var cs = new EventEmitter();

console.log('battery ' + client.battery());

var data;
client.on('navdata', function(currentData) {
  console.log('controlState: '+currentData.demo.controlState+', flyState: '+currentData.demo.flyState);
  if (data && data.demo.controlState !== currentData.demo.controlState) {
    console.log('updated controlState: '+currentData.demo.controlState);
    cs.emit('controlState', currentData.demo.controlState, currentData);
    cs.emit(currentData.demo.controlState);
  }
  data = currentData;
})

function doStuff(onControlState, waitTime, callback) {
  cs.on('controlState', function onChangedControlState(controlState, data) {
    if (controlState !== onControlState) return;
    setTimeout(callback, waitTime);
    cs.removeListener(onChangedControlState);
  })
}

client.takeoff(function () {
  console.log('We took off!');
/*  doStuff('CTRL_HOVERING', 1000, function() {
    console.log('Lets land');
    client.land();
  });*/
  client.after(1000, function() {
    client.up(0.5);
  }).after(1000, function() {
    client.stop();
  }).after(1000, function() {
    console.log('flip');
    client.animate('flipAhead', 600);
    cs.once('CTRL_HOVERING', function() {
      console.log('Lets land');
      client.after(1000, function() { client.land(); })
    })
  })
})
/*
client.takeoff(function () {
  client.up(0.5);
  client.on('navdata', console.log);

  setTimeout(function() {
    client.stop();
    / *
    client.animate('flipAhead', 1000);
    client.animate('turnaround', 1000);

    setTimeout(function() {
      client.stop()
    }, 2000)

    setTimeout(function() {
      client.animate('phiDance', 1000);
    }, 3000)

    setTimeout(function() {
      client.land();
    }, 8000) * /
  }, 500)
});*/
