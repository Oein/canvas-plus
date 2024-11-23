interface Point {
  x: number;
  y: number;
}

function getStrokeOutlinePolygon(
  points: Point[],
  strokeWidth: number
): { outer: Point[]; inner: Point[] } {
  const offset = strokeWidth / 2;

  const n = points.length;
  if (n < 3) {
    // 폴리곤을 구성하기에 점이 부족한 경우
    return { outer: [], inner: [] };
  }

  // 외부 오프셋 폴리곤 계산
  const outerPolygon = offsetPolygon(points, offset);

  // 내부 오프셋 폴리곤 계산 (오프셋 값을 음수로)
  const innerPolygon = offsetPolygon(points, -offset);

  return { outer: outerPolygon, inner: innerPolygon };
}

// 폴리곤을 주어진 오프셋으로 이동시키는 함수
function offsetPolygon(points: Point[], offset: number): Point[] {
  const n = points.length;
  const offsetEdges: { p1: Point; p2: Point }[] = [];

  // 각 엣지에 대해 오프셋된 엣지를 계산합니다.
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];

    // 엣지 벡터
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // 엣지의 길이
    const length = Math.hypot(dx, dy);
    if (length === 0) {
      // 길이가 0인 엣지는 무시합니다.
      continue;
    }

    // 외부로 향하는 법선 벡터 계산
    const nx = -dy / length;
    const ny = dx / length;

    // 오프셋 벡터
    const ox = nx * offset;
    const oy = ny * offset;

    // 오프셋된 엣지의 시작점과 끝점
    const offsetP1 = { x: p1.x + ox, y: p1.y + oy };
    const offsetP2 = { x: p2.x + ox, y: p2.y + oy };

    offsetEdges.push({ p1: offsetP1, p2: offsetP2 });
  }

  // 인접한 오프셋 엣지들 사이의 교점을 계산합니다.
  const offsetPoints: Point[] = [];
  for (let i = 0; i < offsetEdges.length; i++) {
    const edge1 = offsetEdges[i];
    const edge2 = offsetEdges[(i + 1) % offsetEdges.length];

    const intersection = getLinesIntersection(
      edge1.p1,
      edge1.p2,
      edge2.p1,
      edge2.p2
    );

    if (intersection) {
      offsetPoints.push(intersection);
    } else {
      // 교점이 없는 경우 (엣지가 평행함), 시작점을 사용합니다.
      offsetPoints.push(edge2.p1);
    }
  }

  return offsetPoints;
}

// 두 직선의 교점을 계산하는 함수
function getLinesIntersection(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): Point | null {
  const a1 = p2.y - p1.y;
  const b1 = p1.x - p2.x;
  const c1 = a1 * p1.x + b1 * p1.y;

  const a2 = p4.y - p3.y;
  const b2 = p3.x - p4.x;
  const c2 = a2 * p3.x + b2 * p3.y;

  const denominator = a1 * b2 - a2 * b1;

  if (Math.abs(denominator) < 1e-10) {
    // 두 직선이 평행하거나 거의 평행한 경우
    return null;
  }

  const x = (b2 * c1 - b1 * c2) / denominator;
  const y = (a1 * c2 - a2 * c1) / denominator;

  return { x, y };
}

function getStrokedLinePoints(
  p1: Point,
  p2: Point,
  strokeWidth: number
): Point[] {
  const halfStroke = strokeWidth / 2;

  // 선분의 방향 벡터 계산
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  // 선분의 길이 계산
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    // 두 점이 같은 경우 처리 불가
    return [];
  }

  // 법선 벡터 (선분에 수직인 단위 벡터)
  const nx = -dy / length;
  const ny = dx / length;

  // 오프셋 벡터 계산
  const offsetX = nx * halfStroke;
  const offsetY = ny * halfStroke;

  // 스트로크가 적용된 네 개의 점 계산
  const p1_outer = { x: p1.x + offsetX, y: p1.y + offsetY };
  const p1_inner = { x: p1.x - offsetX, y: p1.y - offsetY };
  const p2_outer = { x: p2.x + offsetX, y: p2.y + offsetY };
  const p2_inner = { x: p2.x - offsetX, y: p2.y - offsetY };

  // 폴리곤을 구성하는 점들의 배열 반환
  return [p1_outer, p2_outer, p2_inner, p1_inner];
}

// 두 점을 이은 선분에 두께를 적용한 Polygon을 구하는 함수
export default function createThickPolygon(
  points: Point[],
  thickness: number
): Point[] {
  if (points.length < 2) {
    return [];
  }
  if (points.length === 2) {
    return getStrokedLinePoints(points[0], points[1], thickness);
  }
  const outin = getStrokeOutlinePolygon(points, thickness);
  return [
    outin.outer[outin.outer.length - 1],
    ...outin.outer,
    ...outin.inner.reverse(),
    outin.inner[0],
    outin.outer[outin.outer.length - 1],
    // outin.inner[outin.inner.length - 1],
    // outin.outer[0],
  ];
}

// 예시 점들
const points: Point[] = [
  { x: 0, y: 0 },
  { x: 100, y: 50 },
  { x: 200, y: 50 },
  { x: 250, y: 0 },
];

// 두께가 3인 Polygon을 구함
const thickness = 3;
const polygon = createThickPolygon(points, thickness);

// 결과 출력
console.log(polygon);
