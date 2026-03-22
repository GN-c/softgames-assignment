import { Assets, Ticker } from "pixi.js";
import { Scene } from "../../Core/Scene";
import { Fire } from "./Fire";

export class PhoenixFlame extends Scene {
  private fire!: Fire;

  async onLoad() {
    await Assets.loadBundle("phoenix-flame");
  }

  onCreate(): void {
    this.fire = new Fire(10);
    this.fire.scale.set(2, 2);
    this.addChild(this.fire);

    this.x = this.app.screen.width / 2;
    this.y = this.app.screen.height / 2;
  }

  onStart(): void {}

  onTick(ticker: Ticker): void {
    this.fire.tick(ticker.deltaMS / 1000);
  }

  onResize(width: number, height: number): void {
    this.x = width / 2;
    this.y = height / 2;
  }
}
