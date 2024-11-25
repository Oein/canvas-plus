import { ael, rel } from "../utils/addEventListener";
import { IProps, PenType } from "./toolType";

export class ExampleTool implements PenType {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  app: HTMLDivElement;

  constructor(props: IProps) {
    this.canvas = props.canvas;
    this.context = props.context;
    this.app = props.app;
  }

  apply() {
    console.log("ExampleTool Apply");
    const mouseDown = () => {};
    const mouseMove = () => {};
    const mouseUp = () => {};
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
