function createShader(gl, shaderSource, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS); 
    if (!success) {
        console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const sucess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!sucess) {
        console.error(gl.getProgramInfoLog(program));
    }
    return program;
    
}

function mian() {
    const canvas = document.querySelector('#div3d');
    canvas.width = 500;
    canvas.height = 500;
    const gl = canvas.getContext('webgl');
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // drawArrays 绘制三角形

    const vertexShaderSource = `
        attribute vec4 a_position;

        void main() {
            gl_Position = a_position;
        }
    `;
    const fragmentShaderSource = `
        precision mediump float;

        void main() {
            gl_FragColor = vec4(1, 0, 0.4, 1);
        }

    `;

    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const triangleArray = new Float32Array([
        0, 0, 0,
        0, 0.1, 0,
        0.1, 0, 0
    ]);
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleArray, gl.STATIC_DRAW);
    const a_position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // drawElemets 绘制矩形
    const vertexShaderSource2 = `
        attribute vec4 a_position;

        void main() {
            gl_Position = a_position;
        }
    `;
    const fragmentShaderSource2 = `
        precision mediump float;

        void main() {
            gl_FragColor = vec4(0, 1.0, 0, 1.0);
        }
    `;

    const vertexShader2 = createShader(gl, vertexShaderSource2, gl.VERTEX_SHADER);
    const fragmentShader2 = createShader(gl, fragmentShaderSource2, gl.FRAGMENT_SHADER);
    const program2 = createProgram(gl, vertexShader2, fragmentShader2);

    const a_position2 = gl.getAttribLocation(program2, "a_position");
    const rectArray = new Float32Array([
        0.2, 0, 0,
        0.4, 0, 0,
        0.4, 0.2, 0,
        0.2, 0.2, 0,
    ]);
    const rectBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rectArray, gl.STATIC_DRAW);

    const indexArray = new Int16Array([
        0, 1, 2,
        2, 3, 0, 
    ]); 
    const rectIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(a_position2);
    gl.vertexAttribPointer(a_position2, 3, gl.FLOAT, false, 0, 0);
    gl.useProgram(program2);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

}

mian();