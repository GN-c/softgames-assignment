import { gsap } from "gsap";
import { BitmapText, Container, Sprite, Texture } from "pixi.js";
import { DialogueData } from "../loadDialogue";
import { parseDialogueText } from "./parseDialogue";
import { setBitmapTextPivot } from "../../../Utils/BitmapTextUtils";

export interface DialogueConfig {
  size?: number;
  spacing?: number;
  emojiScale?: number;
  avatarScale?: number;
}

export class Dialogue extends Container {
  private content: (BitmapText | Sprite)[] = [];
  config: Required<DialogueConfig>;

  constructor({ text, name, side }: DialogueData, config: DialogueConfig = {}) {
    super();

    /** Save config with default values */
    this.config = {
      size: 20,
      spacing: 5,
      emojiScale: 0.4,
      avatarScale: 0.5,
      ...config,
    };

    const { size, spacing, emojiScale } = this.config;

    /**
     * Populate Dialogue content with parts parsed from text emojis/texts
     */
    for (const { type, value } of parseDialogueText(text))
      if (type === "word") {
        const text = new BitmapText({
          text: value,
          y: 0,
          style: {
            fontFamily: "font",
            fill: "black",
            fontSize: size,
          },
        });
        setBitmapTextPivot(text, 0, 0.5);

        this.content.push(text);
        this.addChild(text);
      } else if (type === "emoji") {
        const emoji = new Sprite({
          texture: Texture.from(`Emoji/${value}`),
          y: 0,
          scale: emojiScale,
          anchor: { x: 0, y: 0.5 },
        });

        this.content.push(emoji);
        this.addChild(emoji);
      }

    /**
     * Create Avatar Sprite
     */
    const avatar = new Sprite({
      texture: Texture.from(`Avatar/${name}`),
      y: -10,
      scale: this.config.avatarScale,
      anchor: { x: 0, y: 0.5 },
    });
    this.addChild(avatar);

    /**
     * Add to content array based on dialogue side
     */
    if (side == "left") this.content.unshift(avatar);
    else this.content.push(avatar);

    /**
     * Arrange from Left to right in case of "left" side
     * or inverse in case of "right"
     */
    if (side == "left") {
      let x = 0;
      for (let i = 0; i < this.content.length; i++) {
        const item = this.content[i];
        item.x = x;
        x += spacing + item.width;
      }
    } else {
      let x = 0;
      for (let i = this.content.length - 1; i >= 0; i--) {
        const item = this.content[i];
        x -= item.width;
        item.x = x;
        x -= spacing;
      }
    }
  }

  animate() {
    return gsap.from(this.content, {
      pixi: {
        alpha: 0,
        scale: 0,
        rotation: -20,
      },
      duration: 0.3,
      ease: "back.out(1.7)",
      stagger: 0.04,
    });
  }
}
