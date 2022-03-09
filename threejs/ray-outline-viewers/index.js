

function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);

    // panel
    planes = [
        new THREE.Plane( new THREE.Vector3( - 10, 0, 0 ), 0 ),
        new THREE.Plane( new THREE.Vector3( 0, - 10, 0 ), 0 ),
        new THREE.Plane( new THREE.Vector3( 0, 0, - 10 ), 0 )
    ];
    planeHelpers = planes.map( p => new THREE.PlaneHelper( p, 2, 0xffffff ) );
    planeHelpers.forEach( ph => {

        scene.add( ph );

    } );

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