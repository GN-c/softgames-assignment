import { Assets } from "pixi.js";

interface Data {
  dialogue: {
    name: string;
    text: string;
  }[];
  emojies: {
    name: string;
    url: string;
  }[];
  avatars: {
    name: string;
    url: string;
    position: "left" | "right";
  }[];
}

export interface DialogueData {
  name: string;
  text: string;
  side: "left" | "right";
}

export async function LoadDialogue(): Promise<DialogueData[]> {
  /**
   * Load JSON Data
   */
  const { emojies, avatars, dialogue } = await Assets.load<Data>({
    src: "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords",
    parser: "json",
  });

  await Promise.all([
    /**
     * Load Emojis
     */
    Promise.all(
      emojies.map((emoji) =>
        Assets.load({
          src: emoji.url,
          alias: `Emoji/${emoji.name}`,
          parser: "texture",
        }).catch(console.warn),
      ),
    ),
    /**
     * Load Avatars
     */
    Promise.all(
      avatars.map((avatar) =>
        Assets.load({
          src: avatar.url,
          alias: `Avatar/${avatar.name}`,
          parser: "texture",
        }).catch(console.warn),
      ),
    ),
  ]);

  return dialogue.map((dialogue) => ({
    ...dialogue,
    side:
      avatars.find((avatar) => avatar.name === dialogue.name)?.position ||
      "left",
  }));
}
