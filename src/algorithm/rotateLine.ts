interface Point {
  x: number;
  y: number;
}

export default function rotateLine(
  center: Point,
  point1: Point,
  point2: Point,
  deg: number
): [Point, Point] {
  /**
   * 중심점을 기준으로 두 점을 주어진 각도(deg)만큼 회전시켜 새로운 점의 좌표를 반환합니다.
   *
   * @param center - 중심점의 {x, y} 좌표
   * @param point1 - 첫 번째 점의 {x, y} 좌표
   * @param point2 - 두 번째 점의 {x, y} 좌표
   * @param deg - 회전 각도 (단위: 도)
   * @returns 회전된 두 점의 새로운 좌표 [{x: new_x1, y: new_y1}, {x: new_x2, y: new_y2}]
   */

  // 각도를 라디안으로 변환
  const rad = (deg * Math.PI) / 180;

  // 회전 변환 행렬 요소
  const cosTheta = Math.cos(rad);
  const sinTheta = Math.sin(rad);

  // 중심점을 기준으로 점을 회전
  function rotatePoint(center: Point, point: Point): Point {
    const relativeX = point.x - center.x;
    const relativeY = point.y - center.y;

    // 회전 변환
    const rotatedX = relativeX * cosTheta - relativeY * sinTheta;
    const rotatedY = relativeX * sinTheta + relativeY * cosTheta;

    // 중심점 기준으로 다시 이동
    return {
      x: rotatedX + center.x,
      y: rotatedY + center.y,
    };
  }

  // 각 점을 회전
  const newPoint1 = rotatePoint(center, point1);
  const newPoint2 = rotatePoint(center, point2);

  return [newPoint1, newPoint2];
}
