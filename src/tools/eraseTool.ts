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
    console.log("ExampleTool Apply");
    const mouseDown = () => {
      this.state = "ERASE";
    };
    const mouseMove = () => {};
    const mouseUp = () => {
      this.state = "NONE";
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
