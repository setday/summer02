import ObjectWork from './objects.mjs';
import * as THREE from 'three';

export default class CarFromObj extends ObjectWork {
  constructor (filename) {
    const obj = super(filename);
    this.obj = obj;
    this.speed = 0.0;
    this.angle = 0.0;
    this.position = { x: 0, y: 13, z: 0 };
    this.wheelRot = 0;
    this.wheelRotY = 0;
  }

  draw (scene) {
    const func = () => {
      this.lfWheel = this.obj.getObjectByName('FL');
      this.rfWheel = this.obj.getObjectByName('FR');
      this.llWheel = this.obj.getObjectByName('RL');
      this.rlWheel = this.obj.getObjectByName('RR');
      this.body = this.obj.getObjectByName('Body');

      scene.add(this.body);

      this.bodyH = this.body.position.y;

      for (const i of this.body.children) {
        i.receiveShadow = true;
        i.castShadow = true;
      }

      {
        const color = 0xFFFFFF;
        const intensity = 1;

        this.light = new THREE.SpotLight(color, intensity);
        this.light.position.set(-2.6, 1.066 - this.body.position.y, 0.632);
        this.light.target.position.set(-3.739, 1.066 - this.body.position.y, 0.632);
        this.light.distance = 10;
        this.body.add(this.light);
        this.body.add(this.light.target);

        this.light1 = new THREE.SpotLight(color, intensity);
        this.light1.position.set(-2.6, 1.066 - this.body.position.y, -0.632);
        this.light1.target.position.set(-3.739, 1.066 - this.body.position.y, -0.632);
        this.light1.distance = 10;
        this.body.add(this.light1);
        this.body.add(this.light1.target);
      }

      this.lfWheel.position.x -= this.body.position.x;
      this.lfWheel.position.y -= this.body.position.y;
      this.lfWheel.position.z -= this.body.position.z;
      this.body.add(this.lfWheel);

      for (const i of this.lfWheel.children) {
        i.receiveShadow = true;
        i.castShadow = true;
      }

      this.rfWheel.position.x -= this.body.position.x;
      this.rfWheel.position.y -= this.body.position.y;
      this.rfWheel.position.z -= this.body.position.z;
      this.body.add(this.rfWheel);

      for (const i of this.rfWheel.children) {
        i.receiveShadow = true;
        i.castShadow = true;
      }

      this.llWheel.position.x -= this.body.position.x;
      this.llWheel.position.y -= this.body.position.y;
      this.llWheel.position.z -= this.body.position.z;
      this.body.add(this.llWheel);

      for (const i of this.llWheel.children) {
        i.receiveShadow = true;
        i.castShadow = true;
      }

      this.rlWheel.position.x -= this.body.position.x;
      this.rlWheel.position.y -= this.body.position.y;
      this.rlWheel.position.z -= this.body.position.z;
      this.body.add(this.rlWheel);

      for (const i of this.rlWheel.children) {
        i.receiveShadow = true;
        i.castShadow = true;
      }

      this.onUpdate = () => {
        this.body.position.x = this.position.x;
        this.body.position.y = this.position.y;
        this.body.position.z = this.position.z;

        this.lfWheel.rotation.z = this.wheelRot;
        this.rfWheel.rotation.z = -this.wheelRot;
        this.lfWheel.rotation.y = this.wheelRotY;
        this.rfWheel.rotation.y = -this.wheelRotY;
        this.llWheel.rotation.z = this.wheelRot;
        this.rlWheel.rotation.z = -this.wheelRot;

        this.body.rotation.y = this.angle;
      };
    };

    if (this.isLoad === true) {
      func();
    } else {
      this.onLoad = () => { func(); };
      this.scene = scene;
    }
  }

  addspeed (value) {
    if (value > 0 && this.speed < 0.05) {
      this.speed += value;
    } else if (value < 0 && this.speed > -0.05) {
      this.speed += value;
    }
  }

  addangle (value) {
    if (value > 0 && this.wheelRotY < 0.524) {
      this.wheelRotY += value;
    } else if (value < 0 && this.wheelRotY > -0.524) {
      this.wheelRotY += value;
    }
  }

  update () {
    this.angle += this.wheelRotY / 2 * this.speed;
    this.position.z -= this.speed * Math.sin(-this.angle);
    this.position.x -= this.speed * Math.cos(-this.angle);
    this.wheelRot += this.speed / 1;
    this.onUpdate();
  }

  get getX () {
    return this.position.x;
  }

  get getY () {
    return this.position.y;
  }

  get getZ () {
    return this.position.z;
  }

  set height (value) {
    this.position.y = value + this.bodyH;
  }
}
