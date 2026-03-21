import { Application, Assets, BitmapText, Ticker } from "pixi.js";
import { SceneManager } from "./Core/SceneManager";
import { AceOfShadows } from "./Scenes/AceOfShadows";
import { MagicWords } from "./Scenes/MagicWords";
import { PhoenixFlame } from "./Scenes/PhoenixFlame";

import manifest from "../manifest.json";
import { SceneSwitcher } from "./UI/SceneSwitcher";

export class App extends Application {
  // Create Scene Manager
  readonly sceneManager = new SceneManager(this, {
    AceOfShadows,
    MagicWords,
    PhoenixFlame,
  });
  fpsText!: BitmapText;

  sceneSwitcher!: SceneSwitcher<
    ReturnType<this["sceneManager"]["getSceneNames"]>[number]
  >;

  constructor(readonly parent: HTMLElement) {
    super();
  }

  async start() {
    /**
     * Initialize
     */
    await this.init({
      resizeTo: this.parent,
      background: 0xe1e6ed,
    });

    // add to DOM
    this.parent.appendChild(this.canvas);

    // Attach Global onTick listener
    this.ticker.add(this.onTick, this);

    // Attach resize listener
    this.renderer.on("resize", this.onResize, this);

    /**
     * Preload Stuff
     */
    await this.preload();

    /**
     * Create FPS indicator
     */
    this.fpsText = new BitmapText({
      text: "FPS: 15",
      y: 5,
      x: 20,
      style: {
        fontFamily: "font",
        fill: "black",
        fontSize: 30,
        align: "left",
      },
    });
    this.stage.addChild(this.fpsText);

    this.sceneSwitcher = new SceneSwitcher(
      this,
      this.sceneManager.getSceneNames(),
      "AceOfShadows",
    );
    this.stage.addChild(this.sceneSwitcher);

    // Start with first scene
    this.sceneManager.start("AceOfShadows");
  }

  private async preload() {
    /**
     * Init with pregenerated manifest
     */
    await Assets.init({ manifest, basePath: "assets/" });

    // Load font
    await Assets.load("font");

    /**
     * Preload Scenes
     */
    await this.sceneManager.preload();
  }

  private onResize(width: number, height: number) {
    this.sceneManager.resize(width, height);
  }

  private onTick(ticker: Ticker) {
    this.sceneManager.tick(ticker);
    if (this.fpsText) this.fpsText.text = `FPS: ${ticker.FPS.toFixed(0)}`;
  }
}
