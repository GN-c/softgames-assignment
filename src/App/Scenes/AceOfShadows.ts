import { Assets, Sprite, Texture, Ticker } from "pixi.js";
import { Scene } from "../Utils/Scene";

/**
 * Task 1 - Ace Of Shadows Scene
 */
export class AceOfShadows extends Scene {
  bunny!: Sprite;

  async onLoad() {
    const data = await Assets.loadBundle("AceOfShadows");

    console.log({ data });
  }

  onStart(): void {
    // Create a bunny Sprite
    this.bunny = new Sprite(Assets.get("bunny"));

    // Center the sprite's anchor point
    this.bunny.anchor.set(0.5);
    this.bunny.scale.set(2);

    // Move the sprite to the center of the screen
    this.bunny.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2,
    );

    // Add the bunny to the stage
    this.addChild(this.bunny);
  }

  onTick(ticker: Ticker): void {
    this.bunny.rotation += 0.1 * ticker.deltaTime;
  }
}
