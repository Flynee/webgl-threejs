
function main() {
    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 1000);
    const camera2 = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(canvas.width, canvas.height);

   

    // AmbientLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const ambientLight2 = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    scene2.add(ambientLight2);

    // DirectionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5,);
    directionalLight.position.set(10, 10, 10);
    directionalLight.target.position.set(-10, -10, -10);
    scene2.add(directionalLight);
    scene2.add(directionalLight.target);


    // sphere
    const geometry = new THREE.SphereGeometry( 1, 32, 16 );
    const material = new THREE.MeshLambertMaterial( { color: 0x222222 } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(1, 1, 0);
    scene2.add( sphere );

    // box
    const boxGemotry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
    const box = new THREE.Mesh(boxGemotry, boxMaterial);
    box.position.set(-1, -1, 0);
    scene.add(box);

   
    camera.position.set(0, 0, 5);
    camera2.position.set(0, 0, 5);

    const canvas1 = document.querySelector('#scene-one');
    const canvas2 = document.querySelector('#scene-two');

    const controls = new THREE.TrackballControls(camera, canvas1);
    const controls2 = new THREE.TrackballControls(camera2, canvas2);


    function animate() {
        requestAnimationFrame(animate);
       
        // 离屏渲染
        renderer.render(scene, camera);

        const ctx1 = canvas1.getContext('2d');
        ctx1.drawImage(renderer.domElement, 
            0,0,renderer.domElement.width,renderer.domElement.height,
            0,0,canvas1.width,canvas1.height );
            controls.update();

         renderer.render(scene2, camera2);
    
        const ctx2 = canvas2.getContext('2d');
        ctx2.drawImage(renderer.domElement, 
            0,0,renderer.domElement.width,renderer.domElement.height,
            0,0,canvas2.width,canvas2.height );
            controls2.update();


    }
    animate();
}
main();