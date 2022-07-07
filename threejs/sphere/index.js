
function main() {
    const scene = new THREE.Scene();
    window.screen = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const group = new THREE.Group();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);
    scene.add(group);

    // ambientLight 
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // directionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.target.position.set(0, 0, 0);
    group.add(directionalLight);
    group.add(directionalLight.target);

    // panel
    const planeGemetry = new THREE.PlaneGeometry(12, 12);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0x333333, side: THREE.DoubleSide });
    const planeMesh = new THREE.Mesh(planeGemetry, planeMaterial);
    planeMesh.rotation.x -= Math.PI * 0.5;
    planeMesh.position -= 1.5;
    group.add(planeMesh);

    // circle
    const circleGeometry = new THREE.CircleGeometry();
    const circleMaterial = new THREE.MeshLambertMaterial({
        color: 0x003DEA,
        opacity: 0.5,
        // side: THREE.DoubleSide,
        side: THREE.DoubleSide,
        transparent: true
    });
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);

    group.add(circleMesh);
   

    // add skybox
    const loader = new THREE.CubeTextureLoader();
    loader.load([
        './pos-x.jpg',
        './neg-x.jpg',
        './pos-y.jpg',
        './neg-y.jpg',
        './pos-z.jpg',
        './neg-z.jpg',
    ], function (texture) {
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