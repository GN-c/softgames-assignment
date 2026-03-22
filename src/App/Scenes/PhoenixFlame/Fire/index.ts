import { ParticleContainer, Rectangle } from "pixi.js";
import { gsap } from "gsap";
import { FireParticle, FireParticleConfig } from "./Particle";
import { BloomFilter } from "pixi-filters";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export class Fire extends ParticleContainer {
  private particles: FireParticle[] = [];

  private readonly particleConfig: FireParticleConfig = {
    velocity: [70, 85],
    spread: [-100, -80],
    maxLife: [1, 1.2],
    angularMomentum: (Math.random() - 0.5) * 2,
    scaleEasing: "power1.out",
    alphaEasing: CustomEase.create(
      "custom",
      "M0,0 C0.104,0.204 0.438,1.297 1,0.161 ",
    ),
    colorGradient: ["#ffdd00", "#ff1a00"],
  };

  constructor(private readonly MAX_PARTICLES: number) {
    super({
      dynamicProperties: {
        position: true,
        rotation: true,
        color: true,
        vertex: true,
      },
    });

    /**
     * Create Particles
     */
    for (let i = 0; i < this.MAX_PARTICLES; i++) {
      const p = new FireParticle(this.particleConfig);
      // spawn at diferennt starting point in time to make unpredicted
      p.spawn((i / this.MAX_PARTICLES) * 1.2);
      this.addParticle(p);
      this.particles.push(p);
    }

    this.localBlendMode = "screen";

    /** Make Sure to include all particle area for filter */
    this.filterArea = new Rectangle(-200, -200, 400, 400);

    this.filters = [
      /**
       * Add Bloom filter for glow
       */
      new BloomFilter({
        strength: 15,
        resolution: 2,
      }),
    ];
  }

  tick(dt: number): void {
    /**
     * Update particles
     * respawn if needed
     */
    for (const p of this.particles) {
      p.update(dt);
    }
  }
}
