import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class ObjectWork {
  constructor (filename, scene) {
    const gltfLoader = new GLTFLoader();
    this.isLoad = false;
    this.onLoad = () => {};
    this.onUpdate = () => {};

    gltfLoader.load('src/obj/truck.glb', (object) => {
      this.obj = object.scene;

      this.isLoad = true;

      this.onLoad();
    });
  }

  draw (scene) {
    if (this.isLoad === true) {
      scene.add(this.obj);
    } else {
      this.onLoad = () => { this.scene.add(this.obj); };
      this.scene = scene;
    }
  }

  get object () {
    return this.obj;
  }
}
