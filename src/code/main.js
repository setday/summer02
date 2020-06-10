import './style.css';
import * as THREE from 'three';
import MouseWork from './mouse.mjs';
import KeyboardWork from './keyboard.mjs';
import TopologyWork from './topology.js';
import CarFromObj from './car.mjs';

function webGLStart () {
  const canvas = document.querySelector('#ThreeCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  const mw = new MouseWork(canvas);
  const kw = new KeyboardWork(canvas, keyFunc);
  const tw = new TopologyWork('topo.png');
  let xAngle = 0.0; let yAngle = 0.0;

  const fov = 75;
  const aspect = 1;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const car = new CarFromObj('truck.glb');
  const scene = new THREE.Scene();

  camera.position.z = 4;
  camera.position.y = 0;
  camera.position.set(0, 0, 4);

  {
    const color = 0xFFFFFF;
    const intensity = 5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 1, 0);
    scene.add(light);
    const light1 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(1, 0, 0);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(0, 0, 1);
    scene.add(light2);
  }

  tw.draw(scene);
  car.draw(scene);

  function keyFunc (key) {
    switch (key) {
      case 'w':
        car.addspeed(0.0002);
        break;
      case 's':
        car.addspeed(-0.0002);
        break;
      case 'a':
        car.addangle(0.002);
        break;
      case 'd':
        car.addangle(-0.002);
        break;
    }
  }

  function resize () {
    const w = canvas.clientWidth; const h = canvas.clientHeight;

    if (canvas.width === w && canvas.height === h) {
      return;
    }

    camera.aspect = w / h;
    renderer.setSize(w, h, false);
    camera.updateProjectionMatrix();
  }

  function render (time) {
    time *= 0.0003;

    yAngle += mw.getYChange / 500;
    xAngle = mw.getTransX / 500;

    resize();
    renderer.render(scene, camera);

    car.update();
    kw.update();
    camera.position.set(car.getX + Math.sin(xAngle) * Math.cos(yAngle) * mw.getTransZ,
      car.getY - Math.sin(yAngle) * mw.getTransZ,
      car.getZ + Math.cos(xAngle) * Math.cos(yAngle) * mw.getTransZ);
    camera.lookAt(car.getX, car.getY, car.getZ);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

webGLStart();
