import { Application, Container, Ticker } from "pixi.js";

export interface Scene extends Container {
  /**
   * Called once before the scene becomes active. Use this to load assets...
   */
  onLoad?(): Promise<void>;

  /**
   * Called when the scene becomes the active scene. Use this to set up scene
   */
  onStart?(): void;

  /**
   * Called every frame while the scene is active
   */
  onTick?(ticker: Ticker): void;

  /**
   * Called when the application is resized
   */
  onResize?(width: number, height: number): void;

  /**
   * Called when the scene is deactivated or replaced by another scene
   */
  onStop?(): void;
}

/**
 * Base class for all scenes. Extend this and implement the lifecycle
 * methods (`onLoad`, `onStart`, `onTick`, `onStop`) as needed.
 */
export abstract class Scene extends Container {
  constructor(protected readonly app: Application) {
    super({});
  }
}
