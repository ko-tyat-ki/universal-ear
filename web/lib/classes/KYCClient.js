import SerialPort from 'serialport'
import assert from "assert";
import {putLedsInBufferArray, regroupConfig} from "../helpers/dataHelpers";
import kyctest from "../modes/kyc/kyctestmode";
import flicker from "../modes/flicker";
import randomwhite from "../modes/kyc/randomwhite";

const NUM_LEDS_PER_CHANNEL = 512;

class MessageType {
  constructor(name, byteValue) {
    this.name = name;
    this.byteValue = byteValue;
  }

  toString() {
    return this.name
  }
}

const MESSAGE_TYPES = {
  // in
  Ready: new MessageType("Ready", Buffer.from([0x08])),
  Debug: new MessageType("Debug", Buffer.from([0x01])),
  Pull: new MessageType("Pull", Buffer.from([0x02])),

  // out
  Data: new MessageType("Data", Buffer.from([0x01])),
  Fire: new MessageType("Fire", Buffer.from([0x02])),
  Swap: new MessageType("Swap", Buffer.from([0x10]))
}


const START_SEQ = Buffer.concat([Buffer.from([0xe5]), Buffer.from([0x6b]), Buffer.from([0x03]), Buffer.from([0x1d])]);

class Sensor {
  constructor(position) {
    this.position = position
    this.tension = 0
    // it was always 10 in the old config
    this.sensorPosition = 10

    this.oldTension = [0, 0, 0, 0]
    this.stick = `${position + 1}`
    this.key = "/dev/ttyUSB0"
    this.rawHistory = [0]
    this.onChange = () => {
    }
  }

  //  {raw, fast, slow}
  recordPull(sensorData) {
    const tension = sensorData.fast
    this.fastSensorValue = Math.max(sensorData.fast, 0)
    this.slowSensorValue = Math.max(sensorData.slow, 0)
    if (!tension) return
    for (let key = 0; key < 4; key++) {
      this.oldTension[key] = (this.oldTension[key])
        ? this._lerp(this.oldTension[key], this.tension, 0.1 * (key + 1))
        : this.tension
      this.oldTension[key] = (this.oldTension[key] < 1)
        ? 0
        : this.oldTension[key]
    }
    this.tension = Math.max(tension, 0)
    this.onChange(this)
  }


  _lerp(inValue, outValue, fraction) {
    return inValue + (outValue - inValue) * fraction
  }

}

class KYCled {
  constructor(channel, config, kyc) {
    this.kyc = kyc
    this.name = config.name
    this.numberOfLEDs = config.numberOfLEDs
    this.channel = channel
    this.init = config.init
    this.mode = kyctest //default
    this.currentLeds = Uint8Array.from([])
  }

  setMode(mode) {
    this.mode = mode
    return this
  }

  bindSensor(sensor) {
    this.sensor = sensor
    this.sensor.onChange = () => {
      this.calculateFrame()
    }
    return this
  }

  calculateFrame() {
    this.currentLeds = putLedsInBufferArray(regroupConfig(this.mode([this], [this.sensor]).filter(Boolean)).find(config => config.key === this.name).leds, this.numberOfLEDs)
  }

  drawFrame() {
    if (!this.sensor) {
      const nosensorLeds = putLedsInBufferArray(regroupConfig(this.mode([this], [this.sensor]).filter(Boolean)).find(config => config.key === this.name).leds, this.numberOfLEDs);
      this.kyc.write(this.kyc.makeLedDataMessage(this.channel, nosensorLeds))
    }
    if (this.currentLeds.length) {
      this.kyc.write(this.kyc.makeLedDataMessage(this.channel, this.currentLeds))
    }
  }

}

export class KYCClient {
  constructor(config, ledConfig) {
    this._events = {}
    this.address = config.address
    this.active = false
    this.ledStripsCount = config.ledStripsCount
    this.sensorsCount = config.sensorsCount
    this.serialPort = new SerialPort(this.address)
    this.sensors = []
    for (let i = 0; i < config.sensorCount; i++) {
      this.sensors.push(new Sensor(i))
    }

    this.leds = []
    for (let i = 0; i < ledConfig.length; i++) {
      let ledstrip = new KYCled(i, ledConfig[i], this);
      if (this.sensors.length > i) {
        ledstrip.bindSensor(this.sensors[i])
      } else {
        ledstrip.setMode(randomwhite)
      }
      this.leds.push(ledstrip)
    }


    // hacks for backwards compatibility
    this.parser = {
      on: this.on
    }
    this.port = {
      write: (ledArray) => this.makeLedDataMessage(0, ledArray)
    }
  }

  init() {
    console.log(`reading on ${this.address}`)
    this.serialPort.on('error', (error) => {
      console.log(error)
      this.active = false
    })
    this.serialPort.on('data', (data) => {
      const message = this.readMessage(data)
      this.processMessage(message)
      if ('data' in this._events) {
        this._events['data'](data)
      }
    })
    this.serialPort.on('close', (error) => {
      console.log(`Port was closed., port: ${this.address}`, error)
      this.active = false
    })
  }

  // simplest possible, supporting one callback per event
  on(event, callback) {
    this._events[event] = callback
  }

  processMessage(message) {
    switch (message.type.name) {
      case "Ready":
        if (!this.active) {
          this.active = true
        }
        this.leds.forEach(l => l.drawFrame())
        break
      case "Pull":
        message.content.data.forEach((data, i) => {
          this.sensors[i].recordPull(data)
        })
        break
      default:
        break;
    }
  }

  write(buffer) {
    this.serialPort.write(buffer)
    this.serialPort.write(this.makeSwapMessage())
  }

  makeSwapMessage() {
    return this._makeMessage(MESSAGE_TYPES.Swap.byteValue, Buffer.from([]));
  }

  // [LED_OUTPUT_CHANNEL (1)][FIRE_BRIGHTNESS (1)]
  makeFireMessage(channel, brightness) {
    const message = Buffer.alloc(2);
    message.writeIntLE(channel, 0, 1)
    message.writeIntLE(brightness, 1, 1)
    return this._makeMessage(MESSAGE_TYPES.Fire.byteValue, message);
  }

  // [LED_OUTPUT_CHANNEL (1)][NUM_LEDS (2)][DATA (NUM_LEDS * 3)]
  // [LED0-G (1)][LED0-R (1)][LED0-B (1)][LED1-G (1)][LED1-R (1)][LED1-B (1)]...
  makeLedDataMessage(channel, ledData) {
    const dataBuff = Buffer.from(ledData)
    const out = Buffer.concat([intToBuff(channel, 1), intToBuff(NUM_LEDS_PER_CHANNEL, 2), dataBuff])
    return this._makeMessage(MESSAGE_TYPES.Data.byteValue, out);
  }

  readMessage(data) {
    // this._waitUntilStartSeq(data);
    let content = {}
    let msgType = "NONE"
    try {
      msgType = this._incomingType(data.subarray(4, 5))
      if (msgType === MESSAGE_TYPES.Ready) {
      } else {
        const msgLen = data.readIntLE(5, 2)
        if (msgType === MESSAGE_TYPES.Debug) {
          content = {message: content.toString('utf-8')}
        } else if (msgType === MESSAGE_TYPES.Pull) {
          const sensorCount = data.readIntLE(7, 1)

          const sensorData = []
          for (let i = 0; i < this.sensors.length; i++) {
            const offset = 6 * i
            sensorData.push(
              {
                raw: data.readIntLE(9 + offset, 2),
                fast: data.readIntLE(11 + offset, 2),
                slow: data.readIntLE(13 + offset, 2)
              }
            )
          }
          content = {sensorCount, data: sensorData}
        }
      }
    } catch (e) {
      console.log(e)
      console.log(data)
    }
    return {type: msgType, content}
  }

  // [START (4)][MESSAGE_TYPE (1)][MESSAGE_LEN (2)][CONTENT (MESSAGE_LEN)]
  _makeMessage(messageType, message) {
    assert(Buffer.byteLength(messageType) === 1, "type too long")
    assert(Buffer.isBuffer(message), "message is not a buffer")
    const msgLenBuff = Buffer.alloc(2)
    msgLenBuff.writeIntLE(Buffer.byteLength(message), 0, 2);
    return Buffer.concat([START_SEQ, messageType, msgLenBuff, message])
  }

  _incomingType(typeBuff) {
    for (const messagetype of Object.keys(MESSAGE_TYPES)) {
      if (typeBuff.equals(MESSAGE_TYPES[messagetype].byteValue)) {
        return MESSAGE_TYPES[messagetype]
      }
    }
    return new MessageType("UNKNOWN")
  }
}

function intToBuff(number, buffLen) {
  const buff = Buffer.alloc(buffLen)
  buff.writeIntLE(number, 0, buffLen)
  return buff
}