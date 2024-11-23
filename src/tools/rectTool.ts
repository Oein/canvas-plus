import { fabricAdd } from "../main";
import CONFIG from "../utils/config";
import { getState } from "../utils/state";
import { IProps, PenType } from "./toolType";

export class RectTool implements PenType {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  app: HTMLDivElement;

  constructor(props: IProps) {
    this.canvas = props.canvas;
    this.context = props.context;
    this.app = props.app;
  }

  state = {
    dragging: false,
    startX: 0,
    startY: 0,
  };

  draw(e: MouseEvent, context: CanvasRenderingContext2D | null) {
    const x = (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE;
    const y = (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE;
    let width = x - this.state.startX;
    let height = y - this.state.startY;
    if (getState("SHIFTTOOL") || getState("SHIFT")) {
      const min = Math.min(Math.abs(width), Math.abs(height));
      width = (width > 0 ? 1 : -1) * min;
      height = (height > 0 ? 1 : -1) * min;
    }
    if (context) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context.strokeStyle = getState<string>("PENCOLOR");
      context.lineWidth = getState<number>("PENSTROKE") * CONFIG.SCALE;
      context.strokeRect(this.state.startX, this.state.startY, width, height);
    } else {
      let stX = this.state.startX;
      let stY = this.state.startY;
      if (width < 0) {
        stX += width;
        width = -width;
      }
      if (height < 0) {
        stY += height;
        height = -height;
      }
      const strk = getState<number>("PENSTROKE") * CONFIG.SCALE;
      fabricAdd({
        type: "rect",
        leftTop: { x: stX, y: stY },
        width: width,
        height: height,
        fillColor: getState("FILLTOOL")
          ? getState<string>("PENCOLOR")
          : "transparent",
        strokeColor: getState<string>("PENCOLOR"),
        rotate: 0,
        strokeWidth: strk,
      });
    }
  }

  apply() {
    console.log("RectTool Apply");
    const mouseDown = (e: MouseEvent) => {
      this.state.dragging = true;
      this.state.startX = (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE;
      this.state.startY = (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE;
    };
    const mouseMove = (e: MouseEvent) => {
      if (this.state.dragging) {
        this.draw(e, this.context);
      }
    };
    const mouseUp = (e: MouseEvent) => {
      if (!this.state.dragging) return;
      this.state.dragging = false;

      this.draw(e, null);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
