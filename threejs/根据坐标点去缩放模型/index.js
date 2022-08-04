

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

    // gridhelper
    const grid = new THREE.GridHelper();
    scene.add(grid);
    
    const pos = new THREE.Vector3(-1, 1, 0);
    const target = new THREE.Vector3(1, 0, 0);

    // axes helper
    const material = new THREE.MeshPhongMaterial( {color: 0x000000 } );
    // 柱体
    const cylinderGeometery = new THREE.CylinderGeometry( 0.1, 0.1, 1, 30, 1); // radiusTop, radiusBottom, height, radialSegments, heightSegment
    // 箭头
    const arrowGeometery = new THREE.CylinderGeometry( 0, 0.2, 0.5, 30, 1);
    arrowGeometery.translate(0, 0.5, 0);
    const group =  new THREE.Group();
    const cylinderMesh =  new THREE.Mesh(cylinderGeometery, material );
    const arrowMesh =  new THREE.Mesh(arrowGeometery, material );
    
    group.add(cylinderMesh);
    group.add(arrowMesh);
    group.position.copy(pos);
    console.debug(group);
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(group.up, target);
    group.applyQuaternion(q);
    window.group = group;

    scene.add(group);

    function updateScale() {
        const sx = sy = sz = 0.5;
        const tx = ty = tz = 0;
        const m4 = new THREE.Matrix4();

        m4.set(
            sx,  0,  0,  0,   // 这是列 0
            0,  sy,  0,  0,   // 这是列 1
            0,  0,  sz,  0,   // 这是列 2
            // tx, ty, tz,  1,
            -1, 1, 0,  1,
        );

        group.applyMatrix4(m4);
    }
    window.updateScale = updateScale;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents( window );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;

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