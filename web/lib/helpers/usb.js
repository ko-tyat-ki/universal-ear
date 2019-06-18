import serialport from 'serialport'

function listPorts() {
  var listPortsPromise = new Promise(function(resolve, reject){
    serialport.list(function (err, ports) {
      ports.forEach(function(port) {
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
  listPorts
}
