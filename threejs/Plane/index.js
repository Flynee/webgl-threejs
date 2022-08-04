

function main() {
    const scene = new THREE.Scene();
    window.scene = scene;
    scene.background = new THREE.Color(1, 1, 1);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
    window.camera = camera;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);
    // ambidentLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // directionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(20, 20, 20);
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    
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

    controls.maxPolarAngle = Math.PI / 2;
    camera.position.set(0, 0, 10);



    const material = new THREE.MeshLambertMaterial({
        color: 0xFBC404,
        side: THREE.DoubleSide, 
    });
    const geometry = new THREE.PlaneGeometry();

    const x_geo = geometry.clone();
    x_geo.rotateY(0.5 * Math.PI);
    const x_mat = material.clone();
    x_mat.color.setRGB(1, 0, 0);
    const x_mesh = new THREE.Mesh(x_geo, x_mat);
    scene.add(x_mesh);

    const y_geo = geometry.clone();
    y_geo.rotateX(0.5 * Math.PI);
    const y_mat = material.clone();
    y_mat.color.setRGB(0, 1, 0);
    const y_mesh = new THREE.Mesh(y_geo, y_mat);
    scene.add(y_mesh);

    const z_geo = geometry.clone();
    const z_mat = material.clone();
    z_mat.color.setRGB(0, 0, 1);
    const z_mesh = new THREE.Mesh(z_geo, z_mat);
    scene.add(z_mesh);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
main();