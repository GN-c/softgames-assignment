import { Assets, Text, Ticker } from "pixi.js";
import { Scene } from "../../Utils/Scene";

interface Data {
  dialogue: { name: string; text: string }[];
  emojies: { name: string; url: string }[];
  avatars: { name: string; url: string; position: "left" | "right" }[];
}

/**
 * Task 2 - Magic Words Scene
 */
export class MagicWords extends Scene {
  async onLoad() {
    const data = await Assets.loadBundle("MagicWords");

    console.log({ data });
  }

  onStart(): void {
    const text = new Text("MagicWords");

    // Add the bunny to the stage
    this.addChild(text);
  }

  onTick(ticker: Ticker): void {}
}
