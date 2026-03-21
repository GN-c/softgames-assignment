import { BitmapFontManager, BitmapText } from "pixi.js";

/**
 * Sets the pivot of a BitmapText based on its layout, accounting for the
 * vertical offset (offsetY) inherent in bitmap font rendering.
 */
export function setBitmapTextPivot(
  text: BitmapText,
  originX: number,
  originY: number,
): void {
  const { width, height, scale, offsetY } = BitmapFontManager.getLayout(
    text.text,
    text.style,
  );
  text.pivot.set(
    width * scale * originX,
    offsetY * scale + height * scale * originY,
  );
}
