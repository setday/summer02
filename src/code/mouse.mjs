'use strict';

export default class MouseWork {
  constructor (canvas) {
    this.transX = 0.0; this.transY = 0.0; this.transZ = 0.0;
    this.mouseX = 0.0; this.mouseY = 0.0;
    this.mouseXChange = 0.0; this.mouseYChange = 0.0;

    let func = this.onWheel.bind(this);

    canvas.addEventListener('wheel', func);

    func = this.onMouseChangePos.bind(this);

    document.addEventListener('mousemove', func);

    func = this.onMouseMove.bind(this);

    canvas.onmousedown = (event) => {
      this.startPosX = event.pageX;
      this.startPosY = event.pageY;

      document.addEventListener('mousemove', func);
    };

    window.onmouseup = () => {
      document.removeEventListener('mousemove', func);
    };
  }

  onWheel (event) {
    this.mouseX = event.offsetX - 500; this.mouseY = 500 - event.offsetY;

    this.transZ += event.deltaY * 3 / 10000;

    return false;
  }

  onMouseMove (event) {
    this.mouseXChange = this.startPosX - event.pageX;
    this.transX += this.mouseXChange;
    this.startPosX = event.pageX;

    this.mouseYChange = this.startPosY - event.pageY;
    this.transY += this.mouseYChange;
    this.startPosY = event.pageY;
  }

  onMouseChangePos (event) {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
  }

  get getTransX () {
    return this.transX;
  }

  get getTransY () {
    return this.transY;
  }

  get getXChange () {
    const change = this.mouseXChange;
    this.mouseXChange = 0;
    return change;
  }

  get getYChange () {
    const change = this.mouseYChange;
    this.mouseYChange = 0;
    return change;
  }

  get getTransZ () {
    return this.transZ;
  }
}
