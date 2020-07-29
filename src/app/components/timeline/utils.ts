/**
 * Utility functions for timeline and timeline marker computations
 */

/**
 * Converts time from milliseconds to days
 * @param time time in milliseconds
 */
export function msToDays(time: number): number {
  return Math.floor(time / (1000 * 60 * 60 * 24));
}

/**
 * Returns true if (posX, posY) is in collision with object at (objX, objY)
 * @param posX collision x position
 * @param posY collision y position
 * @param objX x position of object to detect collision against
 * @param objY y position of object to detect collision against
 * @param thresholdX collision x bounds/threshold
 * @param thresholdY collision y bounds/threshold
 */
export function collision(posX: number, posY: number, objX: number, objY, thresholdX: number, thresholdY): boolean {
  let inCollision = false;
  const xBounds = {
    min: objX - thresholdX,
    max: objX + thresholdX
  };
  const yBounds = {
    min: objY - thresholdY,
    max: objY + thresholdY
  };
  if (
    posX >= xBounds.min &&
    posX <= xBounds.max &&
    posY >= yBounds.min &&
    posY <= yBounds.max
  ) {
    inCollision = true;
  }
  return inCollision;
}