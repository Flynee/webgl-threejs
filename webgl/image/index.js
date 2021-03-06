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

function mian(image, image2) {
    const canvas = document.querySelector('#div3d');
    canvas.width = 500;
    canvas.height = 500;
    const gl = canvas.getContext('webgl');
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // drawElemets 绘制纹理
    const vertexShaderSource = `
        
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;

        void main() {
            
            gl_Position = vec4(a_position, 0, 1);
            v_texCoord = a_texCoord * 10.0;
        }
    `;
    const fragmentShaderSource = `
        precision mediump float;
        uniform sampler2D u_image;
        varying vec2 v_texCoord;
        
        void main() {
            gl_FragColor = texture2D(u_image, v_texCoord);
        }
    `;

    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
    const u_image = gl.getUniformLocation(program, "u_image");

    // 顶点坐标数据
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // 0, 0,
        // 0.4, 0.4,
        // 0, 0.4,
        // 0, 0,
        // 0.4, 0,
        // 0.4, 0.4
        -1.0, -1.0,
       1.0,1.0,
        -1.0,1.0,
        -1.0, -1.0,
       1.0, -1.0,
       1.0,1.0
     ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);




    // 纹理坐标
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,
        1.0, 1.0,
        0, 1.0,
        0, 0,
        1.0, 0,
        1.0, 1.0
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // 创建纹理
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // 剪裁模式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT); // 纹理水平填充
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); // 纹理垂直填充
    // 缩放模式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR ); // 设置纹理缩小滤波器
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR ); // 设置纹理放大滤波器

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // 设置使用的纹理单元号
    gl.uniform1i(u_image, 0);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // ///////////////////////////////////绘制第二个纹理

     // 顶点坐标数据
     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
         0, 0,
         0.4, 0.4,
         0, 0.4,
         0, 0,
         0.4, 0,
         0.4, 0.4
      ]), gl.STATIC_DRAW);
     gl.enableVertexAttribArray(positionLocation);
     gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
 
     // 创建纹理
     gl.activeTexture(gl.TEXTURE3);
     const texture2 = gl.createTexture();
     gl.bindTexture(gl.TEXTURE_2D, texture2);
     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
 
    //  
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
 
     // 设置使用的纹理单元号
     gl.uniform1i(u_image, 3);
 
     gl.useProgram(program);
     gl.drawArrays(gl.TRIANGLES, 0, 6);

}

async function loadImage(src) {
    return new Promise((resolve, reject)=> {
        const image = new Image();
        image.src = src;
        image.onload = function() {
            resolve(image);
        }
    });
}

async function render() {
    const src = "./beauty.png";
    const src2 = "./beauty2.png";
    const image = await loadImage(src);
    const image2 = await loadImage(src2);

    mian(image, image2);
}

render();
