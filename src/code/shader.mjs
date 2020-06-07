import fragShd from './../shd/def.fs';
import vertShd from './../shd/def.vs';

export default class ShaderWork {
  constructor (gl, ...arg) {
    const fragmentShader = this.getShader(gl, gl.FRAGMENT_SHADER, fragShd);
    const vertexShader = this.getShader(gl, gl.VERTEX_SHADER, vertShd);

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert('Could not initialize shaders');
    }

    gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    for (const i of arg) {
      this.shaderProgram[i] = gl.getUniformLocation(this.shaderProgram, i);
    }
  }

  getShader (gl, type, str) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  setUniforms (gl, squareVertexPositionBuffer, ...arg) {
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    for (const i of arg) {
      switch (i.type) {
        case 'float':
          gl.uniform1f(this.shaderProgram[i.name], i.value);
          break;
        case 'int':
          gl.uniform1i(this.shaderProgram[i.name], i.value);
          break;
      }
    }
  }
}
