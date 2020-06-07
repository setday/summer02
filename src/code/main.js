import './style.css';
import * as THREE from 'three';
import MouseWork from './mouse.mjs';

function webGLStart () {
  const canvas = document.querySelector('#ThreeCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  const mw = new MouseWork(canvas);
  let xAngle = 0.0; let yAngle = 0.0;

  const fov = 75;
  const aspect = 1;
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;
  camera.position.y = 2;

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

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
    cube.rotation.x = time;
    cube.rotation.y = time;
    cube.rotation.z = time;
    renderer.render(scene, camera);

    camera.lookAt(camera.position.x - Math.sin(xAngle) * Math.cos(yAngle),
      camera.position.y + Math.sin(yAngle),
      camera.position.z - Math.cos(xAngle) * Math.cos(yAngle));

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

webGLStart();
