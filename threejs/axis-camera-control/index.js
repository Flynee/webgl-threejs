
// 自定义扇形Geometry
class CustomSectorGeometry extends THREE.BufferGeometry {
    constructor( thetaStart = 0, thetaLength = Math.PI / 2, normal = new THREE.Vector3(0, 0, 1), radius=0.48, segments = 50) {
        super();
        this.type = 'CustomSectorGeometry';
        this.parameters = {
            radius: radius,
            segments: segments,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        segments = Math.max(3, segments); // buffers

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = []; // helper variables
        let rotateAxis = 'Z';
        if (normal.x) {
            rotateAxis = 'X';
        }
        if (normal.y) {
            rotateAxis = 'Y';
        }
        if (normal.z) {
            rotateAxis = 'Z';
        }
        
        
        const vertex = new THREE.Vector3();
        const uv = new THREE.Vector2(); // center point

        vertices.push(0, 0, 0);
        normals.push(normal.x, normal.y, normal.z);
        uvs.push(0.5, 0.5);

        for (let s = 0, i = 3; s <= segments; s++, i += 3) {
            const segment = thetaStart + s / segments * thetaLength; // vertex


            if (rotateAxis === 'Z') {
                vertex.x = radius * Math.cos(segment);
                vertex.y = radius * Math.sin(segment);

                uv.x = (vertices[i] / radius + 1) / 2;
                uv.y = (vertices[i + 1] / radius + 1) / 2;
                uvs.push(uv.x, uv.y);
            }
            if (rotateAxis === 'Y') {
                vertex.z = radius * Math.cos(segment);
                vertex.x = radius * Math.sin(segment);

                uv.z = (vertices[i] / radius + 1) / 2;
                uv.x = (vertices[i + 1] / radius + 1) / 2;
                uvs.push(uv.z, uv.x);
            }
            if (rotateAxis === 'X') {
                vertex.y = radius * Math.cos(segment);
                vertex.z = radius * Math.sin(segment);

                
                uv.y = (vertices[i] / radius + 1) / 2;
                uv.z = (vertices[i + 1] / radius + 1) / 2;
                uvs.push(uv.y, uv.z);
            }
            vertices.push(vertex.x, vertex.y, vertex.z); // normal
            normals.push(normal.x, normal.y, normal.z); // uvs
        } // indices


        for (let i = 1; i <= segments; i++) {
            indices.push(i, i + 1, 0);
        } // build geometry


        this.setIndex(indices);
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    }

    static fromJSON(data) {
        return new CustomSectorGeometry(data.radius, data.segments, data.thetaStart, data.thetaLength);
    }

}

// 自定义Mesh 
class SectorMesh extends THREE.Object3D {
    constructor(geometry = new THREE.BufferGeometry(), material = new THREE.MeshBasicMaterial()) {
        super();
        this.type = 'SectorMesh';
        this.geometry = geometry;
        this.material = material;
        this.updateMorphTargets();
    }
    copy(source) {
        super.copy(source);

        if (source.morphTargetInfluences !== undefined) {
            this.morphTargetInfluences = source.morphTargetInfluences.slice();
        }

        if (source.morphTargetDictionary !== undefined) {
            this.morphTargetDictionary = Object.assign({}, source.morphTargetDictionary);
        }

        this.material = source.material;
        this.geometry = source.geometry;
        return this;
    }

    updateMorphTargets() {
        const geometry = this.geometry;

        if (geometry.isBufferGeometry) {
            const morphAttributes = geometry.morphAttributes;
            const keys = Object.keys(morphAttributes);

            if (keys.length > 0) {
                const morphAttribute = morphAttributes[keys[0]];

                if (morphAttribute !== undefined) {
                    this.morphTargetInfluences = [];
                    this.morphTargetDictionary = {};

                    for (let m = 0, ml = morphAttribute.length; m < ml; m++) {
                        const name = morphAttribute[m].name || String(m);
                        this.morphTargetInfluences.push(0);
                        this.morphTargetDictionary[name] = m;
                    }
                }
            }
        } else {
            const morphTargets = geometry.morphTargets;

            if (morphTargets !== undefined && morphTargets.length > 0) {
                console.error('THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.');
            }
        }
    }

    raycast(raycaster, intersects) {
        const geometry = this.geometry;
        const material = this.material;
        const matrixWorld = this.matrixWorld;
        if (material === undefined) return; // Checking boundingSphere distance to ray

        if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

        _sphere$3.copy(geometry.boundingSphere);

        _sphere$3.applyMatrix4(matrixWorld);

        if (raycaster.ray.intersectsSphere(_sphere$3) === false) return; //

        _inverseMatrix$2.copy(matrixWorld).invert();

        _ray$2.copy(raycaster.ray).applyMatrix4(_inverseMatrix$2); // Check boundingBox before continuing


        if (geometry.boundingBox !== null) {
            if (_ray$2.intersectsBox(geometry.boundingBox) === false) return;
        }

        let intersection;

        if (geometry.isBufferGeometry) {
            const index = geometry.index;
            const position = geometry.attributes.position;
            const morphPosition = geometry.morphAttributes.position;
            const morphTargetsRelative = geometry.morphTargetsRelative;
            const uv = geometry.attributes.uv;
            const uv2 = geometry.attributes.uv2;
            const groups = geometry.groups;
            const drawRange = geometry.drawRange;

            if (index !== null) {
                // indexed buffer geometry
                if (Array.isArray(material)) {
                    for (let i = 0, il = groups.length; i < il; i++) {
                        const group = groups[i];
                        const groupMaterial = material[group.materialIndex];
                        const start = Math.max(group.start, drawRange.start);
                        const end = Math.min(index.count, Math.min(group.start + group.count, drawRange.start + drawRange.count));

                        for (let j = start, jl = end; j < jl; j += 3) {
                            const a = index.getX(j);
                            const b = index.getX(j + 1);
                            const c = index.getX(j + 2);
                            intersection = checkBufferGeometryIntersection(this, groupMaterial, raycaster, _ray$2, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

                            if (intersection) {
                                intersection.faceIndex = Math.floor(j / 3); // triangle number in indexed buffer semantics

                                intersection.face.materialIndex = group.materialIndex;
                                intersects.push(intersection);
                            }
                        }
                    }
                } else {
                    const start = Math.max(0, drawRange.start);
                    const end = Math.min(index.count, drawRange.start + drawRange.count);

                    for (let i = start, il = end; i < il; i += 3) {
                        const a = index.getX(i);
                        const b = index.getX(i + 1);
                        const c = index.getX(i + 2);
                        intersection = checkBufferGeometryIntersection(this, material, raycaster, _ray$2, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

                        if (intersection) {
                            intersection.faceIndex = Math.floor(i / 3); // triangle number in indexed buffer semantics

                            intersects.push(intersection);
                        }
                    }
                }
            } else if (position !== undefined) {
                // non-indexed buffer geometry
                if (Array.isArray(material)) {
                    for (let i = 0, il = groups.length; i < il; i++) {
                        const group = groups[i];
                        const groupMaterial = material[group.materialIndex];
                        const start = Math.max(group.start, drawRange.start);
                        const end = Math.min(position.count, Math.min(group.start + group.count, drawRange.start + drawRange.count));

                        for (let j = start, jl = end; j < jl; j += 3) {
                            const a = j;
                            const b = j + 1;
                            const c = j + 2;
                            intersection = checkBufferGeometryIntersection(this, groupMaterial, raycaster, _ray$2, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

                            if (intersection) {
                                intersection.faceIndex = Math.floor(j / 3); // triangle number in non-indexed buffer semantics

                                intersection.face.materialIndex = group.materialIndex;
                                intersects.push(intersection);
                            }
                        }
                    }
                } else {
                    const start = Math.max(0, drawRange.start);
                    const end = Math.min(position.count, drawRange.start + drawRange.count);

                    for (let i = start, il = end; i < il; i += 3) {
                        const a = i;
                        const b = i + 1;
                        const c = i + 2;
                        intersection = checkBufferGeometryIntersection(this, material, raycaster, _ray$2, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

                        if (intersection) {
                            intersection.faceIndex = Math.floor(i / 3); // triangle number in non-indexed buffer semantics

                            intersects.push(intersection);
                        }
                    }
                }
            }
        } else if (geometry.isGeometry) {
            console.error('THREE.Mesh.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.');
        }
    }
}

SectorMesh.prototype.isMesh = true;

function getSectorMesh(thetaStart = 0, thetaLength = Math.PI / 2, normal = new THREE.Vector3(1, 0, 0)) {
    const material = new THREE.MeshBasicMaterial({color: new THREE.Color(1, 1, 1), side: THREE.DoubleSide});
    const geomtry = new CustomSectorGeometry(thetaStart, thetaLength, normal);
    const mesh = new SectorMesh(geomtry, material);
    return mesh;
}
	// 更新扇形
function updateSectorMesh(normal) {
    if (!window.circleMesh) {
        return;
    }
    window.circleMesh.material.needsUpdate = true;
    const color = new THREE.Color(0, 0, 1);
    if (normal.x) {
        color.setHex(0xff0000);
    }
    if (normal.y) {
        color.setHex(0x00ff00);
    }
    if (normal.z) {
        color.setHex(0x0000ff);
    }
    window.circleMesh.geometry && window.circleMesh.geometry.dispose();
    window.circleMesh.geometry = new CustomSectorGeometry(0, Math.PI / 2, normal);
    window.circleMesh.material.color = color;
}

function main() {
    const scene = new THREE.Scene();
    window.scene = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    window.camera = camera;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#div3d').appendChild(renderer.domElement);

    // axis
    const zAxis = [
        // arrow
        new THREE.Vector3(-0.1, 0, 1),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0.1, 0, 1),
        // line
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
    ];

    const xAxis = [];

    
    // axes helper
    const axesHelper = new THREE.AxesHelper(5);
    const xAxisColor = new THREE.Color('#ff0000');
    const yAxisColor = new THREE.Color('#00ff00');
    const zAxisColor = new THREE.Color('#0000ff');
    axesHelper.setColors(xAxisColor, yAxisColor, zAxisColor);
    scene.add(axesHelper);

   
    window.circleMesh = getSectorMesh();
    scene.add(circleMesh);


    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents( window );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 20;

    controls.maxPolarAngle = Math.PI / 2;
    camera.position.set(0, 0, 10);


    setTimeout(()=> {
        updateSectorMesh(new THREE.Vector3(0, 0, 1));
    }, 3 * 1000);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
main();