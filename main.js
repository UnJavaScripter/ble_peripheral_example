var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require('./characteristic');

// replace UUID if needed
serviceUuids = ["54987f4a-6f0f-4e20-b410-9c7ad6768d6b"]

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Test_BLE_Peripheral', serviceUuids);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: serviceUuids[0],
        characteristics: [
          new EchoCharacteristic(messageHandler)
        ]
      })
    ]);
  }
});

/////////////////////

function messageHandler(value) {
  const receivedData = value.toString('utf-8');
  try {
    const message = JSON.parse(receivedData);
    switch (message.action) {
      case ("countdown"): {
        handleCountdown(message.value)
        break;
      }
      case ("timer"): {
        handleTimer(message.value)
        break;
      }
      default: {
        break;
      }
    }
  } catch(err) {
    console.log("err:", err);
  }
}

function handleCountdown(value) {
  switch (value) {
    case ("start"): {
      console.log("start countdown");
      break;
    }
    case ("end"): {
      console.log("end countdown");
      break;
    }
    default: {
      break;
    }
  }
}

function handleTimer(value) {
  switch (value) {
    case ("start"): {
      console.log("start timer");
      break;
    }
    case ("end"): {
      console.log("end timer");
      break;
    }
    default: {
      break;
    }
  }
}