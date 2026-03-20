import { Application, Assets, Texture, Ticker } from "pixi.js";
import { SceneManager } from "./Utils/SceneManager";
import { AceOfShadows } from "./Scenes/AceOfShadows";
import { MagicWords } from "./Scenes/MagicWords";
import { PhoenixFlame } from "./Scenes/PhoenixFlame";

import manifest from "../manifest.json";

export class App extends Application {
  // Create Scene Manager
  private readonly sceneManager = new SceneManager(this, {
    AceOfShadows,
    MagicWords,
    PhoenixFlame,
  });

  constructor(readonly parent: HTMLElement) {
    super();
  }

  async start() {
    /**
     * Initialize
     */
    await this.init({
      resizeTo: this.parent,
      background: "aqua",
    });

    // add to DOM
    this.parent.appendChild(this.canvas);

    // Attach Global onTick listener
    this.ticker.add(this.onTick, this);

    /**
     * Preload Stuff
     */
    await this.preload();

    // Start with first scene
    this.sceneManager.start("AceOfShadows");
  }

  private async preload() {
    /**
     * Init with pregenerated manifest
     */
    await Assets.init({ manifest, basePath: "assets/" });

    /**
     * Preload Scenes
     */
    await this.sceneManager.preload();
  }

  private onTick(ticker: Ticker) {
    this.sceneManager.tick(ticker);
  }
}
