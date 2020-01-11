var scene = new THREE.Scene();
var cameraDolly = new THREE.Object3D();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// cameraDolly.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createCubeMesh(x, y, z) {
    var geometry = new THREE.BoxGeometry(x, y, z);
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function toRadians(degrees) {
    var radians = degrees * (Math.PI / 180)
    return radians;
}

var cameraVelocity = { x: 0, y: 0, z: 0 }
var movementVelocity = 0;
// var cameraRotVelocity = { x: 0, y: 0, z: 0 }

var cameraAcceleration = { x: 0, y: 0, z: 0 }
var movementAcceleration = 0;

var cameraAccelerationConstant = 1
var movementAccelerationConstant = 0.1

document.body.addEventListener("keydown", e => {
    switch (e.key.toLowerCase()) {
        case ('w'):
            cameraAcceleration.z = -cameraAccelerationConstant;
            break;

        case ('s'):
            cameraAcceleration.z = cameraAccelerationConstant;
            break;


        case ('a'):
            movementAcceleration = -movementAccelerationConstant;
            break;

        case ('d'):
            movementAcceleration = movementAccelerationConstant;
            break;
    }
})

document.body.addEventListener("keyup", e => {
    switch (e.key.toLowerCase()) {
        case ('w'):
        case ('s'):
            cameraAcceleration.z = 0;
            break

        case ('a'):
        case ('d'):
            movementAcceleration = 0;
            break
    }

})


// document.body.addEventListener("mousemove", e => {
//     var xVelocity = e.movementX;
//     var yVelocity = e.movementY;

//     cameraRotVelocity.x = yVelocity * -0.001;
//     cameraRotVelocity.y = xVelocity * -0.001;
// })

var cubeWidth = 1;
var cube = createCubeMesh(cubeWidth, cubeWidth, cubeWidth, 0x00ff00)
var cubes = [cube];

var vectorArray = [
    null,
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    null
]

function someFractalFunction(cubes, cubeWidth, maxDepth, depth) {
    depth = depth + 1;

    var numCubes = cubes.length;
    var width = cubeWidth / 3;
    for (var i = 0; i < numCubes; i++) {
        var subcubes = []

        var index = 0;
        for (var x = -1; x <= 1; x += 2) {
            for (var y = -1; y <= 1; y += 2) {
                for (var z = -1; z <= 1; z += 2) {
                    var offset = ((i + index) % 8)

                    var subcube = createCubeMesh(width, width, width)

                    subcubes.push(subcube);

                    subcube.position.x += (x * ((cubeWidth + width) / 2));
                    subcube.position.y += (y * ((cubeWidth + width) / 2));
                    subcube.position.z += (z * ((cubeWidth + width) / 2));

                    var degrees = toRadians(90);

                    !!vectorArray[index] && subcube.rotateOnAxis(vectorArray[index], degrees);

                    index++
                }
            }
        }

        cubes[i].add(...subcubes);

        if (depth < maxDepth) {
            someFractalFunction(subcubes, width, maxDepth, depth)
        }
    }
}

function fractalAnimateFunction(cubes, depth, deltaTime) {
    if (!!cubes) {
        depth = depth + 1;
        var numCubes = cubes.length;
        for (var cubeIndex = 0; cubeIndex < numCubes; cubeIndex++) {
            var cube = cubes[cubeIndex];
            var vector = new THREE.Vector3(1, 1, 1);
            var normalisedVector = vector.normalize();
            cube.rotateOnAxis(normalisedVector, 1 * depth * deltaTime);
            fractalAnimateFunction(cube.children, depth, deltaTime);
           
            var parent = cube.parent;
            var vector = new THREE.Vector3( cube.position.x, cube.position.y, cube.position.z )
            vector.normalize();

            cube.position.x += vector.x * movementVelocity * deltaTime;
            cube.position.y += vector.y * movementVelocity * deltaTime;
            cube.position.z += vector.z * movementVelocity * deltaTime;
        }
    }
}

var subcubes = someFractalFunction(cubes, cubeWidth, 3, 0);

scene.add(cube);

camera.position.z = 6;

var clock = new THREE.Clock()
function animate() {
    var deltaTime = clock.getDelta();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    var info = document.getElementById("info");
    if (!!info) {
        var infoText =
            `Camera\n` +
            `Position: x = ${camera.position.x.toFixed(2)} | y = ${camera.position.y.toFixed(2)} | z = ${camera.position.z.toFixed(2)}\n` +
            `Velocity: x = ${cameraVelocity.x.toFixed(2)} | y = ${cameraVelocity.y.toFixed(2)} | z = ${cameraVelocity.z.toFixed(2)}\n` +
            `\n` +
            `Cube\n` +
            `Rotation: x = ${cube.rotation.x.toFixed(2)} | y = ${cube.rotation.y.toFixed(2)} | z = ${cube.rotation.z.toFixed(2)}`

        info.innerText = infoText
    }

    cameraVelocity.x += cameraAcceleration.x;
    cameraVelocity.y += cameraAcceleration.y;
    cameraVelocity.z += cameraAcceleration.z;

    movementVelocity += movementAcceleration;

    camera.position.x += cameraVelocity.x * deltaTime;
    camera.position.y += cameraVelocity.y * deltaTime;
    camera.position.z += cameraVelocity.z * deltaTime;

    if (cameraVelocity.x != 0) cameraVelocity.x /= 1.15
    if (cameraVelocity.y != 0) cameraVelocity.y /= 1.15
    if (cameraVelocity.z != 0) cameraVelocity.z /= 1.15

    if (movementVelocity != 0) movementVelocity /= 1.15

    if (cameraVelocity.x < 0.001 && cameraVelocity.x > -0.001) cameraVelocity.x = 0
    if (cameraVelocity.y < 0.001 && cameraVelocity.y > -0.001) cameraVelocity.y = 0
    if (cameraVelocity.z < 0.001 && cameraVelocity.z > -0.001) cameraVelocity.z = 0

    if (movementVelocity < 0.001 && movementVelocity > -0.001) movementVelocity = 0

    fractalAnimateFunction(cubes, 0, deltaTime)

}
animate();
clock.start()