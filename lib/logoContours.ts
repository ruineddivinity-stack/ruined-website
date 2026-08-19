export type Point = [number, number];

export type LogoShape = {
  outer: Point[];
  holes: Point[][];
};

function isFg(mask: Uint8Array, w: number, h: number, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= w || y >= h) return false;
  return mask[y * w + x] === 1;
}

type Edge = [Point, Point];

function traceEdges(mask: Uint8Array, w: number, h: number): Edge[] {
  const edges: Edge[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!isFg(mask, w, h, x, y)) continue;
      if (!isFg(mask, w, h, x, y - 1)) edges.push([[x, y], [x + 1, y]]);
      if (!isFg(mask, w, h, x + 1, y)) edges.push([[x + 1, y], [x + 1, y + 1]]);
      if (!isFg(mask, w, h, x, y + 1)) edges.push([[x + 1, y + 1], [x, y + 1]]);
      if (!isFg(mask, w, h, x - 1, y)) edges.push([[x, y + 1], [x, y]]);
    }
  }
  return edges;
}

function chainEdges(edges: Edge[]): Point[][] {
  const key = (p: Point) => `${p[0]}_${p[1]}`;
  const edgeKey = (e: Edge) => `${key(e[0])}>${key(e[1])}`;
  const fromMap = new Map<string, Edge[]>();
  for (const e of edges) {
    const k = key(e[0]);
    const list = fromMap.get(k);
    if (list) list.push(e);
    else fromMap.set(k, [e]);
  }

  const visited = new Set<string>();
  const loops: Point[][] = [];

  for (const startEdge of edges) {
    if (visited.has(edgeKey(startEdge))) continue;
    const loop: Point[] = [startEdge[0]];
    let current = startEdge;
    let guard = 0;
    while (guard++ < 200000) {
      visited.add(edgeKey(current));
      loop.push(current[1]);
      if (key(current[1]) === key(startEdge[0])) break;
      const candidates = fromMap.get(key(current[1]));
      if (!candidates) break;
      const next = candidates.find((c) => !visited.has(edgeKey(c)));
      if (!next) break;
      current = next;
    }
    if (loop.length > 3) loops.push(loop);
  }

  return loops;
}

function pointLineDist(p: Point, a: Point, b: Point): number {
  const [x, y] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(x - x1, y - y1);
  let t = ((x - x1) * dx + (y - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function simplify(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points;
  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = pointLineDist(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }
  if (maxDist > epsilon) {
    const left = simplify(points.slice(0, index + 1), epsilon);
    const right = simplify(points.slice(index), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [points[0], points[points.length - 1]];
}

function chaikin(points: Point[], iterations: number): Point[] {
  let pts = points;
  for (let iter = 0; iter < iterations; iter++) {
    const next: Point[] = [];
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p0 = pts[i];
      const p1 = pts[(i + 1) % n];
      next.push([p0[0] * 0.75 + p1[0] * 0.25, p0[1] * 0.75 + p1[1] * 0.25]);
      next.push([p0[0] * 0.25 + p1[0] * 0.75, p0[1] * 0.25 + p1[1] * 0.75]);
    }
    pts = next;
  }
  return pts;
}

function pointInPolygon(pt: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect =
      yi > pt[1] !== yj > pt[1] &&
      pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function polygonArea(points: Point[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum / 2);
}

export function traceAlphaShapes(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = 100,
): LogoShape[] {
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    mask[i] = data[i * 4 + 3] >= alphaThreshold ? 1 : 0;
  }

  const edges = traceEdges(mask, width, height);
  const rawLoops = chainEdges(edges);

  const epsilon = Math.max(0.6, Math.min(width, height) * 0.004);
  const processed = rawLoops
    .map((loop) => loop.slice(0, -1))
    .filter((loop) => loop.length >= 3)
    .map((loop) => chaikin(simplify(loop, epsilon), 2));

  const depths = processed.map((loop, i) => {
    const testPoint = loop[0];
    let depth = 0;
    processed.forEach((other, j) => {
      if (i === j) return;
      if (pointInPolygon(testPoint, other)) depth++;
    });
    return depth;
  });

  const outers: { loop: Point[]; area: number }[] = [];
  const holes: { loop: Point[] }[] = [];

  processed.forEach((loop, i) => {
    const area = polygonArea(loop);
    if (area < 1) return;
    if (depths[i] % 2 === 0) {
      outers.push({ loop, area });
    } else {
      holes.push({ loop });
    }
  });

  const shapes: LogoShape[] = outers.map((o) => ({ outer: o.loop, holes: [] }));

  for (const hole of holes) {
    const testPoint = hole.loop[0];
    let bestOuter = -1;
    let bestArea = Infinity;
    outers.forEach((o, oi) => {
      if (o.area < bestArea && pointInPolygon(testPoint, o.loop)) {
        bestArea = o.area;
        bestOuter = oi;
      }
    });
    if (bestOuter >= 0) {
      shapes[bestOuter].holes.push(hole.loop);
    }
  }

  return shapes.filter((s) => s.outer.length >= 3);
}
