import usb from '../web/lib/helpers/usb'

test('List all ports', () => {
  usb
    .listPorts()
    .then((data) => {
      console.log(data)
    })

})
