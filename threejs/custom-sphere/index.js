
export default function main() {
    const scene = new THREE.Scene();
    window.screen = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
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

    const radius = 1;
    const widthSegments = 32;
    const heightSegments = 32;

    // 纬度
    const phiStart = 0;
    const phiLength = 10;

    // 经度
    const thetaStart = -180;
    const thetaLength = 80
    // sphere
    const boxGeometry = new CustomSphereGeometry(radius, widthSegments , heightSegments , phiStart / 180 * Math.PI, phiLength / 180 * Math.PI, thetaStart / 180 * Math.PI, thetaLength / 180 * Math.PI);
    const boxColor = new THREE.Color();
    boxColor.setHex(0x234234);
    const boxMaterial = new THREE.MeshLambertMaterial({color: boxColor, transparent: true, opacity: 0.8, side: THREE.DoubleSide});
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    group.add(boxMesh);

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
    controls.maxDistance = 20;

    controls.maxPolarAngle = Math.PI / 2;
    camera.position.set(0, 8, 20);

    function animate() {
        controls.update();
        requestAnimationFrame(animate);
        
        renderer.render(scene, camera);

    }
    animate();
}