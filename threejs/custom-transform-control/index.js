
function main() {
    const scene = new THREE.Scene();
    window.screen = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    window.camera = camera;
    const renderer = new THREE.WebGLRenderer();
    const group = new THREE.Group();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);
    scene.add(group);

    // ambidentLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    group.add(ambientLight);

    // directionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(20, 20, 20);
    directionalLight.target.position.set(0, 0, 0);
    group.add(directionalLight);
    group.add(directionalLight.target);


    // box
    const boxGeometry = new THREE.BoxGeometry();
    const boxColor = new THREE.Color();
    boxColor.setHex(0x333333);

    const boxMaterial = new THREE.MeshLambertMaterial({color: boxColor, transparent: false, opacity: 0.8});
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(3, 3, 3);

    group.add(boxMesh);
    
    // gridHelper
    const gridHelper = new THREE.GridHelper(10, 10, 0x00ff00, 0x66666);
    group.add(gridHelper);

    // custom transform
    const customTransform = new THREE.TransformControls(camera, renderer.domElement);
    customTransform.attach(boxMesh);
    customTransform.setMode('rotate');
    // customTransform.rotateX(Math.PI / 4);
    group.add(customTransform);
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents( window );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 20;

    controls.enableRotate = false;
    controls.enablePan = false;

    controls.maxPolarAngle = Math.PI / 2;
    camera.position.set(0, 8, 20);

    function animate() {
        controls.update();
        requestAnimationFrame(animate);
        
        renderer.render(scene, camera);

    }
    animate();
}
main();