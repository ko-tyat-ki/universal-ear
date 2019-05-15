/* global document */
/* global console */
/* global io */

import { sleep } from './lib/helpers/sleep.js'
import { drawEar } from './lib/helpers/drawEar.js'
// import io from 'socket.io-client'

var socket = io()

let columns = null
let columnsIdx = {}
let arduinos = null
let columnKeys = null

const buildColumns = async (configuration, regime) => {
  const selectedFunction = configuration.options[configuration.options.selectedIndex].value
  const selectedRegime = regime.options[regime.options.selectedIndex].value

  let columns

  switch (selectedFunction) {
    case 'duet':
      columns = [
        {
          key: 'a',
          sensorPosition: 10
        },
        {
          key: 's',
          sensorPosition: 30
        }
      ]
      break
    case 'circle':
      columns = [
        {
          key: '0',
          sensorPosition: 20
        },
        {
          key: '1',
          sensorPosition: 20
        },
        {
          key: '2',
          sensorPosition: 20
        },
        {
          key: '3',
          sensorPosition: 20
        },
        {
          key: '4',
          sensorPosition: 20
        },
        {
          key: '5',
          sensorPosition: 20
        },
        {
          key: '6',
          sensorPosition: 20
        },
        {
          key: '7',
          sensorPosition: 20
        },
        {
          key: '8',
          sensorPosition: 20
        },
        {
          key: '9',
          sensorPosition: 20
        }
      ]
      break
    default:
      console.log('You need to pick up configuration you would use')
      return
  }

  const ear = drawEar(columns)

  let cols = {}
  for (const column of ear.columns) {
    cols[column.columnName] = column
  }

  let ards = {}
  for (const ard of ear.arduinos) {
    ards[ard.key] = ard
  }

  socket.emit('configure', {
    'visualisation': selectedRegime,
    'columns': cols,
    'arduinos': ards,
  })

  return {
    ...ear,
    columnKeys: columns.map(column => column.key)
  }
}

const cleanScreen = columnKeys => {
  if (!columnKeys) return

  columnKeys.forEach(columnKey => {
    const columnEl = document.getElementById(`column-${columnKey}`);
    document.getElementById('container').removeChild(columnEl);
  });
};

socket.on('ledsChanged', (changes) => {
  if (!changes) return
  if (!columns) return
  if (changes.length <= 0) return

  for (let changeIdx in changes) {
    let change = changes[changeIdx]
    let column = columnsIdx[change.name]
    column.colorLeds(change.leds)
  }

})

let onConfigure = async () => {
  const configuration = document.getElementById('select-configuration')
  const regime = document.getElementById('select-regime')

  cleanScreen(columnKeys)
  const update = await buildColumns(configuration, regime)
  columns = update.columns
  arduinos = update.arduinos
  columnKeys = update.columnKeys

  columnsIdx = {}
  for (const column of columns) {
    columnsIdx[column.columnName] = column
  }
}

(async () => {
  await onConfigure()

  const regime = document.getElementById('select-regime')
  const configuration = document.getElementById('select-configuration')
  configuration.addEventListener('change', async () => await onConfigure())
  regime.addEventListener('change', async () => await onConfigure())

  let currentTime = Date.now()
  let stop = false

  while (!stop) {
    const delta = Date.now() - currentTime

    if (!arduinos) continue

    arduinos.forEach((arduino) => {
      arduino.update(delta)
    })

    const measurements = arduinos.map(a => {
      return {
        name: a.key,
        value: a.tension,
        order: a.order,
      }
    })

    socket.emit('data', measurements)
    // socket.on('toClient', (data) => {
    //   console.log('this data is on client, woop!', data)
    // })
    currentTime = Date.now()
    await sleep(100)
  }
})()


