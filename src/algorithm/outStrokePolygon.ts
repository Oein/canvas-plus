// @ts-ignore
import * as ClipperLib from "clipper-lib";
import CONFIG from "../utils/config";

interface Point {
  x: number;
  y: number;
}

function findExteriorPolygonWithStroke(
  points: Point[],
  strokeWidth: number
): Point[] {
  const scale = 1000; // Adjust as needed for precision
  const scaledPoints: ClipperLib.IntPoint[] = points.map((point) => ({
    X: Math.round(point.x * scale),
    Y: Math.round(point.y * scale),
  }));

  const miterLimit = 10 * CONFIG.SCALE;
  const arcTolerance = 0.25 * scale;

  const co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
  co.AddPath(
    scaledPoints,
    ClipperLib.JoinType.jtMiter, // Changed from jtRound to jtMiter
    ClipperLib.EndType.etClosedPolygon
  );

  const offsetPaths: ClipperLib.Paths = [];
  const offset = strokeWidth * scale;

  co.Execute(offsetPaths, offset);

  if (offsetPaths.length === 0) {
    throw new Error("Offsetting failed, no paths returned");
  }

  const result = offsetPaths[0].map((point: { X: number; Y: number }) => ({
    x: point.X / scale,
    y: point.Y / scale,
  }));

  return result;
}

export default function computeStrokeOutline(
  points: Point[],
  strokeWidth: number
): Point[] {
  return findExteriorPolygonWithStroke(points, strokeWidth);
}
