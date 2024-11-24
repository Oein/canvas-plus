// Source from: https://github.com/vrd/js-intersect

export type Point = {
  x: number;
  y: number;
};
export type Polygon = Point[];
export type PointWithT = Point & { t: number };
export type Edge = Point[];

export function intersect(fig1: Polygon, fig2: Polygon) {
  return getPolygonIntersection(fig1, fig2);
}

// @ts-ignore
import ClipperLib from "clipper-lib";

function getPolygonIntersection(
  polygon1: Point[],
  polygon2: Point[]
): Point[][] {
  const scale = 1000000; // 소수점을 처리하기 위해 스케일링

  // 다각형 좌표를 스케일링하고 ClipperLib 형식에 맞게 변환
  const subj = polygon1.map((point) => ({
    X: point.x * scale,
    Y: point.y * scale,
  }));
  const clip = polygon2.map((point) => ({
    X: point.x * scale,
    Y: point.y * scale,
  }));

  const clipper = new ClipperLib.Clipper();
  const solution: { X: number; Y: number }[][] = [];

  // 다각형 추가
  clipper.AddPath(subj, ClipperLib.PolyType.ptSubject, true);
  clipper.AddPath(clip, ClipperLib.PolyType.ptClip, true);

  // 교집합 계산
  const succeeded = clipper.Execute(
    ClipperLib.ClipType.ctIntersection,
    solution,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );

  if (!succeeded) {
    throw new Error("다각형 교집합 계산에 실패했습니다.");
  }

  // 결과를 원래 스케일로 복원하고, x와 y로 변환
  const result = solution.map((path) =>
    path.map((point) => ({
      x: point.X / scale,
      y: point.Y / scale,
    }))
  );

  return result;
}

export function polygonArea(p: Polygon) {
  var len = p.length;
  var s = 0;
  for (var i = 0; i < len; i++) {
    s += p[i % len].x * p[(i + 1) % len].y - p[i % len].y * p[(i + 1) % len].x;
  }
  return Math.abs(s / 2);
}
