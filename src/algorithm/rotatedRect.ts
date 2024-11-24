type Point = { x: number; y: number };

export default function calculateRectangleCorners(
  x: number,
  y: number,
  width: number,
  height: number,
  rotate: number
): Point[] {
  // Convert rotation angle to radians
  const rad = (rotate * Math.PI) / 180;

  // Half dimensions
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  // Define the corners relative to the center before rotation
  const corners = [
    { x: -halfWidth, y: -halfHeight }, // Top-left
    { x: halfWidth, y: -halfHeight }, // Top-right
    { x: halfWidth, y: halfHeight }, // Bottom-right
    { x: -halfWidth, y: halfHeight }, // Bottom-left
  ];

  // Rotate and translate each corner
  const rotatedCorners = corners.map((corner) => {
    const rotatedX = corner.x * Math.cos(rad) - corner.y * Math.sin(rad);
    const rotatedY = corner.x * Math.sin(rad) + corner.y * Math.cos(rad);
    return {
      x: rotatedX + x,
      y: rotatedY + y,
    };
  });

  return rotatedCorners;
}
