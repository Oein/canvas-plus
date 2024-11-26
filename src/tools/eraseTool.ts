import { isPointInPolygon } from "../algorithm/pointInPoly";
import { getInstance } from "../main";
import { ael, rel } from "../utils/addEventListener";
import CONFIG from "../utils/config";
import debug from "../utils/debugMsg";
import { IProps, PenType } from "./toolType";

export class EraseTool implements PenType {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  app: HTMLDivElement;

  constructor(props: IProps) {
    this.canvas = props.canvas;
    this.context = props.context;
    this.app = props.app;
  }

  state: "ERASE" | "NONE" = "NONE";

  apply() {
    debug(`<EraTl> Apply`);
    const mouseDown = () => {
      this.state = "ERASE";
    };
    const mouseMove = (e: MouseEvent) => {
      if (this.state !== "ERASE") return;
      const x = e.clientX * CONFIG.SCALE;
      const y = e.clientY * CONFIG.SCALE;

      const inst = getInstance();
      const keys = Object.keys(inst.drawnLayers);
      for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        const poly = inst.drawnPolygons[key];

        const isInPoly = isPointInPolygon({ x, y }, poly);
        isInPoly && inst.removeLayer(key);
      }
    };
    const mouseUp = () => {
      if (this.state !== "ERASE") return;
      this.state = "NONE";
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
