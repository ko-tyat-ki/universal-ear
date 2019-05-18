/* global document */
/* global window */
/* global console */

/* global THREE */
/* global io */

import { sleep } from './lib/helpers/sleep.js'
import { drawEar } from './lib/helpers/drawEar.js'
// import * as THREE from './lib/three/three.js'

let socket = io()

let columns = null
let columnsIdx = {}
let arduinos = null
let columnKeys = null

const buildColumns = async (configuration, regime) => {
	const selectedConfiguration = configuration.options[configuration.options.selectedIndex].value
	const selectedRegime = regime.options[regime.options.selectedIndex].value

	let columns

	switch (selectedConfiguration) {
		case 'duet':
			columns = [
				{
					key: 'a',
					sensorPosition: 10
				},
				{
					key: 's',
					sensorPosition: 120
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

	const ear = drawEar(columns, scene)

	socket.emit('configure', {
		'mode': selectedRegime,
		'columns': ear.columns,
		'arduinos': ear.arduinos,
	})

	return {
		...ear,
		columnKeys: columns.map(column => column.key)
	}
}

const cleanScreen = columnKeys => {
	if (!columnKeys) return

	columnKeys.forEach(columnKey => {
		const columnEl = document.getElementById(`column-${columnKey}`)
		document.getElementById('container').removeChild(columnEl)
	})
}

socket.on('ledsChanged', (changes) => {
	if (!changes) return
	if (!columns) return
	if (changes.length <= 0) return

	for (let changeIdx in changes) {
		let change = changes[changeIdx]
		if (!change) continue
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

let container

let camera
let scene
let renderer

const setUpCanvas = () => {
	container = document.createElement('div')
	container.className = `canvas`
	document.body.appendChild(container)
}

const setUpScene = () => {
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x141852)
	scene.fog = new THREE.Fog(0x141852, 500, 10000)
	scene.autoUpdate = true
}

const setUpCamera = () => {
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
	camera.position.set(1000, 50, 1500)
}

const setUpLights = () => {
	scene.add(new THREE.AmbientLight(0x666666))
	let light = new THREE.DirectionalLight(0xdfebff, 1)
	light.position.set(50, 200, 100)
	light.position.multiplyScalar(1.3)
	light.castShadow = true
	light.shadow.mapSize.width = 1024
	light.shadow.mapSize.height = 1024
	let d = 300
	light.shadow.camera.left = - d
	light.shadow.camera.right = d
	light.shadow.camera.top = d
	light.shadow.camera.bottom = - d
	light.shadow.camera.far = 1000
	scene.add(light)
}

const setUpGround = () => {
	let loader = new THREE.TextureLoader()
	let groundTexture = loader.load('../static/images/desert.jpeg')
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
	groundTexture.repeat.set(25, 25)
	groundTexture.anisotropy = 16
	let groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture })
	let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial)
	mesh.position.y = - 250
	mesh.rotation.x = - Math.PI / 2
	mesh.receiveShadow = true
	scene.add(mesh)
}

const setUpRenderer = () => {
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	container.appendChild(renderer.domElement)
	renderer.gammaInput = true
	renderer.gammaOutput = true
	renderer.shadowMap.enabled = true
}

const setUpControls = () => {
	let controls = new THREE.OrbitControls(camera, renderer.domElement)
	controls.maxPolarAngle = Math.PI * 0.5
	controls.minDistance = 1000
	controls.maxDistance = 5000
}

init()
animate()
function init() {
	setUpCanvas()
	setUpScene()
	setUpCamera()
	setUpLights()
	setUpGround()

	// createStructure()

	setUpRenderer()
	setUpControls()

	window.addEventListener('resize', onWindowResize, false)

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
	requestAnimationFrame(animate)

	renderer.render(scene, camera)
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
				tension: a.tension
			}
		})

		socket.emit('measurements', measurements)
		currentTime = Date.now()
		await sleep(10)
	}
})()
