var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createCubeMesh(x, y, z, color) {
    var geometry = new THREE.BoxGeometry(x, y, z);
    var material = new THREE.MeshBasicMaterial({ color });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function toRadians(degrees) {
    var radians = degrees * (Math.PI / 180)
    return radians;
}

var cameraVelocity = { x: 0, y: 0, z: 0 }
var cameraAcceleration = { x: 0, y: 0, z: 0 }

var cameraAccelerationConstant = 0.02

document.body.addEventListener("keydown", e => {
    switch (e.key.toLowerCase()) {
        case ('w'):
            cameraAcceleration.z = -cameraAccelerationConstant;
            break;

        case ('s'):
            cameraAcceleration.z = cameraAccelerationConstant;
            break;


        case ('a'):
            cameraAcceleration.x = -cameraAccelerationConstant;
            break;

        case ('d'):
            cameraAcceleration.x = cameraAccelerationConstant;
            break;
    }
})

document.body.addEventListener("keyup", e => {
    console.log(e)
    switch (e.key.toLowerCase()) {
        case ('w'):
        case ('s'):
            cameraAcceleration.z = 0;
            break

        case ('a'):
        case ('d'):
            cameraAcceleration.x = 0;
            break
    }

    console.log(cameraAcceleration)
})

var cubeWidth = 1;
var cube = createCubeMesh(cubeWidth, cubeWidth, cubeWidth, 0x00ff00)

var subcubes = [];
var subcubeWidth = 0.5
for (var x = 0; x < 8; x++) {
    var color = x % 2 ? 0xff0000 : 0x0000ff;
    var subcube = createCubeMesh(subcubeWidth, subcubeWidth, subcubeWidth, color)
    subcubes.push(subcube);
}

scene.add(cube);
cube.add(...subcubes);

camera.position.z = 5;

var index = 0;
for (var x = -1; x <= 1; x += 2) {
    for (var y = -1; y <= 1; y += 2) {
        for (var z = -1; z <= 1; z += 2) {
            subcubes[index].position.x += (x * ((cubeWidth + subcubeWidth) / 2));
            subcubes[index].position.y += (y * ((cubeWidth + subcubeWidth) / 2));
            subcubes[index].position.z += (z * ((cubeWidth + subcubeWidth) / 2));

            // var degrees = toRadians(45);
            // subcubes[index].rotation.x += (degrees);
            // subcubes[index].rotation.y += (degrees);


            index++
        }
    }
}
console.log(subcubes[0].quaternion);
var rotation = new THREE.Vector3(0, 0, 0);
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    var info = document.getElementById("info");
    if (!!info) {
        var infoText = `CameraVelocity: x=${cameraVelocity.x}, y=${cameraVelocity.y}, z=${cameraVelocity.z}\n`
        
         + `Rotation: x=${rotation.x}, y=${rotation.y}, z=${rotation.z}`
        info.innerText = infoText
    }

    cameraVelocity.x += cameraAcceleration.x;
    cameraVelocity.y += cameraAcceleration.y;
    cameraVelocity.z += cameraAcceleration.z;

    camera.position.x += cameraVelocity.x;
    camera.position.y += cameraVelocity.y;
    camera.position.z += cameraVelocity.z;

    if (cameraVelocity.x != 0) cameraVelocity.x /= 1.15
    if (cameraVelocity.y != 0) cameraVelocity.y /= 1.15
    if (cameraVelocity.z != 0) cameraVelocity.z /= 1.15

    if (cameraVelocity.x < 0.001 && cameraVelocity.x > -0.001) cameraVelocity.x = 0
    if (cameraVelocity.y < 0.001 && cameraVelocity.y > -0.001) cameraVelocity.y = 0
    if (cameraVelocity.z < 0.001 && cameraVelocity.z > -0.001) cameraVelocity.z = 0

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    
    var neg = 1;
    for (var index = 0; index < 8; index++) {
        

        // subcubes[index].rotation.x += (0.02 * neg);
        // subcubes[index].rotation.y += (0.02 * neg);
        // subcubes[index].rotation.z += (0.02 * neg);
        // neg *= -1;
    }

}
animate();