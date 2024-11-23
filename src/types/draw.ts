export type Point = {
  x: number;
  y: number;
};

export type IDrawLine = {
  type: "line";
  from: Point;
  to: Point;

  rotate: number;

  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
};

export type IDrawRect = {
  type: "rect";
  leftTop: Point;
  width: number;
  height: number;

  rotate: number;

  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
};

export type IDrawTriangle = {
  type: "triangle";
  points: Point[];

  rotate: number;

  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
};

export type IDrawImage = {
  type: "image";
  image: HTMLImageElement;

  left: number;
  top: number;

  width: number;
  height: number;
  rotate: number;
};

export type IDrawPolygon = {
  type: "polygon";
  points: Point[];

  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
};

export type IDraw =
  | IDrawLine
  | IDrawRect
  | IDrawTriangle
  | IDrawImage
  | IDrawPolygon;
