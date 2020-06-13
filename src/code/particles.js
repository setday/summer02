import * as THREE from 'three';

export default class ParticlesWork {
  constructor (dTime, texture, onSpawn = () => {}, onUpdate = () => {}) {
    this.onSpawn = onSpawn;
    this.onUpdate = onUpdate;

    this.spriteMap = new THREE.TextureLoader().load(texture);

    this.time = 0;
    this.dTime = dTime;

    this.sprites = [];
  }

  update (time) {
    for (let i = 0; i < this.sprites.length; i++) {
      if (this.onUpdate(this.sprites[i]) === false) {
        this.sprites.splice(i, 1);
      }
    }

    if (time - this.time >= this.dTime || this.time === 0) {
      const spriteMaterial = new THREE.SpriteMaterial({ map: this.spriteMap, color: 0xffffff, transparent: true });
      const newSprite = new THREE.Sprite(spriteMaterial);

      if (this.onSpawn(newSprite) === false) {
        return;
      }

      this.sprites.push(newSprite);

      this.time = time;
    }
  }
}
