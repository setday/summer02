import './style.css';
import io from 'socket.io-client';
import * as THREE from 'three';
import MouseWork from './mouse.mjs';
import KeyboardWork from './keyboard.mjs';
import TopologyWork from './topology.js';
import CarFromObj from './car.js';
import fileImg from './../img/topo.png';
import fileCar from './../obj/truck.glb';

function webGLStart () {
  const canvas = document.querySelector('#ThreeCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  const cars = {};
  const socket = io('https://limitless-scrubland-56705.herokuapp.com/');
  // const socket = io('localhost:8081/');

  renderer.shadowMap.enabled = true;

  const mw = new MouseWork(canvas);
  const kw = new KeyboardWork(canvas, keyFunc);
  const tw = new TopologyWork(fileImg);
  let xAngle = 0.0; let yAngle = 0.0;

  const fov = 75;
  const aspect = 1;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const car = new CarFromObj(fileCar);
  const scene = new THREE.Scene();

  socket.on('connect', () => {
    console.log('loh');
    socket.on('addCar', (id) => { cars[id] = new CarFromObj(fileCar); cars[id].draw(scene); });

    socket.on('delCar', (id) => { cars[id].remove(); delete cars[id]; });

    socket.on('updateAll', () => {
      socket.emit('update', car.speed, car.position.x, car.position.y, car.position.z, car.angle, car.wheelRotY);
    });

    socket.on('update', (id, speed, x, y, z, angle, wheelRotY) => {
      cars[id].speed = speed;
      cars[id].position.x = x;
      cars[id].position.y = y;
      cars[id].position.z = z;
      cars[id].angle = angle;
      cars[id].wheelRotY = wheelRotY;
    });

    socket.on('speedSet', (id, speed) => { cars[id].speed = speed; });

    socket.on('wheelRotYSet', (id, wheelRotY) => { cars[id].wheelRotY = wheelRotY; });
  });

  scene.background = new THREE.Color(0xEEEEEE);

  camera.position.z = 4;
  camera.position.y = 0;
  camera.position.set(0, 0, 4);

  const color = 0xFFFFFF;
  const intensity = 0.5;
  const light = new THREE.DirectionalLight(color, intensity);
  light.castShadow = true;
  light.position.set(0, 20, 10);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);

  tw.draw(scene);
  car.draw(scene);

  function keyFunc (key) {
    switch (key) {
      case 'ц':
      case 'w':
        car.addspeed(0.0002);
        socket.emit('speedSet', car.speed);
        break;
      case 'ы':
      case 's':
        car.addspeed(-0.0002);
        socket.emit('speedSet', car.speed);
        break;
      case 'ф':
      case 'a':
        car.addangle(0.004);
        socket.emit('wheelRotYSet', car.wheelRotY);
        break;
      case 'в':
      case 'd':
        car.addangle(-0.004);
        socket.emit('wheelRotYSet', car.wheelRotY);
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

  function sunupdate (time, maxtime) {
    time %= maxtime;

    const i = Math.cos(Math.PI * 2 * time / maxtime);

    if (maxtime / 4 > time || maxtime * 3 / 4 < time) {
      light.intensity = i * 2;
      light.position.set(car.getX, car.getY + i * 10, car.getZ + Math.sin(Math.acos(i)) * 10 * Math.sign(time - maxtime / 2));
      light.target.position.set(car.getX, car.getY, car.getZ);
      scene.background = new THREE.Color(1 - i, 0.63 + i * 0.37, 0.29 + i * 0.71);
    } else {
      scene.background = new THREE.Color(1 + i, 0.63 + i * 0.63, 0.29 + i * 0.29);
    }
  }

  function render (time) {
    time *= 0.0003;

    yAngle += mw.getYChange / 500;
    xAngle = mw.getTransX / 500;

    resize();
    renderer.render(scene, camera);

    car.height = tw.height(car.getX, car.getZ);
    car.update(time);
    kw.update();
    for (const i in cars) {
      cars[i].height = tw.height(cars[i].getX, cars[i].getZ);
      cars[i].update();
    }
    camera.position.set(car.getX + Math.sin(xAngle) * Math.cos(yAngle) * mw.getTransZ,
      car.getY - Math.sin(yAngle) * mw.getTransZ,
      car.getZ + Math.cos(xAngle) * Math.cos(yAngle) * mw.getTransZ);
    camera.lookAt(car.getX, car.getY, car.getZ);

    sunupdate(time, 20);

    window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
}

webGLStart();
