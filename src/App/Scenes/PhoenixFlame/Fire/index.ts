import {
  BlurFilter,
  Graphics,
  ParticleContainer,
  Rectangle,
  Renderer,
  Texture,
} from "pixi.js";
import { FireParticle } from "./Particle";

const MAX_PARTICLES = 10;

export class Fire extends ParticleContainer {
  private particles: FireParticle[] = [];

  constructor(renderer: Renderer) {
    super({
      dynamicProperties: {
        position: true,
        scale: true,
        rotation: true,
        color: true,
      },
    });

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = new FireParticle({
        texture: Texture.from("phoenix-flame/blob"),
        anchorX: 0.5,
        anchorY: 0.5,
      });
      p.spawn((i / MAX_PARTICLES) * 1.2);
      this.addParticle(p);
      this.particles.push(p);
    }

    this.filterArea = new Rectangle(-100, -100, 200, 200);

    const blur = new BlurFilter({ strength: 6 });
    this.filters = [blur];
  }

  tick(dt: number): void {
    for (const p of this.particles) {
      if (p.update(dt)) p.spawn();
    }
  }
}
