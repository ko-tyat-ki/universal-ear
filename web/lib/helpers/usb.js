import os from 'os'
import fs from 'fs'
import serialport from 'serialport'
import usb from 'usb'


const UsbFilePath = os.homedir() + '/usbs.json';

// let initialU = {}
let config = {}

function usbListExists() {
  let res = {}
  try {
    let configData = fs.readFileSync(UsbFilePath, 'utf-8')
    res = JSON.parse(configData)
  } catch (err) {
    console.log(err)
  }
  return res
}

function initialize() {
  if (false && usbListExists()) {
    try {
      config = fs.readFileSync(UsbFilePath, 'utf-8') || {}
    } catch (err) {
      console.log(err)
    }
  } else {

    serialport.list(function (err, ports) {
      ports.forEach(function(port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
      });
    });


    config = usb.getDeviceList().map(device => {
      // device.idVendor
      // device.idProduct
    });

    console.log(config);

    // fs.writeFileSync(path, JSON.stringify(config), {'flag': 'w+'}, (err) => {
    //   console.log("Saving config failed:", err,)
    // })
  }
  let deviceList = usb.getDeviceList();

  console.log(deviceList);

}

function listPorts() {
  var listPortsPromise = new Promise(function (resolve, reject) {
    serialport.list(function (err, ports) {
      ports.forEach(function (port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
      });
      resolve(ports)
    });
  })

  return listPortsPromise
}

export default {
  initialize
}
