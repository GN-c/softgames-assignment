import { gsap } from "gsap";
import { Color, Particle, Point, Texture } from "pixi.js";
import { InterpolateFunction, RNDFunction } from "../../../Utils/types";

export interface FireParticleConfig {
  /** Speed in px/s */
  velocity: [number, number];
  /** Emission angle range in degrees [min, max] */
  spread: [number, number];
  /** Lifetime range in seconds [min, max] */
  maxLife: [number, number];
  /** Rotation speed in rad/s */
  angularMomentum: number;
  /** */
  scaleEasing: gsap.EaseString | gsap.EaseFunction;
  alphaEasing: gsap.EaseString | gsap.EaseFunction;
  /** */
  colorGradient: string[];
}

export class FireParticle extends Particle {
  readonly velocity = new Point();
  life = 0;
  maxLife = 1;

  private scaleEasing!: gsap.EaseFunction;
  private alphaEasing!: gsap.EaseFunction;
  private colorGradient!: InterpolateFunction<string>;

  private velocityRND!: RNDFunction<number>;
  private spreadRND!: RNDFunction<number>;
  private maxLifeRND!: RNDFunction<number>;

  constructor(private readonly config: FireParticleConfig) {
    super({ texture: Texture.from(`fire-1`), anchorX: 0.5, anchorY: 0.5 });

    /**
     * Create easing/interpolators
     */
    this.scaleEasing = gsap.parseEase(this.config.scaleEasing);
    this.alphaEasing = gsap.parseEase(this.config.alphaEasing);
    this.colorGradient = gsap.utils.interpolate(this.config.colorGradient);

    /**
     * Create random value generator functions
     */
    this.velocityRND = gsap.utils.random(config.velocity, true);
    this.spreadRND = gsap.utils.random(config.spread, true);
    this.maxLifeRND = gsap.utils.random(config.maxLife, true);
  }

  /**
   * Spawn/Respawn particle with fresh properties
   */
  spawn(initialLife = 0): void {
    this.maxLife = this.maxLifeRND();
    this.life = initialLife;

    /**
     * Set velocity based on random angle and speed
     */
    const a = (this.spreadRND() * Math.PI) / 180;
    const speed = this.velocityRND();
    this.velocity.set(Math.cos(a) * speed, Math.sin(a) * speed);

    // reset pos
    this.x = 0;
    this.y = 0;

    this.update(0);
  }

  update(dt: number) {
    this.life += dt;

    // Particle's life progress
    const t = this.life / this.maxLife;

    /**
     * if life is elapsed and Respawn
     */
    if (this.life >= this.maxLife) {
      this.spawn();
      return;
    }

    /** Update pos based on velocity */
    this.x += this.velocity.x * dt;
    this.y += this.velocity.y * dt;

    /**
     * Update props based on particle's life
     */
    this.scaleX = this.scaleY = this.scaleEasing(t) * 0.5; // t;
    this.alpha = this.alphaEasing(t);
    this.tint = this.colorGradient(t);
    this.rotation += this.config.angularMomentum * dt;
  }
}
