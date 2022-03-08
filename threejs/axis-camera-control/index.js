

function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);

    // axis
    const zAxis = [
        // arrow
        new THREE.Vector3(-0.1, 0, 1),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0.1, 0, 1),
        // line
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
    ];

    const xAxis = [];


    
    
    // tringle
    const points = [
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(5, 2, 0),
        new THREE.Vector3(6, 0, 0),
    ];
    const shape = new THREE.Shape(points);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: 2 });
    const shapeGeometry = new THREE.ShapeGeometry(shape, 1);
    const tringle = new THREE.Mesh(shapeGeometry, material);

    scene.add(tringle);

    // axes helper
    const axesHelper = new THREE.AxesHelper(5);
    const xAxisColor = new THREE.Color('#ff0000');
    const yAxisColor = new THREE.Color('#00ff00');
    const zAxisColor = new THREE.Color('#0000ff');
    axesHelper.setColors(xAxisColor, yAxisColor, zAxisColor);
    scene.add(axesHelper);


    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents( window );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 20;

    controls.maxPolarAngle = Math.PI / 2;
    camera.position.set(0, 0, 10);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
main();