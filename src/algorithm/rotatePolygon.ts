type Point = { x: number; y: number };
type Polygon = Point[];

/**
 * Rotates a polygon around a given center point by a specified angle.
 * @param polygon - An array of points representing the polygon.
 * @param center - The point around which to rotate the polygon.
 * @param angleDeg - The rotation angle in degrees.
 * @returns A new polygon with rotated points.
 */
export default function rotatePolygon(
  polygon: Polygon,
  center: Point,
  angleDeg: number
): Polygon {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cosTheta = Math.cos(angleRad);
  const sinTheta = Math.sin(angleRad);

  return polygon.map((point) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;

    const x = cosTheta * dx - sinTheta * dy + center.x;
    const y = sinTheta * dx + cosTheta * dy + center.y;

    return { x, y };
  });
}
