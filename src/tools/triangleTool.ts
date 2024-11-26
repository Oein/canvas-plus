import { fabricAdd, getInstance } from "../main";
import { ael, rel } from "../utils/addEventListener";
import CONFIG from "../utils/config";
import debug from "../utils/debugMsg";
import { getState } from "../utils/state";
import { IProps, PenType } from "./toolType";

export class TriangleTool implements PenType {
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
    if (context) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context.strokeStyle = getState<string>("PENCOLOR");
      context.lineWidth = getState<number>("PENSTROKE") * CONFIG.SCALE;
    }

    const x = (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE;
    const y = (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE;
    let width = x - this.state.startX;
    let height = y - this.state.startY;

    if (getState("SHIFTTOOL") || getState("SHIFT")) {
      // 정삼각형
      const min = Math.min(Math.abs(width), Math.abs(height));
      width = (width > 0 ? 1 : -1) * min;
      height = ((height > 0 ? 1 : -1) * min * Math.sqrt(3)) / 2;
    }

    // reverse Y

    if (context) {
      let sty = this.state.startY;
      if (height > 0) {
        height = -height;
        sty -= height;
      }

      context.beginPath();
      context.moveTo(this.state.startX, sty);
      context.lineTo(this.state.startX + width, sty);
      context.lineTo(this.state.startX + width / 2, sty + height);
      context.closePath();
      context.stroke();
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
        type: "triangle",
        fillColor: getState("FILLTOOL")
          ? getState<string>("PENCOLOR")
          : "transparent",
        rotate: 0,
        strokeColor: getState<string>("PENCOLOR"),
        strokeWidth: strk,
        points: [
          { x: stX, y: stY + height },
          { x: stX + width, y: stY + height },
          { x: stX + width / 2, y: stY },
        ],
      });

      getInstance().saveAsHistory();
    }
  }

  apply() {
    debug(`<TriTl> Apply`);
    const mouseDown = (e: MouseEvent) => {
      this.state.dragging = true;
      this.state.startX = (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE;
      this.state.startY = (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE;
    };
    const mouseMove = (e: MouseEvent) => {
      if (this.state.dragging) this.draw(e, this.context);
    };
    const mouseUp = (e: MouseEvent) => {
      if (!this.state.dragging) return;
      this.state.dragging = false;

      this.draw(e, null);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ael(this.canvas, ["mousemove", "touchmove", "pointermove"], mouseMove);
    ael(document, ["mouseup", "touchend", "pointerup"], mouseUp);
    ael(this.canvas, ["mousedown", "touchstart", "pointerdown"], mouseDown);
    return () => {
      rel(this.canvas, ["mousemove", "touchmove", "pointermove"], mouseMove);
      rel(document, ["mouseup", "touchend", "pointerup"], mouseUp);
      rel(this.canvas, ["mousedown", "touchstart", "pointerdown"], mouseDown);
    };
  }
}
