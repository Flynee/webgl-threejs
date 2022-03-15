
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
    planeHelpers = planes.map( p => new THREE.PlaneHelper( p, 10, 0xffffff ) );
    planeHelpers.forEach( ph => {

        scene.add( ph );

    } );

    // axes helper
    const axesHelper = new THREE.AxesHelper(10);
    const xAxisColor = new THREE.Color('#ff0000');
    const yAxisColor = new THREE.Color('#00ff00');
    const zAxisColor = new THREE.Color('#0000ff');
    axesHelper.setColors(xAxisColor, yAxisColor, zAxisColor);
    scene.add(axesHelper);

    // AmbientLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // DirectionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5,);
    directionalLight.position.set(10, 10, 10);
    directionalLight.target.position.set(-10, -10, -10);
    scene.add(directionalLight);
    scene.add(directionalLight.target);


    // sphere
    const geometry = new THREE.SphereGeometry( 1, 32, 16 );
    const material = new THREE.MeshLambertMaterial( { color: 0x222222 } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(3, 3, 0);
    scene.add( sphere );

    // box
    const boxGemotry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
    const box = new THREE.Mesh(boxGemotry, boxMaterial);
    box.position.set(-3, -3, 0);
    scene.add(box);

    // raycaster
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let intersectObj = null;
    renderer.domElement.addEventListener( 'mousemove', (event)=> {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    });
    
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
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects( scene.children, false );
        const currentIntersectObj = intersects[0]?.object || null;
        
        if (intersectObj) { // 去除上一个物体描边
            
            intersectObj.material.emissive.setHex(intersectObj.currentOutLineHex);

        }
            
        if (currentIntersectObj?.material?.emissive) {
            intersectObj = currentIntersectObj;
            intersectObj.currentOutLineHex = intersectObj.material.emissive.getHex();
            intersectObj.material.emissive.setHex(0xff0000);
        }
    
        renderer.render(scene, camera);

    }
    animate();
}
main();