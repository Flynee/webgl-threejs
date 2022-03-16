
function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const group = new THREE.Group();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);
    scene.add(group);

    // ambidentLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    group.add(ambientLight);

    // directionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(10, 10, 10);
    directionalLight.target.position.set(-10, -10, -10);
    group.add(directionalLight);
    group.add(directionalLight.target);


    // transparent box
    for (let i=0; i < 4; i+= 1) {
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, Math.random());
        
        [THREE.BackSide, THREE.FrontSide].forEach(side => {
            const boxGeometry = new THREE.BoxGeometry();
            const boxMaterial = new THREE.MeshLambertMaterial({ 
                opacity: 0.5,
                transparent: true,
                // side: THREE.DoubleSide,
                side
            });
          
            boxMaterial.color = color;
            const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
            boxMesh.position.x = i * 1.2;
            boxMesh.position.y = 2;
            group.add(boxMesh);
        });
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
        
        renderer.render(scene, camera);

    }
    animate();
}
main();