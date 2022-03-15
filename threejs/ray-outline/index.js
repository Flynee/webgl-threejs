
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

    // postprocessing 渲染主场景
    const composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);


    // postprocessing 快速近似抗锯齿
    const effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms.resolution.value.set(1/window.innerWidth, 1/window.innerHeight);
    composer.addPass(effectFXAA);

    // postprocessing GPU 描边
    const outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass);

    // raycaster 
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObjects = [];

    renderer.domElement.addEventListener( 'mousemove', onPointerMove );
    function onPointerMove(event) {
        if (event.isPrimary === false) {
            return;
        }
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
        
        checkIntersection();
    }

    function addSelectedObject(object) {
        selectedObjects = []; // 清空上次结果
        selectedObjects.push(object);
    }

    function checkIntersection() {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(scene, true); 

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            addSelectedObject(selectedObject);
            // 描边处理
            outlinePass.selectedObjects = selectedObjects;
            console.log(outlinePass.selectedObjects);

        }
    }
   
    
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
        
        composer.render();

    }
    animate();
}
main();