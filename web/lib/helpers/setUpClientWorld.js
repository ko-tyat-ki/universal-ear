/* global document */
/* global window */

/* global THREE */
/* global requestAnimationFrame */

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

const setUpMoon = () => {
    let loader = new THREE.TextureLoader()
    let moonTexture = loader.load('../static/images/moon.png')
    moonTexture.wrapS = moonTexture.wrapT = THREE.RepeatWrapping
    moonTexture.repeat.set(1, 1)
    moonTexture.anisotropy = 16
    const moonGeo = new THREE.SphereBufferGeometry(100, 32, 16)
    var moonMaterial = new THREE.MeshLambertMaterial({ map: moonTexture })
    const sphere = new THREE.Mesh(moonGeo, moonMaterial)
    sphere.position.x = -2500
    sphere.position.y = 400
    sphere.position.z = -1000
    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)
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
    renderer.setPixelRatio(window.devicePixelRatio / 4)
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

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

export const init = () => {
    setUpCanvas()
    setUpScene()
    setUpCamera()
    setUpLights()
    setUpGround()
    setUpRenderer()
    setUpControls()
    setUpMoon()

    window.addEventListener('resize', onWindowResize, false)
}

export const animate = () => {
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
    return scene
}
