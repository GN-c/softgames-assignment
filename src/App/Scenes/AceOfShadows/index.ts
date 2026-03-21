import { Assets, Sprite, Texture, Ticker } from "pixi.js";
import { Scene } from "../../Core/Scene";

/**
 * Task 1 - Ace Of Shadows Scene
 */
export class AceOfShadows extends Scene {
  async onLoad() {
    await Assets.loadBundle("ace-of-shadows");
  }

  onStart(): void {
    const { width, height } = this.app.screen;

    this.x = width / 2;
    this.y = height / 2;

    for (let i = 0; i < 50; i++) {
      // Create a bunny Sprite
      const card = new Sprite({
        texture: Texture.from((i % 36).toString()),
        x: 0,
        y: 0,
        anchor: { x: 0.5, y: 0.5 },
      });

      // Add the bunny to the stage
      this.addChild(card);
    }
  }

  onResize(width: number, height: number): void {
    this.x = width / 2;
    this.y = height / 2;
  }

  onTick(ticker: Ticker): void {}
}
