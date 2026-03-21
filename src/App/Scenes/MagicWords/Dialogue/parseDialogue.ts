// A single segment of dialogue — either an individual word or an emoji token.
export interface DialoguePart {
  type: "word" | "emoji";
  value: string;
}

/**
 * Splits a dialogue string into an ordered list of word and emoji parts.
 *
 * Emoji tokens are encoded as `{emojiName}` inside the string.
 * Text outside of `{}` is split on spaces, yielding one `word` part per word.
 *
 * @example
 * parseDialogueText("Hello {smile} world")
 * // → [{ type: "word", value: "Hello" }, { type: "emoji", value: "smile" }, { type: "word", value: "world" }]
 */
export function parseDialogueText(text: string) {
  const parts: DialoguePart[] = [];

  const l = text.length;
  for (let i = 0; i < l; ) {
    if (text[i] === "{") {
      // Find the closing brace for this emoji token.
      const closeIndex = text.indexOf("}", i + 1);

      if (closeIndex === -1) throw new Error("no close tag found");

      // Extract the emoji name between the braces.
      parts.push({
        type: "emoji",
        value: text.slice(i + 1, closeIndex),
      });
      text.trim;
      i = closeIndex + 1;
    } else {
      // Find next tag start `{`
      let tagStartIndex = text.indexOf("{", i + 1);
      // or select to the end of string
      if (tagStartIndex === -1) tagStartIndex = l;

      // Split the text into words
      for (const word of text.slice(i, tagStartIndex).split(" "))
        parts.push({
          type: "word",
          value: word,
        });

      i = tagStartIndex;
    }
  }

  return parts;
}
