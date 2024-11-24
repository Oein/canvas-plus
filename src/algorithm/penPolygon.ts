type Point = { x: number; y: number };

/**
 * Generate a stroked polygon based on the user's drawn line points and stroke width.
 * @param points - Array of points defining the user's line.
 * @param strokeWidth - Width of the stroke.
 * @returns - Array of points representing the stroked polygon.
 */
export function generateStrokedPolygon(
  points: Point[],
  strokeWidth: number
): Point[] {
  if (points.length < 2) {
    throw new Error(
      "At least two points are required to create a stroked polygon."
    );
  }

  const halfStroke = strokeWidth / 2;
  const leftSide: Point[] = [];
  const rightSide: Point[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    // Calculate the direction vector of the line segment
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Normalize the direction vector
    const length = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / length;
    const ny = dx / length;

    // Offset points for the stroke
    leftSide.push({ x: p1.x + nx * halfStroke, y: p1.y + ny * halfStroke });
    rightSide.push({ x: p1.x - nx * halfStroke, y: p1.y - ny * halfStroke });

    // Add the final point for the last segment
    if (i === points.length - 2) {
      leftSide.push({ x: p2.x + nx * halfStroke, y: p2.y + ny * halfStroke });
      rightSide.push({ x: p2.x - nx * halfStroke, y: p2.y - ny * halfStroke });
    }
  }

  // Combine the left and right sides to form a closed polygon
  return [...leftSide, ...rightSide.reverse()];
}
