import { Application, BitmapText, Container, Graphics } from "pixi.js";
import { setBitmapTextPivot } from "../Utils/BitmapTextUtils";

export class SceneSwitcher<S extends string> extends Container {
  private static readonly BUTTON_SIZE = 100;

  texts!: BitmapText[];
  constructor(
    private readonly app: Application,
    sceneNames: S[],
    activeScene: S,
  ) {
    super();

    const box = new Graphics()
      .roundRect(0, 0, SceneSwitcher.BUTTON_SIZE, SceneSwitcher.BUTTON_SIZE, 8)
      .fill(0xed427c);
    // .stroke({ color: "white", width: 4 });

    this.addChild(box);

    // this.texts = sceneNames.map(
    //   (_, i) =>
    //     new BitmapText({
    //       text: i + 1,
    //       x: (i + 0.5) * -SceneSwitcher.BUTTON_SIZE,
    //       y: SceneSwitcher.BUTTON_SIZE / 2,
    //       origin: { x: 0.5, y: 0.5 },
    //       style: {
    //         fontFamily: "font",
    //         fill: "black",
    //         fontSize: 30,
    //         align: "left",
    //       },
    //     }),
    // );
    // this.addChild(...this.texts);

    const label = new BitmapText({
      text: "5",
      style: {
        fontFamily: "font",
        fill: "white",
        fontSize: 60,
        align: "left",
      },
    });

    setBitmapTextPivot(label, 0.5, 0.5);
    label.x = SceneSwitcher.BUTTON_SIZE / 2;
    label.y = SceneSwitcher.BUTTON_SIZE / 2;

    this.addChild(label);

    this.x = 100;
    this.y = 100;

    // for (let i = this.texts.length - 1; i >= 0; i--) {
    //   const edge = this.texts[i + 1]?.bounds?.left ?? 0;

    //   console.log(edge);

    //   const text = this.texts[i];
    //   text.x = edge - text.width - 10;
    // }
  }
}
