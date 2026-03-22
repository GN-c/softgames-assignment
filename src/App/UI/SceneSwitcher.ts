import { Application, BitmapText, Container, Graphics } from "pixi.js";
import { gsap } from "gsap";
import { setBitmapTextPivot } from "../Utils/BitmapTextUtils";
import { camelCaseToSpaces } from "../Utils/text";

export interface SceneSwitcherConfig {
  buttonSize?: number;
  spacing?: number;
  edgeOffset?: number;
  fontSize?: number;
  labelFontSize?: number;
}

export class SceneSwitcher<S extends string> extends Container {
  private sceneIDs: BitmapText[] = [];
  private activeSceneLabel: BitmapText;
  config: Required<SceneSwitcherConfig>;
  box: Graphics;

  constructor(
    private readonly app: Application,
    private sceneNames: S[],
    private activeScene: S,
    config: SceneSwitcherConfig = {},
  ) {
    super();

    /** Save config with default values */
    this.config = {
      buttonSize: 45,
      spacing: 10,
      edgeOffset: 10,
      fontSize: 30,
      labelFontSize: 20,
      ...config,
    };

    const { buttonSize, spacing, edgeOffset, fontSize, labelFontSize } =
      this.config;

    /**
     * Rounded Rectangle for highlighting active sceneID
     */
    this.box = new Graphics()
      .roundRect(-buttonSize / 2, -buttonSize / 2, buttonSize, buttonSize, 8)
      .fill(0xd84be5)
      .stroke({ color: "white", width: 4 });
    this.addChild(this.box);

    /**
     * Create scene ID labels
     */
    for (let i = 0; i < sceneNames.length; i++) {
      const sceneID = new BitmapText({
        text: i + 1,
        // align in horizontal line in buttonSize cells starting from right edge
        x: -i * (buttonSize + spacing) - buttonSize / 2,
        y: buttonSize / 2,
        style: {
          fontFamily: "font",
          fontSize,
        },
      });
      /** Update pivot so it's centered */
      setBitmapTextPivot(sceneID, 0.5, 0.5);

      /**
       * Enable interactivity
       */
      sceneID.eventMode = "static";
      sceneID.cursor = "pointer";

      /**
       * Animate as active scene temporarily on hover
       */
      sceneID.on("pointerover", () => this.animateActiveScene(sceneNames[i]));
      sceneID.on("pointerout", () => this.animateActiveScene(this.activeScene));
      /**
       * Emit sceneselected event on click
       */
      sceneID.on("pointerdown", () =>
        this.emit("sceneselected", sceneNames[i]),
      );

      this.addChild(sceneID);
      this.sceneIDs.push(sceneID);
    }

    /**
     * Label indicating active scene
     */
    this.activeSceneLabel = new BitmapText({
      text: camelCaseToSpaces(activeScene),
      y: buttonSize + spacing,
      style: {
        fontFamily: "font",
        fontSize: labelFontSize,
        fill: 0xd84be5,
      },
    });
    setBitmapTextPivot(this.activeSceneLabel, 1, 0);
    this.addChild(this.activeSceneLabel);

    // set inital box position to first sceneID pos
    this.box.x = this.sceneIDs[0].x;
    this.box.y = this.sceneIDs[0].y;

    /**
     * Initial entry animation
     */
    gsap.from(this.sceneIDs, {
      pixi: { scale: 0, alpha: 0 },
      duration: 0.4,
      ease: "back.out(1.5)",
      stagger: 0.08,
    });
    gsap.from(this.box, {
      pixi: { scale: 0, rotation: -20 },
      duration: 0.4,
      ease: "back.out(1.5)",
    });
    gsap.from(this.activeSceneLabel, {
      pixi: { alpha: 0 },
      y: `+=15`,
      duration: 0.4,
      ease: "back.out(1.5)",
      delay: 0.1,
    });

    /**
     * Align at top right edge
     */
    this.x = this.app.screen.width - edgeOffset;
    this.y = edgeOffset;
  }

  private animateActiveScene(sceneName: S) {
    /**
     * Fade down -> change text -> fade up
     */
    const text = camelCaseToSpaces(sceneName);
    if (text !== this.activeSceneLabel.text) {
      gsap.killTweensOf(this.activeSceneLabel);
      const labelY = this.config.buttonSize + this.config.spacing;
      gsap
        .timeline()
        .to(this.activeSceneLabel, {
          pixi: { alpha: 0 },
          y: labelY + 10,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            this.activeSceneLabel.text = text;
            setBitmapTextPivot(this.activeSceneLabel, 1, 0);
          },
        })
        .to(this.activeSceneLabel, {
          pixi: { alpha: 1 },
          y: labelY,
          duration: 0.2,
          ease: "power2.out",
        });
    }

    /**
     * Animate Box smoothly to target position with some stretch&squish&rotate animation
     */
    gsap.killTweensOf(this.box);
    const { x, y } = this.sceneIDs[this.sceneNames.indexOf(sceneName)];
    gsap.to(this.box, {
      x,
      y,
      duration: 0.6,
      // some stretch & squish effect + rotate jump as visual cherry on top
      keyframes: {
        "0%": { pixi: { scaleX: 1, rotation: 0 } },
        "50%": {
          pixi: { scaleX: 1.5, rotation: Math.sign(this.box.x - x) * 20 },
        },
        "100%": { pixi: { scaleX: 1, rotation: 0 } },
      },
      ease: "elastic.out(1, 0.6)",
    });
  }

  setActiveScene(sceneName: S) {
    this.activeScene = sceneName;
    this.animateActiveScene(sceneName);
  }

  handleResize() {
    /** Animate smoothly so it's aligned at top right edge always */
    gsap.to(this, {
      x: this.app.screen.width - this.config.edgeOffset,
      duration: 0.2,
      delay: 0.1,
    });
  }
}
