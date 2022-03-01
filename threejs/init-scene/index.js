function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);

    // cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // tringle
    const points = [
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(5, 2, 0),
        new THREE.Vector3(6, 0, 0),
    ];
    const shape = new THREE.Shape(points);
    // const extrudeSettings = { depth: 0, bevelEnabled: false, steps: 1,};
    // const shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const shapeGeometry = new THREE.ShapeGeometry(shape, 1);
    const tringle = new THREE.Mesh(shapeGeometry, material);

    // line
    const linePoints = [
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 5, 0),
    ];
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

    const line = new THREE.Line(lineGeometry, lineMaterial);

    scene.add(cube);
    scene.add(tringle);
    scene.add(line);

    camera.position.set(0, 0, 10);

    function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}
main();