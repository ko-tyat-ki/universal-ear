/* global document */
/* global THREE */

import { Sensor } from "../classes/sensor.js"
import { Stick } from "../classes/stick.js"

const numberOfLEDs = 150

const addLED = ({
	size,
	x,
	y,
	z,
	color
}, scene) => {
	const ballGeo = new THREE.CylinderBufferGeometry(size, size, 2, 32)
	const ballMaterial = new THREE.MeshLambertMaterial({ color })
	const sphere = new THREE.Mesh(ballGeo, ballMaterial)
	sphere.position.x = x
	sphere.position.y = y
	sphere.position.z = z
	scene.add(sphere)
	return sphere
}

const createStructure = (scene) => {
	// poles
	let mesh
	const poleGeo = new THREE.BoxBufferGeometry(5, 375, 5)
	const poleMat = new THREE.MeshLambertMaterial({ color: 0x343434 })
	mesh = new THREE.Mesh(poleGeo, poleMat)
	mesh.position.x = - 125
	mesh.position.y = - 62
	mesh.receiveShadow = true
	mesh.castShadow = true
	scene.add(mesh)
	mesh = new THREE.Mesh(poleGeo, poleMat)
	mesh.position.x = 125
	mesh.position.y = - 62
	mesh.receiveShadow = true
	mesh.castShadow = true
	scene.add(mesh)
	mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(255, 5, 5), poleMat)
	mesh.position.y = - 250 + (750 / 2)
	mesh.position.x = 0
	mesh.receiveShadow = true
	mesh.castShadow = true
	scene.add(mesh)

	const NUMBER_OF_LEDS = 150

	const firstColumnLEDs = [...Array(NUMBER_OF_LEDS)].map((num, key) => {
		return addLED({
			size: 3,
			x: 122,
			y: -180 + key * 2,
			z: 0,
			color: 0x55ffff
		}, scene)
	})

	const secondColumnLEDs = [...Array(NUMBER_OF_LEDS)].map((num, key) => {
		return addLED({
			size: 3,
			x: -122,
			y: -180 + key * 2,
			z: 0,
			color: 0xff55ff
		}, scene)
	})

	return [firstColumnLEDs, secondColumnLEDs]
}

export const drawEar = (columnsInput, scene) => {
	const columns = []
	const arduinos = []

	const ColumnsLEDs = createStructure(scene)

	columnsInput.forEach((column, key) => {
		// css column
		const div = document.createElement("div")
		div.className = `column column-${column.key}`
		div.id = `column-${column.key}`
		document.getElementById("container").appendChild(div)

		// pass to classes
		columns.push(new Stick(column, numberOfLEDs, ColumnsLEDs[key]))
		arduinos.push(new Sensor(0, column))
	})

	return {
		columns,
		arduinos
	}
}
