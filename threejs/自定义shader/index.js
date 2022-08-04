

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
    const vs = `
        
        uniform vec4 color;
        varying vec4 vColor;
        varying float vflag;

        void main() {
            if (abs(position.y) <=  0.39  && abs(position.z)  <= 0.39) {
                vflag = 1.0;
            } else {
                vflag = 0.0;
            }
            vColor = color;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;
    const fs = `
        precision mediump float;

        varying vec4 vColor;
        varying float vflag;

        void main() 
        { 
            vec4 color = vColor;
            if (vflag > 0.0) {
                color.a = 0.5;
            }
            gl_FragColor = vec4(color);
        }
    `;


    const material = new THREE.ShaderMaterial( 
        {
            uniforms:{ 
                color: {value: new THREE.Vector4(1, 0, 0, 1)},

            },
            vertexShader:   vs,
            fragmentShader: fs,
            side: THREE.DoubleSide,
            transparent: true,
            // wireframe: true
        });
    const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    console.debug(geometry);
    const x_geo = geometry.clone();
    x_geo.rotateY(0.5 * Math.PI);
    const x_mat = material.clone();
    const x_mesh = new THREE.Mesh(x_geo, x_mat);
    
    scene.add(x_mesh);


    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
main();