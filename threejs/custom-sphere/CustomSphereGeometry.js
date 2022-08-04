class CustomSphereGeometry extends THREE.BufferGeometry {
    /**
     * 
     * @param { Number } radius 半径
     * @param { Number } widthSegments 宽度节数
     * @param { Number } heightSegments 高度节数
     * @param { Number } phiStart 纬度起始角度
     * @param { Number } phiEnd 纬度结束角度
     * @param { Number } thetaStart 经度起始角度
     * @param { Number } thetaEnd 经度结束角度
     */
    constructor(radius = 1, widthSegments = 32, heightSegments = 16, phiStart = 0, phiEnd = 360, thetaStart = 0, thetaEnd = 180) {
        super();
        this.type = 'CustomSphereGeometryextends';
        this.parameters = {
            radius: radius,
            widthSegments: widthSegments,
            heightSegments: heightSegments,

            // 纬度
            phiStart: phiStart,
            phiEnd: phiEnd,

            // 经度
            thetaStart: thetaStart,
            thetaEnd: thetaEnd
        };
        widthSegments = Math.max(3, Math.floor(widthSegments));
        heightSegments = Math.max(2, Math.floor(heightSegments));
        const thetaEnd = Math.min(thetaStart + thetaEnd, Math.PI);
        let index = 0;
        const grid = [];
        const vertex = new THREE.Vector3();
        const normal = new THREE.Vector3(); // buffers

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = []; // generate vertices, normals and uvs

        
        // const bis = 1E-10;
        // for (let iy = 0; iy <= heightSegments; iy++) {

            

        //     const verticesRow = [];
        //     const v = iy / heightSegments; // special case for the poles

        //     let uOffset = 0;

        //     if (iy == 0 && thetaStart == 0) {
        //         uOffset = 0.5 / widthSegments;
        //     } else if (iy == heightSegments && thetaEnd == Math.PI) {
        //         uOffset = -0.5 / widthSegments;
        //     }

        //     // if (Math.abs(thetaEnd) - Math.PI <= bis) {

        //     // }

        //     for (let ix = 0; ix <= widthSegments; ix++) {
        //         const u = ix / widthSegments; // vertex

        //         vertex.x = -radius * Math.cos(phiStart + u * phiEnd) * Math.sin(thetaStart + v * thetaEnd);
        //         vertex.y = radius * Math.cos(thetaStart + v * thetaEnd);
        //         vertex.z = radius * Math.sin(phiStart + u * phiEnd) * Math.sin(thetaStart + v * thetaEnd);
        //         vertices.push(vertex.x, vertex.y, vertex.z); // normal

        //         normal.copy(vertex).normalize();
        //         normals.push(normal.x, normal.y, normal.z); // uv

        //         uvs.push(u + uOffset, 1 - v);
        //         verticesRow.push(index++);
        //     }

        //     grid.push(verticesRow);
        // } // indices


        // for (let iy = 0; iy < heightSegments; iy++) {
        //     for (let ix = 0; ix < widthSegments; ix++) {
        //         const a = grid[iy][ix + 1];
        //         const b = grid[iy][ix];
        //         const c = grid[iy + 1][ix];
        //         const d = grid[iy + 1][ix + 1];
        //         if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
        //         if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
        //     }
        // } // build geometry


        this.setIndex(indices);
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    }

    static fromJSON(data) {
        return new THREE.CustomSphereGeometryextends(data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiEnd, data.thetaStart, data.thetaEnd);
    }

}

export default CustomSphereGeometry;