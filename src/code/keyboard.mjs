'use strict';

export default class KeyboardWork {
  constructor (canvas, inputfunc) {
    this.arr = new Set();
    this.inputfunc = inputfunc;
    this.z = 0;

    const add = (e) => { this.arr.add(e.key); };

    let func = add.bind(this);

    document.addEventListener('keydown', func);

    const remove = (e) => { this.arr.delete(e.key); };

    func = remove.bind(this);

    document.addEventListener('keyup', func);
  }

  update () {
    for (const i of this.arr) {
      this.inputfunc(i);
    }
    this.z += 1;
  }
}
