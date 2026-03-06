let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

let renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 10

// LIGHT
let light = new THREE.PointLight(0xffffff,2)
light.position.set(10,10,10)
scene.add(light)

// STARFIELD
let starsGeometry = new THREE.BufferGeometry()
let starVertices=[]

for(let i=0;i<6000;i++){
let x=(Math.random()-0.5)*2000
let y=(Math.random()-0.5)*2000
let z=-Math.random()*2000
starVertices.push(x,y,z)
}

starsGeometry.setAttribute(
'position',
new THREE.Float32BufferAttribute(starVertices,3)
)

let starsMaterial = new THREE.PointsMaterial({color:0xffffff})
let starField = new THREE.Points(starsGeometry,starsMaterial)

scene.add(starField)

// PLAYER SHIP
let shipGeometry = new THREE.ConeGeometry(0.5,1.5,32)
let shipMaterial = new THREE.MeshStandardMaterial({color:0x00ffff})

let ship = new THREE.Mesh(shipGeometry,shipMaterial)
ship.rotation.x=Math.PI/2
scene.add(ship)

// CONTROLS
let keys={}

document.addEventListener("keydown",e=>keys[e.key]=true)
document.addEventListener("keyup",e=>keys[e.key]=false)

// LASERS
let lasers=[]

function shootLaser(){

let geometry=new THREE.CylinderGeometry(0.05,0.05,1)
let material=new THREE.MeshBasicMaterial({color:0xff0000})

let laser=new THREE.Mesh(geometry,material)

laser.rotation.x=Math.PI/2
laser.position.copy(ship.position)

scene.add(laser)
lasers.push(laser)

}

document.addEventListener("keydown",e=>{
if(e.code==="Space") shootLaser()
})

// ASTEROIDS
let asteroids=[]

function spawnAsteroid(){

let geometry=new THREE.DodecahedronGeometry(
Math.random()*0.8+0.5
)

let material=new THREE.MeshStandardMaterial({color:0x888888})

let asteroid=new THREE.Mesh(geometry,material)

asteroid.position.x=(Math.random()-0.5)*20
asteroid.position.y=(Math.random()-0.5)*12
asteroid.position.z=-50

scene.add(asteroid)
asteroids.push(asteroid)

}

setInterval(spawnAsteroid,1200)

// SCORE
let score=0
let scoreUI=document.getElementById("score")

// GAME LOOP
function animate(){

requestAnimationFrame(animate)

// MOVE SHIP
if(keys["ArrowLeft"]) ship.position.x-=0.2
if(keys["ArrowRight"]) ship.position.x+=0.2
if(keys["ArrowUp"]) ship.position.y+=0.2
if(keys["ArrowDown"]) ship.position.y-=0.2

// MOVE LASERS
lasers.forEach((laser,i)=>{

laser.position.z-=1

if(laser.position.z<-100){
scene.remove(laser)
lasers.splice(i,1)
}

})

// MOVE ASTEROIDS
asteroids.forEach((asteroid,i)=>{

asteroid.position.z+=0.4
asteroid.rotation.x+=0.01
asteroid.rotation.y+=0.01

// COLLISION WITH LASER
lasers.forEach((laser,li)=>{

let dist=laser.position.distanceTo(asteroid.position)

if(dist<1){

scene.remove(asteroid)
scene.remove(laser)

asteroids.splice(i,1)
lasers.splice(li,1)

score+=10
scoreUI.innerText=score

}

})

})

renderer.render(scene,camera)

}

animate()

// RESIZE
window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})
