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
var cameraRotVelocity = { x: 0, y: 0, z: 0 }
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

})


document.body.addEventListener("mousemove", e => {
    var xVelocity = e.movementX;
    var yVelocity = e.movementY;

    cameraRotVelocity.x = yVelocity * -0.001;
    cameraRotVelocity.y = xVelocity * -0.001;
})

var cubeWidth = 1;
var cube = createCubeMesh(cubeWidth, cubeWidth, cubeWidth, 0x00ff00)
var cubes = [cube];

function someFractalFunction(cubes, cubeWidth, maxDepth, depth) {
    depth = depth + 1;

    var numCubes = cubes.length;
    var width = cubeWidth / 3;
    for (var i = 0; i < numCubes; i++) {
        var subcubes = []

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

        var index = 0;
        for (var x = -1; x <= 1; x += 2) {
            for (var y = -1; y <= 1; y += 2) {
                for (var z = -1; z <= 1; z += 2) {
                    // if (depth > 1) {
                    //     if (i == 0 ||
                    //         i == 1 ||
                    //         i == 2 ||
                    //         i == 4) {
                    //         if (index == 7) {
                    //             index++
                    //             continue;
                    //         }
                    //     } else {
                    //         if (index == 0) {
                    //             index++
                    //             continue;
                    //         }
                    //     }
                    // }

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

        if (depth <= maxDepth) {
            someFractalFunction(subcubes, width, maxDepth, depth)
        }
    }
}

function fractalAnimateFunction(cubes, depth) {
    if (!!cubes) {
        depth = depth + 1;
        var numCubes = cubes.length;
        for (var cubeIndex = 0; cubeIndex < numCubes; cubeIndex++) {
            var cube = cubes[cubeIndex];
            var vector = new THREE.Vector3(1, 1, 1);
            var normalisedVector = vector.normalize();
            cube.rotateOnAxis(normalisedVector, 0.01 * depth);
            fractalAnimateFunction(cube.children, depth)
        }
    }
}

var subcubes = someFractalFunction(cubes, cubeWidth, 2, 0);

scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    var info = document.getElementById("info");
    if (!!info) {
        var infoText =
            `Camera\n` +
            `Position: x = ${camera.position.x.toFixed(2)} | y = ${camera.position.y.toFixed(2)} | z = ${camera.position.z.toFixed(2)}\n` +
            `Velocity: x = ${cameraVelocity.x.toFixed(2)} | y = ${cameraVelocity.y.toFixed(2)} | z = ${cameraVelocity.z.toFixed(2)}\n` +
            `RotVelocity: x = ${cameraRotVelocity.x.toFixed(2)} | y = ${cameraRotVelocity.y.toFixed(2)} | z = ${cameraRotVelocity.z.toFixed(2)}\n` +
            `\n` +
            `Cube\n` +
            `Rotation: x = ${cube.rotation.x.toFixed(2)} | y = ${cube.rotation.y.toFixed(2)} | z = ${cube.rotation.z.toFixed(2)}`

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

    fractalAnimateFunction(cubes, 0)

}
animate();