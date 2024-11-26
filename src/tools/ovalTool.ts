import ellipsePolygon from "../algorithm/ellipsePolygon";
import computeStrokeOutline from "../algorithm/outStrokePolygon";
import createThickPolygon from "../algorithm/strokePolygon";
import { fabricAdd, getInstance } from "../main";
import { ael, rel } from "../utils/addEventListener";
import CONFIG from "../utils/config";
import debug from "../utils/debugMsg";
import { getState } from "../utils/state";
import { IProps, PenType } from "./toolType";

export class OvalTool implements PenType {
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
    if (context) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context.strokeStyle = getState<string>("PENCOLOR");
      context.lineWidth = getState<number>("PENSTROKE") * CONFIG.SCALE;
    }
    const width = x - this.state.startX;
    const height = y - this.state.startY;
    let radiusX = width / 2;
    let radiusY = height / 2;

    if (getState("SHIFTTOOL") || getState("SHIFT")) {
      let minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
      radiusX = (radiusX > 0 ? 1 : -1) * minRadius;
      radiusY = (radiusY > 0 ? 1 : -1) * minRadius;
    }

    let centerX = this.state.startX + radiusX;
    let centerY = this.state.startY + radiusY;

    if (radiusX < 0) {
      radiusX = -radiusX;
      centerX = this.state.startX - radiusX;
    }
    if (radiusY < 0) {
      radiusY = -radiusY;
      centerY = this.state.startY - radiusY;
    }

    if (context) {
      context.beginPath();
      context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      context.stroke();
    } else {
      const obj = {
        fillColor: getState("FILLTOOL")
          ? getState<string>("PENCOLOR")
          : "transparent",
        strokeColor: getState<string>("PENCOLOR"),
        strokeWidth: getState<number>("PENSTROKE") * CONFIG.SCALE,
        xradi: radiusX,
        yradi: radiusY,
      };
      const elipPoly = ellipsePolygon(centerX, radiusX, centerY, radiusY);
      fabricAdd({
        fillColor: getState<string>("PENCOLOR"),
        points:
          obj.fillColor === "transparent"
            ? createThickPolygon(elipPoly, obj.strokeWidth)
            : computeStrokeOutline(elipPoly, obj.strokeWidth / 2),
        strokeColor: "transparent",
        strokeWidth: 0,
        type: "polygon",
      });

      getInstance().saveAsHistory();
    }
  }

  apply() {
    debug(`<OvaTl> Apply`);

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
