import { Point } from "../algorithm/polygon";
import { fabricAdd, getInstance } from "../main";
import { ael, rel } from "../utils/addEventListener";
import CONFIG from "../utils/config";
import debug from "../utils/debugMsg";
import { getState } from "../utils/state";
import { IProps, PenType } from "./toolType";

export class PenTool implements PenType {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  app: HTMLDivElement;

  constructor(props: IProps) {
    this.canvas = props.canvas;
    this.context = props.context;
    this.app = props.app;
  }

  state: "NONE" | "DRAW" = "NONE";
  startPos: Point = { x: 0, y: 0 };
  lastApplied: Point = { x: 0, y: 0 };
  points: Point[] = [];

  apply() {
    debug(`<PenTl> Apply`);
    const mouseDown = (e: MouseEvent) => {
      this.state = "DRAW";
      this.points = [
        { x: e.clientX * CONFIG.SCALE, y: e.clientY * CONFIG.SCALE },
      ];
      this.startPos = { x: e.clientX, y: e.clientY };
      this.lastApplied = { x: e.clientX, y: e.clientY };

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.moveTo(e.clientX * CONFIG.SCALE, e.clientY * CONFIG.SCALE);
      this.context.beginPath();
      this.context.strokeStyle = getState("PENCOLOR") || "black";
      this.context.lineWidth = getState("PENSTROKE") || 1;
      this.context.lineCap = "round";
      this.context.stroke();
    };
    const mouseMove = (e: MouseEvent) => {
      if (this.state !== "DRAW") return;
      const x = e.clientX;
      const y = e.clientY;

      const dist = Math.sqrt(
        (x - this.lastApplied.x) ** 2 + (y - this.lastApplied.y) ** 2
      );
      if (dist < 0.1) return;

      this.points.push({ x: x * CONFIG.SCALE, y: y * CONFIG.SCALE });
      this.lastApplied = { x, y };
      this.context.lineTo(x * CONFIG.SCALE, y * CONFIG.SCALE);
      this.context.stroke();
    };
    const mouseUp = () => {
      if (this.state !== "DRAW") return;

      this.state = "NONE";

      this.context.closePath();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.lineCap = "butt";

      // const poly = generateStrokedPolygon(
      //   this.points,
      //   getState("PENSTROKE") || 1
      // );
      debug(`<PenTl> Points: ${this.points.length}`);
      fabricAdd({
        type: "pen",
        points: [...this.points],
        strokeWidth: getState("PENSTROKE") || 1,
        strokeColor: getState("PENCOLOR") || "black",
      });

      getInstance().saveAsHistory();
    };
    ael(this.canvas, ["mousedown", "touchstart", "pointerdown"], mouseDown);
    ael(this.canvas, ["mousemove", "touchmove", "pointermove"], mouseMove);
    ael(document, ["mouseup", "touchend", "pointerup"], mouseUp);
    return () => {
      rel(this.canvas, ["mousedown", "touchstart", "pointerdown"], mouseDown);
      rel(this.canvas, ["mousemove", "touchmove", "pointermove"], mouseMove);
      rel(document, ["mouseup", "touchend", "pointerup"], mouseUp);
    };
  }
}
