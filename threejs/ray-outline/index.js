
function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const group = new THREE.Group();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);
    scene.add(group);

    // panel
    const planeGemetry = new THREE.PlaneGeometry(12, 12);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0x333333, side: THREE.DoubleSide });
    const planeMesh = new THREE.Mesh(planeGemetry, planeMaterial);
    planeMesh.rotation.x -= Math.PI * 0.5;
    planeMesh.position -= 1.5;
    group.add(planeMesh);


    // AmbientLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    group.add(ambientLight);

    // DirectionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5,);
    directionalLight.position.set(20, 20, 20);
    directionalLight.target.position.set(-10, -10, -10);

    group.add(directionalLight);
    group.add(directionalLight.target);


    // sphere
    const geometry = new THREE.SphereGeometry( 1, 32, 16 );
    const material = new THREE.MeshLambertMaterial( { color: 0x222222 } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.receiveShadow = true;
    sphere.castShadow = true;
    sphere.position.set(3, 1, 0);
    group.add( sphere );

    // postprocessing 渲染主场景
    const composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);


    
    // postprocessing GPU 描边
    const outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    outlinePass.visibleEdgeColor = new THREE.Color(255, 0, 0);
    composer.addPass(outlinePass);

    // raycaster 
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObjects = [];

    renderer.domElement.addEventListener( 'pointermove', onPointerMove );
    function onPointerMove(event) {
        if (event.isPrimary === false) {
            return;
        }
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
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
            console.log(selectedObject.type);
            addSelectedObject(selectedObject);
            // 描边处理
            outlinePass.selectedObjects = selectedObjects;
            // console.log(outlinePass.selectedObjects);

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
    camera.position.set(5, 5, 5);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        composer.render();

    }
    animate();
}
main();