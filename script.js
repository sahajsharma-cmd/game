let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

let renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 8

// LIGHT
let light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(5,5,5)
scene.add(light)

// PLAYER SHIP
let shipGeometry = new THREE.BoxGeometry(1,1,2)
let shipMaterial = new THREE.MeshStandardMaterial({color:0x00ffff})
let ship = new THREE.Mesh(shipGeometry, shipMaterial)

scene.add(ship)

// CONTROLS
let keys = {}

document.addEventListener("keydown", e => keys[e.key] = true)
document.addEventListener("keyup", e => keys[e.key] = false)

// LASERS
let lasers = []

function shootLaser(){

let geometry = new THREE.BoxGeometry(0.1,0.1,1)
let material = new THREE.MeshBasicMaterial({color:0xff0000})

let laser = new THREE.Mesh(geometry, material)

laser.position.set(ship.position.x, ship.position.y, ship.position.z-1)

scene.add(laser)
lasers.push(laser)

}

document.addEventListener("keydown", e=>{
if(e.code==="Space") shootLaser()
})

// ASTEROIDS
let asteroids = []

function spawnAsteroid(){

let geometry = new THREE.SphereGeometry(Math.random()+0.5,16,16)
let material = new THREE.MeshStandardMaterial({color:0x888888})

let asteroid = new THREE.Mesh(geometry, material)

asteroid.position.x = (Math.random()-0.5)*10
asteroid.position.y = (Math.random()-0.5)*6
asteroid.position.z = -40

scene.add(asteroid)
asteroids.push(asteroid)

}

setInterval(spawnAsteroid,1500)

// SCORE
let score = 0
let scoreUI = document.getElementById("score")

// GAME LOOP
function animate(){

requestAnimationFrame(animate)

// MOVE SHIP
if(keys["ArrowLeft"]) ship.position.x -= 0.15
if(keys["ArrowRight"]) ship.position.x += 0.15
if(keys["ArrowUp"]) ship.position.y += 0.15
if(keys["ArrowDown"]) ship.position.y -= 0.15

// MOVE LASERS
lasers.forEach((laser,i)=>{

laser.position.z -= 0.8

if(laser.position.z < -60){

scene.remove(laser)
lasers.splice(i,1)

}

})

// MOVE ASTEROIDS
asteroids.forEach((asteroid,i)=>{

asteroid.position.z += 0.2

// COLLISION
lasers.forEach((laser,li)=>{

let dist = laser.position.distanceTo(asteroid.position)

if(dist < 1){

scene.remove(asteroid)
scene.remove(laser)

asteroids.splice(i,1)
lasers.splice(li,1)

score += 10
scoreUI.innerText = score

}

})

})

// RENDER
renderer.render(scene,camera)

}

animate()

// RESIZE
window.addEventListener("resize", ()=>{

camera.aspect = window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})
