type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number; // Rotation angle in degrees
};

export default function rotateRect(
  rect: Rect,
  centerX: number,
  centerY: number,
  deg: number
): Rect {
  const rad = (deg * Math.PI) / 180; // Convert degrees to radians

  // Calculate the current center of the rectangle
  const rectCenterX = rect.x + rect.width / 2;
  const rectCenterY = rect.y + rect.height / 2;

  // Offset from the rotation center
  const offsetX = rectCenterX - centerX;
  const offsetY = rectCenterY - centerY;

  // Rotate the center point of the rectangle around the given center point
  const rotatedX = centerX + offsetX * Math.cos(rad) - offsetY * Math.sin(rad);
  const rotatedY = centerY + offsetX * Math.sin(rad) + offsetY * Math.cos(rad);

  // Keep width and height the same, just update x, y, and rotation
  return {
    x: rotatedX - rect.width / 2, // Update x to match new center
    y: rotatedY - rect.height / 2, // Update y to match new center
    width: rect.width,
    height: rect.height,
    rotate: (rect.rotate + deg) % 360, // Add rotation and normalize within [0, 360)
  };
}
