/* global THREE */

import { Sensor } from "../classes/sensor.js"
import { Stick } from "../classes/stick.js"

const NUMBER_OF_LEDS = 40
const STICK_SIZE = 3
const ONE_LED_SIZE = 6.25
const POLE_COLOR = 0x221111
const INIT_STICK_COLOR = 0x55ffff

const addLED = ({
	size,
	x,
	y,
	z,
	color
}, scene) => {
	const ballGeo = new THREE.CylinderBufferGeometry(size, size, ONE_LED_SIZE, 32)
	const ballMaterial = new THREE.MeshLambertMaterial({ color })
	const sphere = new THREE.Mesh(ballGeo, ballMaterial)
	sphere.position.x = x
	sphere.position.y = y
	sphere.position.z = z
	scene.add(sphere)
	return sphere
}

const drawStructure = (poles, scene) => {
	poles.forEach(pole => {
		const poleGeo = new THREE.BoxBufferGeometry(pole.geo.x, pole.geo.y, pole.geo.z)
		const poleMat = new THREE.MeshLambertMaterial({ color: POLE_COLOR })
		const mesh = new THREE.Mesh(poleGeo, poleMat)
		mesh.position.x = pole.init.x
		mesh.position.y = pole.init.y
		mesh.position.z = pole.init.z
		mesh.receiveShadow = true
		mesh.castShadow = true
		if (pole.euler) {
			const a = new THREE.Euler(pole.euler.x, pole.euler.y, pole.euler.z, 'XYZ')
			mesh.setRotationFromEuler(a)
		}
		scene.add(mesh)
	})
}

const drawStick = (stick, scene) => {
	return [...Array(NUMBER_OF_LEDS)].map((num, key) => {
		return addLED({
			size: STICK_SIZE,
			x: stick.x,
			y: stick.y + key * ONE_LED_SIZE,
			z: stick.z,
			color: INIT_STICK_COLOR
		}, scene)
	})
}

export const drawEar = (configuration, scene) => {
	drawStructure(configuration.poles, scene)

	const sticks = configuration.sticks.map((stick, key) => {
		const stickLEDS = drawStick(stick, scene)
		return new Stick(NUMBER_OF_LEDS, stickLEDS, key)
	})

	const sensors = configuration.sensors.map(sensor => {
		return new Sensor(0, sensor)
	})

	return {
		sticks,
		sensors
	}
}
