import * as THREE from 'three';

export default class TopologyWork {
  constructor (filename) {
    this.isLoad = false;
    this.koef = 32;
    this.onLoad = function () {};

    const func = function (image) {
      const context = document.createElement('canvas').getContext('2d');
      const { width: w, height: h } = image;
      context.canvas.width = w;
      context.canvas.height = h;
      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, w, h);

      this.data = data;
      this.h = h;
      this.w = w;

      const geometry = new THREE.Geometry();

      for (let z = 0; z < h - 1; z++) {
        for (let x = 0; x < w - 1; x++) {
          const pixelH = (z * w + x) * 4;
          const nextRowPixelH = pixelH + (w * 4);

          const h00 = data[pixelH] / 16;
          const h01 = data[pixelH + 4] / 16;
          const h10 = data[nextRowPixelH] / 16;
          const h11 = data[nextRowPixelH + 4] / 16;
          const pointH = (h00 + h01 + h10 + h11) / 4;

          const x0 = x * 2 / this.koef;
          const x1 = (x + 1) * 2 / this.koef;
          const z0 = z * 2 / this.koef;
          const z1 = (z + 1) * 2 / this.koef;

          const ndx = geometry.vertices.length;

          geometry.vertices.push(
            new THREE.Vector3(x0, h00, z0),
            new THREE.Vector3(x1, h01, z0),
            new THREE.Vector3(x0, h10, z1),
            new THREE.Vector3(x1, h11, z1),
            new THREE.Vector3((x0 + x1) / 2, pointH, (z0 + z1) / 2)
          );

          geometry.faces.push(
            new THREE.Face3(ndx + 0, ndx + 4, ndx + 1),
            new THREE.Face3(ndx + 1, ndx + 4, ndx + 3),
            new THREE.Face3(ndx + 3, ndx + 4, ndx + 2),
            new THREE.Face3(ndx + 2, ndx + 4, ndx + 0)
          );
        }
      }
      geometry.computeVertexNormals();

      geometry.translate(w / -this.koef, 0, h / -this.koef);

      const material = new THREE.MeshPhongMaterial({ color: 'blue' });

      this.topology = new THREE.Mesh(geometry, material);

      this.topology.receiveShadow = true;

      this.isLoad = true;

      this.onLoad();
    };

    const createTopology = func.bind(this);
    this.imgLoader = new THREE.ImageLoader();
    this.imgLoader.load(filename, createTopology);
  }

  draw (scene) {
    if (this.isLoad === true) {
      scene.add(this.topology);
    } else {
      this.onLoad = () => { this.scene.add(this.topology); };
      this.scene = scene;
    }
  }

  height (x, y) {
    if (this.isLoad === true) {
      const a = this.data[(Math.round((y * this.koef + this.h) / 2) * this.w + Math.round((x * this.koef + this.w) / 2)) * 4] / 16;
      if (isNaN(a) || x < -this.w / this.koef || y < -this.h / this.koef || x >= this.w / this.koef || y >= this.h / this.koef) {
        return 0;
      }
      return a;
    }
  }
}
