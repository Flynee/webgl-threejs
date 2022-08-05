
function main() {
    const scene = new THREE.Scene();
    window.screen = scene;
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const frustumSize = 10;//10; //设置显示相机前方1000高的内容
    const aspect = window.innerWidth / innerHeight; //计算场景的宽高比
    camera = new THREE.OrthographicCamera(
        frustumSize * aspect / - 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / - 2,
        0,
        1000,
        // 5000,
        // 1e-6,  //数值大，效果不对，透视了
        // 1e27
    );
    window.camera = camera;
    const renderer = new THREE.WebGLRenderer();
    const group = new THREE.Group();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);
    scene.add(group);

    // ambidentLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    group.add(ambientLight);

    // directionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(20, 20, 20);
    directionalLight.target.position.set(0, 0, 0);
    group.add(directionalLight);
    group.add(directionalLight.target);


    // box
    const boxGeometry = new THREE.BoxGeometry();
    const boxColor = new THREE.Color();
    boxColor.setHex(0x333333);
    const boxMaterial = new THREE.MeshLambertMaterial({color: boxColor, transparent: false, opacity: 0.8});
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    group.add(boxMesh);
    
    // gridHelper
    const gridHelper = new THREE.GridHelper(10, 10, 0x00ff00, 0x66666);
    group.add(gridHelper);

     // axes helper
     const axesHelper = new THREE.AxesHelper(5);
     const xAxisColor = new THREE.Color('#ff0000');
     const yAxisColor = new THREE.Color('#00ff00');
     const zAxisColor = new THREE.Color('#0000ff');
     axesHelper.setColors(xAxisColor, yAxisColor, zAxisColor);
    //  axesHelper.add(controls2._gizmos);
     scene.add(axesHelper);
 
    
    
    const controls2 = new THREE.ArcballControls(camera, renderer.domElement, scene);
    controls2.enableZoom = true;
    controls2.cursorZoom = true;
    window.controls2 = controls2;

    camera.position.set(0, 8, 20);
    
    function animate() {
        
        controls2.update();
        requestAnimationFrame(animate);
        
        renderer.render(scene, camera);

    }
    animate();
}
main();