
function main() {
    const scene = new THREE.Scene();
    window.screen = scene;
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

    // circle
    const circleGeometry = new THREE.CircleGeometry();
    const circleMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, side: THREE.DoubleSide });
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    circleMesh.position.setX(-0.5);
    const circleGeometry2 = new THREE.CircleGeometry();
    const circleMaterial2 = new THREE.MeshLambertMaterial({color: 0x00ff00, side: THREE.DoubleSide });
    const circleMesh2 = new THREE.Mesh(circleGeometry2, circleMaterial2);


    circleMesh.material.polygonOffset=true;//开启偏移
    circleMesh.material.polygonOffsetFactor=-Math.round(Math.random() * 10);//与相机距离减2
    window.circleMesh2 = circleMesh2;
    group.add(circleMesh);
    group.add(circleMesh2);

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