import { Application, EventEmitter, Ticker } from "pixi.js";
import { App } from "../";
import { Scene } from "./Scene";

export class SceneManager<S extends string> extends EventEmitter<"abc" | "BD"> {
  private readonly scenes: Record<S, Scene>;

  constructor(
    private readonly app: App,
    private readonly sceneConstructors: Record<
      S,
      new (app: Application) => Scene
    >,
  ) {
    super();

    /**
     * Initialize Scenes
     */
    this.scenes = {} as Record<S, Scene>;
    for (const sceneName in this.sceneConstructors)
      this.scenes[sceneName] = new this.sceneConstructors[sceneName](this.app);
  }

  private activeScene?: Scene;

  async preload() {
    /**
     * Preload all assets for all scenes
     */
    await Promise.all(
      Object.values<Scene>(this.scenes).map((scene) => scene.onLoad?.()),
    );
  }

  stop() {
    if (!this.activeScene) return;

    /**
     * Run
     */
    this.activeScene.onStop?.();
    this.app.stage.removeChild(this.activeScene);
    this.activeScene = undefined;
  }

  start(sceneName: S) {
    this.stop();

    /**
     * Either Retrieve from initialized scenes or Create new one + save
     */
    const scene = (this.scenes[sceneName] ||= new this.sceneConstructors[
      sceneName
    ](this.app));

    this.app.stage.addChild(scene);

    /**
     * Created if needed
     */
    if (!scene.created) {
      scene.onCreate?.();
      scene.created = true;
    }

    /**
     * Run OnStart Handler
     */
    scene.onStart?.();

    /** Save as active scene */
    this.activeScene = scene;
  }

  getSceneNames() {
    return Object.keys(this.scenes) as S[];
  }

  tick(ticker: Ticker) {
    this.activeScene?.onTick?.(ticker);
  }

  resize(width: number, height: number) {
    for (const scene of Object.values<Scene>(this.scenes))
      if (scene.created) scene.onResize?.(width, height);
  }
}
