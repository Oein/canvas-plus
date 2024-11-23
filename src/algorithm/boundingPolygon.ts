interface Point {
  x: number;
  y: number;
}

export default function computeBoundingRectangle(polygons: Point[][]): Point[] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const polygon of polygons) {
    for (const point of polygon) {
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
    }
  }

  // 사각형의 네 개 꼭짓점 (시계 방향 또는 반시계 방향)
  return [
    { x: minX, y: minY }, // 좌하단
    { x: minX, y: maxY }, // 좌상단
    { x: maxX, y: maxY }, // 우상단
    { x: maxX, y: minY }, // 우하단
  ];
}
