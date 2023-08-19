import { MockBinding } from '@serialport/binding-mock'
import {KYCClient} from "./KYCClient";
import {calculateRealColumns} from "../configuration/realColumnsConfig";
import basic from "../modes/basic";
import {putLedsInBufferArray, regroupConfig} from "../helpers/dataHelpers";
import {NUMBER_OF_LEDS} from "../configuration/constants";



describe('KYCClient', () => {
  it('should work', () => {
    MockBinding.createPort('/dev/ROBOT', { echo: true, record: true })
    const client = new KYCClient(  {
      "address": "/dev/ROBOT",
      "baudRate": 57600,
      "sensorCount": 1,
      "stripCount": 16
    })
    client.init()

    client.processMessage({
      type: "PULL",
      content: {
        data: [{fast: 100, slow: 5}]
      }
    })
    client.processMessage({
      type: "PULL",
      content: {
        data: [{fast: 110, slow: 6}]
      }
    })
    client.processMessage({
      type: "PULL",
      content: {
        data: [{fast: 140, slow: 10}]
      }
    })
    client.processMessage({
      type: "PULL",
      content: {
        data: [{fast: 200, slow: 20}]
      }
    })
    client.processMessage({
      type: "PULL",
      content: {
        data: [{fast: 300, slow: 45}]
      }
    })


    let sticks = calculateRealColumns('mcf-mb-2022');
    const output = regroupConfig(basic(sticks, client.sensors).filter(Boolean))
    const stickLeds = output.find(config => config.key === '1').leds
    const final =  putLedsInBufferArray(stickLeds, 40)


    const kycMessage = client.makeLedDataMessage(0, final)
    console.log(kycMessage)
    client.write(kycMessage)
  });
});