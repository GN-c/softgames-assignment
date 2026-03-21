import { Ticker } from "pixi.js";
import { gsap } from "gsap";
import { Scene } from "../../Core/Scene";
import { DialogueData, LoadDialogue } from "./loadDialogue";
import { Dialogue } from "./Dialogue";

/**
 * Task 2 - Magic Words Scene
 *
 * A GSAP timeline reveals dialogues one-by-one, sliding each in from its side.
 */
export class MagicWords extends Scene {
  private dialogues?: DialogueData[];
  private timeline?: gsap.core.Timeline;

  async onLoad() {
    this.dialogues = await LoadDialogue();
  }

  onCreate(): void {
    this.x = this.app.screen.width / 2;
    /**
     * Create Timeline for playing out whole dialogue
     */
    this.timeline = gsap.timeline({ paused: true, repeat: -1 });

    /**
     * Create Dialogue and add animations in timeline
     */
    for (let i = 0; i < this.dialogues!.length; i++) {
      const data = this.dialogues![i];
      const dialogue = new Dialogue(data);

      dialogue.x = data.side == "left" ? -500 : 500;
      dialogue.y = 100 + i * 80;
      this.addChild(dialogue);

      // Slide in, then fade in each content item
      this.timeline.add(dialogue.animate(), i * 1.2);
    }
  }

  onStart(): void {
    this.timeline?.resume();
  }

  onStop(): void {
    this.timeline?.pause();
  }

  onTick(_ticker: Ticker): void {}

  onResize(width: number, height: number): void {
    this.x = width / 2;
  }
}
