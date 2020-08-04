/**
 * Utility functions for ConfettiComponent
 */

/**
 * Lightens or darkens a hex color and returns the updated shade in a hex string of the format '#xxxxxx'
 * @param color hex color string to lighten or darken
 * @param percentage percentage to lighten/darken by
 */
export function shadeHexColor(color: string, percentage: number): string {
  // source: https://gist.github.com/renancouto/4675192
  if (color.startsWith("#")) {
    color = color.substr(1);
  }

  const value = parseInt(color, 16);
  const amount = Math.round(2.55 * percentage);
  const R = (value >> 16) + amount;
  const B = ((value >> 8) & 0x00ff) + amount;
  const G = (value & 0x0000ff) + amount;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    ).toString(16).slice(1)
  );
}

/**
 * Converts value from degrees to radians
 * @param value angle in degrees to convert to radians
 */
export function degToRad(value: number): number {
  return value * (Math.PI / 180);
}

/**
 * Converts value from radians to degrees
 * @param value angle in radians to convert to degrees
 */
export function radToDeg(value: number) {
  return value * (180 / Math.PI);
}

export function randomNumberInRange(rangeStart: number, rangeEnd: number) {
  return Math.random() * (rangeEnd - rangeStart) + rangeStart;
}
