

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
    lights = [];

    function updateLights() {
        const pos = camera.position.clone();
        const upPos = camera.up.clone();
        const target = controls.target;
        const dist = pos.distanceTo(target) * 100;
        const color = 0x888888;

        pos.add(upPos.normalize());
        if (lights.length > 0) {
            lights[0].position.set(...pos.toArray());
            lights[0].distance = dist;
        } else {
            lights = [];
            const pointLight = new THREE.PointLight(color, 1, dist);
            pointLight.position.set(...pos.toArray());
            scene.add(pointLight);
            lights.push(pointLight);
        }

    }
    const i_len = 30;
    const j_len = 30;

    const material = new THREE.MeshLambertMaterial({
        color: 0xFBC404,
        side: THREE.DoubleSide, 
        wireframe: false,
        depthWrite: true,
    });
    const material2 = new THREE.MeshLambertMaterial({
        color: 0x000000,
        side: THREE.DoubleSide, 
        wireframe: true,
        depthWrite: true,
    });

    let geometry = null;

    
  
    function createBoxs() {
        for(let i=0; i<i_len; i++) {
            for(let j=0; j<j_len; j++) {

                // const boxGeometry = new THREE.BoxGeometry();
                // boxGeometry.translate((i - i_len/2)*1.2, (j-j_len/2)*1.2, 0);
                // if (geometry) {
                    
                //     geometry = THREE.BufferGeometryUtils.mergeBufferGeometries([geometry, boxGeometry]);
                // }else {
                //     geometry = boxGeometry;
                    
                // }
                
                
                
                const boxGeometry = new THREE.BoxGeometry();
                const meshLine = new THREE.Mesh(boxGeometry, material2);
                const mesh = new THREE.Mesh(boxGeometry, material);
                mesh.add(meshLine);
                mesh.position.set((i - i_len/2)*1.2, (j-j_len/2)*1.2, 0);
                scene.add(mesh);
            }
        }

        // const mesh = new THREE.Mesh(geometry, material);
        // const meshLine = new THREE.Mesh(geometry, material2);
        // mesh.add(meshLine);
        // scene.add(mesh);
    }
    createBoxs();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        updateLights();
        renderer.render(scene, camera);
    }
    animate();
}
main();