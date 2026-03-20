import { Text, Ticker } from "pixi.js";
import { Scene } from "../Utils/Scene";

/**
 * Task 3 - Phoenix Flame Scene
 */
export class PhoenixFlame extends Scene {
  onStart(): void {
    const text = new Text("PhoenixFlame");

    // Add the bunny to the stage
    this.addChild(text);
  }

  onTick(ticker: Ticker): void {}
}
