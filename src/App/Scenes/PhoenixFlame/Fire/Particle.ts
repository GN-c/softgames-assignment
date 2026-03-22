import { Particle, Point } from "pixi.js";

const FIRE_TINTS = [0xff1a00, 0xff4500, 0xff6a00, 0xff8c00, 0xffb300, 0xffdd00];

export class FireParticle extends Particle {
  readonly velocity = new Point();
  life = 0;
  maxLife = 1;

  spawn(initialLife = 0): void {
    this.maxLife = 0.9 + Math.random() * 0.7;
    this.life = initialLife;
    this.velocity.set((Math.random() - 0.5) * 35, -(70 + Math.random() * 55));
    this.x = (Math.random() - 0.5) * 25;
    this.y = 0;
    this.rotation = (Math.random() - 0.5) * 0.4;
    this.alpha = 1;
    this.tint = FIRE_TINTS[Math.floor(Math.random() * FIRE_TINTS.length)];
  }

  /** Returns true when expired and should be respawned */
  update(dt: number): boolean {
    this.life += dt;
    if (this.life >= this.maxLife) return true;

    const t = this.life / this.maxLife;

    this.x += this.velocity.x * dt;
    this.y += this.velocity.y * dt;
    this.velocity.x += (Math.random() - 0.5) * 18 * dt;
    this.velocity.y *= 1 - 1.2 * dt;

    const s = (1 - t) * 1.8;
    this.scaleX = s;
    this.scaleY = s;
    this.alpha = Math.pow(1 - t, 1.5) * 0.8;
    this.tint =
      FIRE_TINTS[
        Math.min(FIRE_TINTS.length - 1, Math.floor(t * FIRE_TINTS.length))
      ];
    this.rotation += (Math.random() - 0.5) * 0.08;

    return false;
  }
}
