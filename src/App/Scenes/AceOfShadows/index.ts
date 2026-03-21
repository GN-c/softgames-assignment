import { Assets, Sprite, Texture, Ticker } from "pixi.js";
import { Scene } from "../../Core/Scene";
import { gsap } from "gsap";

const CARD_OFFSET_X = 0.3;
const CARD_OFFSET_Y = 5;

interface Stack {
  cards: Sprite[];
  x: number;
  y: number;
}

/**
 * Task 1 - Ace Of Shadows Scene
 */
export class AceOfShadows extends Scene {
  private timeline?: gsap.core.Timeline;
  private stacks!: Stack[];

  readonly TOTAL_CARDS = 144;
  readonly NUMBER_OF_STACKS = 4;

  async onLoad() {
    await Assets.loadBundle("ace-of-shadows");
  }

  onCreate(): void {
    const { width, height } = this.app.screen;
    this.x = width / 2;
    this.y = height / 2;

    this.stacks = Array.from({ length: this.NUMBER_OF_STACKS }, (_, i) =>
      this.addStack(
        (i - (this.NUMBER_OF_STACKS - 1) / 2) * 160,
        200,
        this.TOTAL_CARDS / this.NUMBER_OF_STACKS,
      ),
    );
  }

  onStart(): void {
    if (!this.timeline) {
      this.timeline = gsap.timeline();
      this.timeline.add(
        gsap
          .timeline({ repeat: -1, repeatDelay: 1 })
          .call(() => this.moveCard()),
      );
    } else {
      this.timeline.resume();
    }
  }

  onStop(): void {
    this.timeline?.pause();
  }

  private srcStackIndex = 0;

  private moveCard(): void {
    let srcStack = this.stacks[this.srcStackIndex];
    if (srcStack.cards.length === 0) {
      this.srcStackIndex = (this.srcStackIndex + 1) % this.stacks.length;
      srcStack = this.stacks[this.srcStackIndex];
    }
    const destStack =
      this.stacks[(this.srcStackIndex + 1) % this.stacks.length];

    /**
     * Move card from srcStack to destStack
     */
    const card = srcStack.cards.pop()!;
    const destIndex = destStack.cards.length;
    const destX = destStack.x;
    const destY = destStack.y - destIndex * CARD_OFFSET_Y;

    // Bring card to top of render order during flight
    this.addChild(card);
    destStack.cards.push(card);

    // Add flight tween to masterTL at current time so it respects pause/resume
    const topY = Math.min(card.y, destY) - 60;
    this.timeline!.add(
      gsap.to(card, {
        duration: 2,
        ease: "power2.inOut",
        keyframes: {
          "20%": {
            x: card.x,
            y: topY,
            pixi: { scale: 1.2 },
          },
          "60%": {
            x: destX,
            y: topY,
            pixi: { scale: 1.2 },
          },
          "100%": { x: destX, y: destY, pixi: { scale: 1 } },
        },
      }),
      this.timeline!.time(),
    );
  }

  /**
   * Create new stack of cards
   */
  private addStack(x: number, y: number, quantity: number): Stack {
    const stack: Stack = { cards: [], x, y };
    for (let i = 0; i < quantity; i++) {
      const card = new Sprite({
        texture: Texture.from(gsap.utils.random(0, 35, 1).toString()),
        x,
        y: y - i * CARD_OFFSET_Y,
        anchor: { x: 0.5, y: 0.5 },
      });
      stack.cards.push(card);
      this.addChild(card);
    }
    return stack;
  }

  onResize(width: number, height: number): void {
    this.x = width / 2;
    this.y = height / 2;
  }

  onTick(ticker: Ticker): void {}
}
