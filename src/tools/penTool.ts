import { generateStrokedPolygon } from "../algorithm/penPolygon";
import { Point } from "../algorithm/polygon";
import { fabricAdd, getInstance } from "../main";
import CONFIG from "../utils/config";
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
    console.log("PenTool Apply");
    const mouseDown = (e: MouseEvent) => {
      this.state = "DRAW";
      this.points = [
        { x: e.offsetX * CONFIG.SCALE, y: e.offsetY * CONFIG.SCALE },
      ];
      this.startPos = { x: e.offsetX, y: e.offsetY };
      this.lastApplied = { x: e.offsetX, y: e.offsetY };

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.moveTo(e.offsetX * CONFIG.SCALE, e.offsetY * CONFIG.SCALE);
      this.context.beginPath();
      this.context.strokeStyle = getState("PENCOLOR") || "black";
      this.context.lineWidth = getState("PENSTROKE") || 1;
      this.context.stroke();
    };
    const mouseMove = (e: MouseEvent) => {
      if (this.state !== "DRAW") return;
      const x = e.offsetX;
      const y = e.offsetY;

      const dist = Math.sqrt(
        (x - this.lastApplied.x) ** 2 + (y - this.lastApplied.y) ** 2
      );
      if (dist < 3) return;

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

      const poly = generateStrokedPolygon(
        this.points,
        getState("PENSTROKE") || 1
      );
      fabricAdd({
        type: "polygon",
        fillColor: getState("PENCOLOR") || "black",
        points: poly,
        strokeWidth: 0,
        strokeColor: "transparent",
      });

      getInstance().saveAsHistory();
    };
    this.canvas.addEventListener("mousemove", mouseMove);
    this.canvas.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    return () => {
      this.canvas.removeEventListener("mousedown", mouseDown);
      this.canvas.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }
}
