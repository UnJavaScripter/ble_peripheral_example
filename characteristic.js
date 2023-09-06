const util = require('util');
const bleno = require('bleno');

class EchoCharacteristic extends bleno.Characteristic {
  constructor(cb) {
    super({
      // replace UUID if needed
      uuid: '00001234-0000-1000-8000-00805f9b34ff',
      properties: ['read', 'write', 'notify'],
      value: null
    });

    const initialValue = { action: 'idle', value: undefined };
    this._value = new TextEncoder().encode(JSON.stringify(initialValue));
    this._updateValueCallback = cb;
  }

  onReadRequest(offset, callback) {
    console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
    callback(this.RESULT_SUCCESS, this._value);
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    this._value = data;
    
    if (this._updateValueCallback) {
      try {
        this._updateValueCallback(this._value);
      } catch (error) {
        console.error('Error parsing JSON message:', error);
      }
    } else {
      console.log("value updated");
    }

    callback(this.RESULT_SUCCESS);
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('EchoCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log('EchoCharacteristic - onUnsubscribe');
    this._updateValueCallback = null;
  }
}

util.inherits(EchoCharacteristic, bleno.Characteristic);

module.exports = EchoCharacteristic;