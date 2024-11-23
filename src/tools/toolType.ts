export type DisApply = () => void;

export type IProps = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  app: HTMLDivElement;
};

export interface PenType {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  app: HTMLDivElement;
  constructor: Function;

  apply: () => DisApply;
}
