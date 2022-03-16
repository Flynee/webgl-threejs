
function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const group = new THREE.Group();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);
    scene.add(group);

    // directionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(10, 10, 10);
    directionalLight.target.position.set(-10, -10, -10);
    group.add(directionalLight);
    group.add(directionalLight.target);

    // panel
    const planeGemetry = new THREE.PlaneGeometry(12, 12);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0x333333, side: THREE.DoubleSide });
    const planeMesh = new THREE.Mesh(planeGemetry, planeMaterial);
    planeMesh.rotation.x -= Math.PI * 0.5;
    planeMesh.position -= 1.5;
    group.add(planeMesh);

    // add background
    const loader = new THREE.TextureLoader();
    loader.load('./tri_pattern.jpg', function (texture) {
        scene.background = texture;
    } );


    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents( window );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 20;

    controls.maxPolarAngle = Math.PI / 2;
    camera.position.set(5, 5, 5);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        renderer.render(scene, camera);

    }
    animate();
}
main();