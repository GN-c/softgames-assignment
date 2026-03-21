import { BitmapText } from "pixi.js";
import { gsap } from "gsap";
import { setBitmapTextPivot } from "../Utils/BitmapTextUtils";

export class FPSIndicator extends BitmapText {
  constructor() {
    super({
      text: "FPS: 15",
      y: 15,
      x: 20,
      style: {
        fontFamily: "font",
        fill: "#d84be5",
        fontSize: 30,
        align: "left",
      },
    });
    setBitmapTextPivot(this, 0, 0);

    gsap.from(this, {
      pixi: { x: -10, alpha: 0 },
      duration: 0.5,
      ease: "back.out(1.5)",
    });
  }

  setFPS(fps: number) {
    this.text = `FPS: ${fps.toFixed(0)}`;
  }
}
