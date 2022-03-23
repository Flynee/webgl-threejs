
function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);

    // ambientLight 
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // directionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    // box
    const boxGeometry = new THREE.BoxGeometry();
    const boxMatarial = new THREE.MeshLambertMaterial({color: 0xff0282, side: THREE.DoubleSide});
    const boxMesh = new THREE.Mesh(boxGeometry, boxMatarial);
    scene.add(boxMesh);
   
    // composer 需配合 ShaderPass 和 CopyShaer 共同使用, EffectComposer 需在引用在最前，防止报错 THREE.Pass undefine
    const composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // bloom
    const bloomPass = new THREE.BloomPass(
        2, // strength
        25, // kernel size
        1, // sigma
        256 // blur render target resolution
    );
    composer.addPass(bloomPass); 

    const filmPass = new THREE.FilmPass(
        1., // noise intensity
        1, // scanline intensity
        648, // scanline count
        false, // grayscale
    );
    filmPass.renderToScreen = true;
    composer.addPass(filmPass);




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
        // renderer.render(scene, camera);

    }
    animate();
}
main();