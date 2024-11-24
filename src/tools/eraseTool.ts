import { isPointInPolygon } from "../algorithm/pointInPoly";
import { getInstance } from "../main";
import CONFIG from "../utils/config";
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
    console.log("EraseTool Apply");
    const mouseDown = () => {
      this.state = "ERASE";
    };
    const mouseMove = (e: MouseEvent) => {
      if (this.state !== "ERASE") return;
      const x = e.offsetX * CONFIG.SCALE;
      const y = e.offsetY * CONFIG.SCALE;

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
