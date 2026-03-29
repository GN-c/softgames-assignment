import * as PIXI from "pixi.js";
import { Application, Assets, Ticker } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { SceneManager } from "./Core/SceneManager";

import { AceOfShadows } from "./Scenes/AceOfShadows";
import { MagicWords } from "./Scenes/MagicWords";
import { PhoenixFlame } from "./Scenes/PhoenixFlame";

import manifest from "../manifest.json";
import { SceneSwitcher } from "./UI/SceneSwitcher";
import { FPSIndicator } from "./UI/FPSIndicator";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class App extends Application {
  // Create Scene Manager
  readonly sceneManager = new SceneManager(this, {
    AceOfShadows,
    MagicWords,
    PhoenixFlame,
  });
  fpsIndicator?: FPSIndicator;

  sceneSwitcher?: SceneSwitcher<
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

    // Toggle fullscreen on click
    this.canvas.addEventListener("dblclick", () => {
      if (!document.fullscreenElement)
        document.documentElement.requestFullscreen();
    });

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
    this.fpsIndicator = new FPSIndicator();
    this.fpsIndicator.zIndex = 10;
    this.stage.addChild(this.fpsIndicator);

    this.sceneSwitcher = new SceneSwitcher(
      this,
      this.sceneManager.getSceneNames(),
      "AceOfShadows",
    ).on("sceneselected", (sceneName) => {
      this.sceneManager.start(sceneName);
      this.sceneSwitcher!.setActiveScene(sceneName);
    });
    this.sceneSwitcher.zIndex = 10;
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
    this.sceneSwitcher?.handleResize();
    this.sceneManager.resize(width, height);
  }

  private onTick(ticker: Ticker) {
    this.sceneManager.tick(ticker);
    this.fpsIndicator?.setFPS(ticker.FPS);
  }
}
