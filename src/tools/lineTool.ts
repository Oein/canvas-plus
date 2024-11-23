import { fabricAdd } from "../main";
import CONFIG from "../utils/config";
import { getState } from "../utils/state";
import { IProps, PenType } from "./toolType";

export class LineTool implements PenType {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  app: HTMLDivElement;

  constructor(props: IProps) {
    this.canvas = props.canvas;
    this.context = props.context;
    this.app = props.app;
  }

  apply() {
    console.log("LineTool Apply");
    let startX = 0;
    let startY = 0;
    let dragging = false;

    const mouseDown = (e: MouseEvent) => {
      dragging = true;
      startX = (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE;
      startY = (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE;
    };
    const mouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      let x = (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE;
      let y = (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE;

      this.context.strokeStyle = getState<string>("PENCOLOR");
      this.context.lineWidth = getState<number>("PENSTROKE") * CONFIG.SCALE;

      if (getState("ISDASH")) {
        this.context.setLineDash(getState<number[]>("DASHLINE"));
      } else {
        this.context.setLineDash([]);
      }

      // get line drgree from x axis
      const rad = Math.atan2(y - startY, x - startX);
      // rad to degree
      const deg = rad * (180 / Math.PI);

      if (getState("SNAP_RIGHT")) {
        if (deg <= CONFIG.SNAP_DEG && deg >= -CONFIG.SNAP_DEG) {
          y = startY;
        }
        if (deg >= 90 - CONFIG.SNAP_DEG && deg <= 90 + CONFIG.SNAP_DEG) {
          x = startX;
        }
        if (deg >= 180 - CONFIG.SNAP_DEG || deg <= -180 + CONFIG.SNAP_DEG) {
          y = startY;
        }
        if (deg >= -90 - CONFIG.SNAP_DEG && deg <= -90 + CONFIG.SNAP_DEG) {
          x = startX;
        }
      }

      if (getState("SHIFT")) {
        const dx = Math.abs(x - startX);
        const dy = Math.abs(y - startY);
        if (dx > dy) {
          y = startY;
        } else {
          x = startX;
        }
      }

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.beginPath();
      this.context.moveTo(startX, startY);
      this.context.lineTo(x, y);
      this.context.stroke();
      this.context.setLineDash([]);
    };
    const mouseUp = (e: MouseEvent) => {
      if (!dragging) return;
      dragging = false;
      let x = (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE;
      let y = (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE;

      // get line drgree from x axis
      const rad = Math.atan2(y - startY, x - startX);
      // rad to degree
      let deg = rad * (180 / Math.PI);

      if (getState("SNAP_RIGHT")) {
        if (deg <= CONFIG.SNAP_DEG && deg >= -CONFIG.SNAP_DEG) {
          y = startY;
          deg = 0;
        }
        if (deg >= 90 - CONFIG.SNAP_DEG && deg <= 90 + CONFIG.SNAP_DEG) {
          x = startX;
          deg = 90;
        }
        if (deg >= 180 - CONFIG.SNAP_DEG || deg <= -180 + CONFIG.SNAP_DEG) {
          y = startY;
          deg = 180;
        }
        if (deg >= -90 - CONFIG.SNAP_DEG && deg <= -90 + CONFIG.SNAP_DEG) {
          x = startX;
          deg = -90;
        }
      }

      if (getState("SHIFT")) {
        const dx = Math.abs(x - startX);
        const dy = Math.abs(y - startY);
        if (dx > dy) {
          y = startY;
          deg = startX < x ? 0 : 180;
        } else {
          x = startX;
          deg = startY < y ? 90 : -90;
        }
      }

      const strk = getState<number>("PENSTROKE") * CONFIG.SCALE;

      fabricAdd({
        type: "line",
        from: { x: startX, y: startY },
        to: { x, y },
        strokeWidth: strk,
        strokeColor: getState<string>("PENCOLOR"),
        strokeDashArray: getState("ISDASH")
          ? getState<number[]>("DASHLINE")
          : [],
        rotate: deg,
      });

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.setLineDash([]);
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
