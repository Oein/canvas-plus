import computeBoundingRectangle from "../algorithm/boundingPolygon";
import pointDistance from "../algorithm/pointDistance";
import { intersect, Point, Polygon, polygonArea } from "../algorithm/polygon";
import calculateRectangleCorners from "../algorithm/rotatedRect";
import rotateRect from "../algorithm/rotateImage";
import rotateLine from "../algorithm/rotateLine";
import rotatePolygon from "../algorithm/rotatePolygon";
import createThickPolygon from "../algorithm/strokePolygon";
import { getInstance, transform, fabricAdd } from "../main";
import { IDrawImage, IDrawLine } from "../types/draw";
import { ael, rel } from "../utils/addEventListener";
import CONFIG from "../utils/config";
import debug from "../utils/debugMsg";
import hslColor from "../utils/hslColor";
import { getState } from "../utils/state";
import CoordinateInputModal from "../utils/xyInputModal";
import zIndex from "../utils/zIndexManager";
import { IProps, PenType } from "./toolType";

export class SelectTool implements PenType {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  app: HTMLDivElement;
  wk: HTMLDivElement;

  constructor(props: IProps) {
    this.canvas = props.canvas;
    this.context = props.context;
    this.app = props.app;
    this.wk = document.getElementById("selectTool")! as HTMLDivElement;
  }

  workingState:
    | "BBOX_MOVE"
    | "SELECTING"
    | "NONE"
    | "SELECTED"
    | "RESIZE"
    | "ROTATE" = "NONE";
  mouseStart: Point = { x: 0, y: 0 };
  lastApplied: Point = { x: 0, y: 0 };
  lastScaled: Point = { x: 0, y: 0 };
  bbox: Polygon = [];
  bboxRotate: number = 0;

  context_drawSelected(dx = 0, dy = 0) {
    this.context.strokeStyle = hslColor(1);
    this.context.fillStyle = hslColor(0.3);
    if (this.bboxElement)
      this.bboxElement.style.background = this.context.fillStyle;
    this.context.lineWidth = 3 * CONFIG.SCALE;
    this.context.setLineDash([6, 9]);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.selectedObjects.length; i++) {
      const poly = getInstance().drawnPolygons[this.selectedObjects[i]];
      this.context.beginPath();
      this.context.moveTo(poly[0].x + dx, poly[0].y + dy);
      for (let j = 1; j < poly.length; j++) {
        this.context.lineTo(poly[j].x + dx, poly[j].y + dy);
      }
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
    }
    this.context.setLineDash([]);
  }

  isShifted() {
    return getState("SHIFT") || getState("SHIFTTOOL");
  }

  wk_mouseDown() {}
  wk_mouseMove(e: MouseEvent) {
    if (this.workingState === "BBOX_MOVE") return this.bbox_handleMove(e);
    if (this.workingState == "RESIZE") return this.resize_handleMove(e);
    if (this.workingState == "ROTATE") return this.rotate_mouseMove(e);
  }
  wk_mouseUp(e: MouseEvent) {
    debug(`<SelTl> MOUSEUP ${this.workingState}`);
    if (this.workingState === "BBOX_MOVE") return this.bbox_mouseUp(e);
    if (this.workingState === "RESIZE") return this.resize_mouseUp(e);
    if (this.workingState === "ROTATE") return this.rotate_mouseUp(e);
    if (this.workingState === "SELECTED") {
      e.preventDefault();
      e.stopPropagation();
      return this.disselect();
    }
  }

  wk_bindMDN = this.wk_mouseDown.bind(this);
  wk_bindMMV = this.wk_mouseMove.bind(this);
  wk_bindMUP = this.wk_mouseUp.bind(this);

  disallowDrawing() {
    this.wk.classList.add("active");

    ael(this.wk, ["mousedown", "touchstart", "pointerdown"], this.wk_bindMDN);
    ael(this.wk, ["mousemove", "touchmove", "pointermove"], this.wk_bindMMV);
    ael(this.wk, ["mouseup", "touchend", "pointerup"], this.wk_bindMUP);
  }
  allowDrawing() {
    this.wk.classList.remove("active");

    this.wk.removeEventListener("mousedown", this.wk_bindMDN);
    this.wk.removeEventListener("mousemove", this.wk_bindMMV);
    this.wk.removeEventListener("mouseup", this.wk_bindMUP);
  }

  resize_drawImageGhost(key: string) {
    const inst = getInstance();
    const context = inst.drawnLayers[key].t;
    const object = inst.drawnLayers[key].d as IDrawImage;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const nrect = rotateRect(
      {
        height: object.height * this.lastScaled.y,
        width: object.width * this.lastScaled.x,
        rotate: object.rotate,
        x: this.bbox[0].x + (object.left - this.bbox[0].x) * this.lastScaled.x,
        y: this.bbox[0].y + (object.top - this.bbox[0].y) * this.lastScaled.y,
      },
      this.bbox[0].x + (object.left - this.bbox[0].x) * this.lastScaled.x,
      this.bbox[0].y + (object.top - this.bbox[0].y) * this.lastScaled.y,
      object.rotate
    );

    const poly = calculateRectangleCorners(
      nrect.x + nrect.width / 2,
      nrect.y + nrect.height / 2,
      nrect.width,
      nrect.height,
      nrect.rotate
    );

    let xAvg = poly[0].x;
    let yAvg = poly[0].y;
    for (let i = 1; i < poly.length; i++) {
      xAvg += poly[i].x;
      yAvg += poly[i].y;
    }

    xAvg /= poly.length;
    yAvg /= poly.length;

    context.save();
    context.translate(xAvg, yAvg);
    context.rotate((nrect.rotate * Math.PI) / 180);
    context.translate(-xAvg, -yAvg);
    context.drawImage(
      object.image,
      nrect.x,
      nrect.y,
      nrect.width,
      nrect.height
    );
    context.restore();
  }
  resize_drawLineGhost(key: string) {
    const inst = getInstance();
    const context = inst.drawnLayers[key].t;
    const object = inst.drawnLayers[key].d as IDrawLine;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const newFrom = {
      x: this.bbox[0].x + (object.from.x - this.bbox[0].x) * this.lastScaled.x,
      y: this.bbox[0].y + (object.from.y - this.bbox[0].y) * this.lastScaled.y,
    };
    const newTo = {
      x: this.bbox[0].x + (object.to.x - this.bbox[0].x) * this.lastScaled.x,
      y: this.bbox[0].y + (object.to.y - this.bbox[0].y) * this.lastScaled.y,
    };

    const linePoly = createThickPolygon([newFrom, newTo], object.strokeWidth);
    this.context.strokeStyle = hslColor(1);
    this.context.fillStyle = hslColor(0.3);
    this.context.lineWidth = 3 * CONFIG.SCALE;
    this.context.setLineDash([6, 9]);
    this.context.beginPath();
    this.context.moveTo(linePoly[0].x, linePoly[0].y);
    for (let i = 1; i < linePoly.length; i++) {
      this.context.lineTo(linePoly[i].x, linePoly[i].y);
    }
    this.context.stroke();
    this.context.fill();
    this.context.setLineDash([]);

    context.strokeStyle = object.strokeColor;
    context.lineWidth = object.strokeWidth;
    context.setLineDash(object.strokeDashArray);

    context.beginPath();
    context.moveTo(newFrom.x, newFrom.y);
    context.lineTo(newTo.x, newTo.y);
    context.stroke();

    context.setLineDash([]);
  }
  resize_drawGhost(poly: Polygon, key: string, zIndex: number) {
    const inst = getInstance();
    const context = inst.drawnLayers[key].t;
    const object = inst.drawnLayers[key].d;

    context.canvas.style.zIndex = zIndex.toString();

    if (object.type == "line") return this.resize_drawLineGhost(key);
    if (object.type == "image") return this.resize_drawImageGhost(key);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = "transparent";

    let fillColor =
      object.fillColor === "transparent"
        ? object.strokeColor
        : object.fillColor;
    context.fillStyle = fillColor;
    context.lineWidth = 0;

    this.context.strokeStyle = hslColor(1);
    this.context.fillStyle = hslColor(0.3);
    this.context.lineWidth = 3 * CONFIG.SCALE;
    this.context.setLineDash([6, 9]);

    context.beginPath();
    this.context.beginPath();

    context.moveTo(poly[0].x, poly[0].y);
    this.context.moveTo(poly[0].x, poly[0].y);

    for (let i = 1; i < poly.length; i++) {
      context.lineTo(poly[i].x, poly[i].y);
      this.context.lineTo(poly[i].x, poly[i].y);
    }
    context.closePath();
    context.fill();

    this.context.closePath();
    this.context.stroke();
    this.context.fill();
    this.context.setLineDash([]);
  }
  resize_applyPoly() {
    const inst = getInstance();
    for (const key of this.selectedObjects) {
      let poly = inst.drawnPolygons[key];
      poly = poly.map((p) => ({
        x: this.bbox[0].x + (p.x - this.bbox[0].x) * this.lastScaled.x,
        y: this.bbox[0].y + (p.y - this.bbox[0].y) * this.lastScaled.y,
      }));

      getInstance().drawnPolygons[key] = poly;

      const object = inst.drawnLayers[key].d;
      switch (object.type) {
        case "rect":
          object.leftTop = poly[0];
          object.width = poly[2].x - poly[0].x;
          object.height = poly[2].y - poly[0].y;
          break;
        case "triangle":
          object.points = poly;
          break;
        case "polygon":
          object.points = poly;
          break;
        case "line":
          object.from = {
            x:
              this.bbox[0].x +
              (object.from.x - this.bbox[0].x) * this.lastScaled.x,
            y:
              this.bbox[0].y +
              (object.from.y - this.bbox[0].y) * this.lastScaled.y,
          };
          object.to = {
            x:
              this.bbox[0].x +
              (object.to.x - this.bbox[0].x) * this.lastScaled.x,
            y:
              this.bbox[0].y +
              (object.to.y - this.bbox[0].y) * this.lastScaled.y,
          };
          break;
        case "image":
          object.left =
            this.bbox[0].x + (object.left - this.bbox[0].x) * this.lastScaled.x;
          object.top =
            this.bbox[0].y + (object.top - this.bbox[0].y) * this.lastScaled.y;
          object.width *= this.lastScaled.x;
          object.height *= this.lastScaled.y;
          break;
      }
    }
  }
  resize_mouseDown(e: MouseEvent) {
    e.stopPropagation();
    this.workingState = "RESIZE";
    debug(`<SelTl> RESIZE_MOUSEDOWN`);

    this.mouseStart = { x: e.clientX, y: e.clientY };
    this.lastApplied = { x: e.clientX, y: e.clientY };
    this.lastScaled = { x: 1, y: 1 };
    this.bbox = computeBoundingRectangle(
      this.selectedObjects.map((key) => getInstance().drawnPolygons[key])
    );
  }
  resize_handleMove(e: MouseEvent) {
    const newMouse = { x: e.clientX, y: e.clientY };
    const DO_RENDER = (() => {
      const dist = pointDistance(this.lastApplied, newMouse);
      if (dist < 5) return false;
      this.lastApplied = { x: newMouse.x, y: newMouse.y };
      return true;
    })();

    if (!DO_RENDER) return;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const BBOX_WIDTH = (this.bbox[2].x - this.bbox[0].x) / CONFIG.SCALE;
    const BBOX_HEIGHT = (this.bbox[1].y - this.bbox[0].y) / CONFIG.SCALE;
    const scaleMouseX = newMouse.x - this.mouseStart.x;
    const scaleMouseY = newMouse.y - this.mouseStart.y;

    let scaleX = (BBOX_WIDTH + scaleMouseX) / BBOX_WIDTH;
    let scaleY = (BBOX_HEIGHT + scaleMouseY) / BBOX_HEIGHT;

    if (this.isShifted()) scaleX = scaleY = Math.min(scaleX, scaleY);

    this.lastScaled = { x: scaleX, y: scaleY };

    // ghost draw
    const inst = getInstance();
    const zi = zIndex();
    for (let i = 0; i < this.selectedObjects.length; i++) {
      let poly = inst.drawnPolygons[this.selectedObjects[i]];
      poly = poly.map((p) => ({
        x: this.bbox[0].x + (p.x - this.bbox[0].x) * scaleX,
        y: this.bbox[0].y + (p.y - this.bbox[0].y) * scaleY,
      }));
      this.resize_drawGhost(poly, this.selectedObjects[i], zi);
    }
    this.bboxElement!.style.width = `${BBOX_WIDTH * scaleX}px`;
    this.bboxElement!.style.height = `${BBOX_HEIGHT * scaleY}px`;
  }
  resize_mouseMove() {}
  resize_mouseUp(e: MouseEvent) {
    if (this.workingState !== "RESIZE") return;
    e.stopPropagation();
    this.workingState = "SELECTED";
    getInstance().saveAsHistory();

    // apply new polygon
    this.resize_applyPoly();

    // redraw images
    for (let i = 0; i < this.selectedObjects.length; i++) {
      const objectType =
        getInstance().drawnLayers[this.selectedObjects[i]].d.type;
      if (objectType === "image") {
        getInstance().rerender(this.selectedObjects[i]);
        continue;
      }
    }

    debug(`<SelTl> RESIZE_MOUSEUP`);
  }

  resize_bindMDN = this.resize_mouseDown.bind(this);
  resize_bindMMV = this.resize_mouseMove.bind(this);
  resize_bindMUP = this.resize_mouseUp.bind(this);

  setupResize(): HTMLDivElement {
    const resizeElement = document.createElement("div");
    resizeElement.classList.add("resize");

    ael(
      resizeElement,
      ["mousedown", "touchstart", "pointerdown"],
      this.resize_bindMDN
    );
    ael(
      resizeElement,
      ["mousemove", "touchmove", "pointermove"],
      this.resize_bindMMV
    );
    ael(
      resizeElement,
      ["mouseup", "touchend", "pointerup"],
      this.resize_bindMUP
    );

    return resizeElement;
  }

  bboxElement: HTMLDivElement | null = null;

  rotate_drawLineGhost(npoints: [Point, Point], key: string) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const inst = getInstance();
    const context = inst.drawnLayers[key].t;
    const object = inst.drawnLayers[key].d as IDrawLine;

    const linePoly = createThickPolygon(npoints, object.strokeWidth);
    this.context.strokeStyle = hslColor(1);
    this.context.fillStyle = hslColor(0.3);
    this.context.lineWidth = 3 * CONFIG.SCALE;
    this.context.setLineDash([6, 9]);
    this.context.beginPath();
    this.context.moveTo(linePoly[0].x, linePoly[0].y);
    for (let i = 1; i < linePoly.length; i++) {
      this.context.lineTo(linePoly[i].x, linePoly[i].y);
    }
    this.context.stroke();
    this.context.fill();
    this.context.setLineDash([]);

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = object.strokeColor;
    context.lineWidth = object.strokeWidth;
    context.setLineDash(object.strokeDashArray);

    context.beginPath();
    context.moveTo(npoints[0].x, npoints[0].y);
    context.lineTo(npoints[1].x, npoints[1].y);
    context.stroke();

    context.setLineDash([]);
  }
  rotate_drawImageGhost(
    centerX: number,
    centerY: number,
    deg: number,
    key: string
  ) {
    const inst = getInstance();
    const context = inst.drawnLayers[key].t;
    const object = inst.drawnLayers[key].d;

    const image = object as IDrawImage;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const nrect = rotateRect(
      {
        height: image.height,
        width: image.width,
        rotate: image.rotate,
        x: image.left,
        y: image.top,
      },
      centerX,
      centerY,
      deg
    );
    // draw nrect

    const poly = calculateRectangleCorners(
      nrect.x + nrect.width / 2,
      nrect.y + nrect.height / 2,
      nrect.width,
      nrect.height,
      deg
    );
    let xAvg = poly[0].x;
    let yAvg = poly[0].y;
    context.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) {
      xAvg += poly[i].x;
      yAvg += poly[i].y;
    }

    xAvg /= poly.length;
    yAvg /= poly.length;

    context.save();
    context.translate(xAvg, yAvg);
    context.rotate((nrect.rotate * Math.PI) / 180);
    context.translate(-xAvg, -yAvg);
    context.drawImage(image.image, nrect.x, nrect.y, nrect.width, nrect.height);
    context.restore();
  }
  rotate_drawGhost(poly: Polygon, key: string, zIndex: number) {
    const inst = getInstance();
    const context = inst.drawnLayers[key].t;
    const object = inst.drawnLayers[key].d;
    context.canvas.style.zIndex = zIndex.toString();

    if (object.type == "line") return;
    if (object.type == "image") return;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = "transparent";

    let fillColor =
      object.fillColor === "transparent"
        ? object.strokeColor
        : object.fillColor;
    context.fillStyle = fillColor;
    context.lineWidth = 0;

    this.context.strokeStyle = hslColor(1);
    this.context.fillStyle = hslColor(0.3);
    this.context.lineWidth = 3 * CONFIG.SCALE;
    this.context.setLineDash([6, 9]);

    context.beginPath();
    this.context.beginPath();

    context.moveTo(poly[0].x, poly[0].y);
    this.context.moveTo(poly[0].x, poly[0].y);

    for (let i = 1; i < poly.length; i++) {
      context.lineTo(poly[i].x, poly[i].y);
      this.context.lineTo(poly[i].x, poly[i].y);
    }
    context.closePath();
    context.fill();

    this.context.closePath();
    this.context.stroke();
    this.context.fill();
    this.context.setLineDash([]);
  }
  rotate_mouseDown(e: MouseEvent) {
    this.bbox = computeBoundingRectangle(
      this.selectedObjects.map((key) => getInstance().drawnPolygons[key])
    );
    e.stopPropagation();
    this.workingState = "ROTATE";
    // set mouse start to center of bbox
    this.mouseStart = {
      x:
        (this.bbox[0].x + (this.bbox[2].x - this.bbox[0].x) / 2) / CONFIG.SCALE,
      y:
        (this.bbox[0].y + (this.bbox[1].y - this.bbox[0].y) / 2) / CONFIG.SCALE,
    };
    this.lastApplied = { x: e.clientX, y: e.clientY };
    this.bboxRotate = 0;
  }
  rotate_mouseMove(e: MouseEvent) {
    if (this.workingState !== "ROTATE") return;
    const newMouse = { x: e.clientX, y: e.clientY };
    const DO_RENDER = (() => {
      const dist = pointDistance(this.lastApplied, newMouse);
      if (dist < 5) return false;
      this.lastApplied = { x: newMouse.x, y: newMouse.y };
      return true;
    })();

    if (!DO_RENDER) return;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const dx = newMouse.x - this.mouseStart.x;
    const dy = newMouse.y - this.mouseStart.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    this.bboxElement!.style.transform = `rotate(${angle}deg)`;
    this.bboxRotate = angle;
    const zi = zIndex();
    for (let i = 0; i < this.selectedObjects.length; i++) {
      const objectType =
        getInstance().drawnLayers[this.selectedObjects[i]].d.type;
      if (objectType === "line") {
        const obj = getInstance().drawnLayers[this.selectedObjects[i]]
          .d as IDrawLine;
        this.rotate_drawLineGhost(
          rotateLine(
            {
              x: this.mouseStart.x * CONFIG.SCALE,
              y: this.mouseStart.y * CONFIG.SCALE,
            },

            obj.from,
            obj.to,
            angle
          ),
          this.selectedObjects[i]
        );
      }
      if (objectType === "image") {
        this.rotate_drawImageGhost(
          this.mouseStart.x * CONFIG.SCALE,
          this.mouseStart.y * CONFIG.SCALE,
          angle,
          this.selectedObjects[i]
        );
        continue;
      }
      this.rotate_drawGhost(
        rotatePolygon(
          getInstance().drawnPolygons[this.selectedObjects[i]],
          {
            x: this.mouseStart.x * CONFIG.SCALE,
            y: this.mouseStart.y * CONFIG.SCALE,
          },
          angle
        ),
        this.selectedObjects[i],
        zi
      );
    }
  }
  rotate_mouseUp(e: MouseEvent) {
    if (this.workingState !== "ROTATE") return;
    e.preventDefault();
    e.stopPropagation();
    this.workingState = "SELECTED";
    this.rotate_applyPoly();
    getInstance().saveAsHistory();
    debug(`<SelTl> ROTATE_MOUSEUP`);
    const sv = [...this.selectedObjects];
    this.disselect();
    this.handleSelect(sv);
  }

  rotate_applyPoly() {
    if (this.bboxRotate === 0) return;
    const inst = getInstance();

    const center = {
      x: (this.bbox[0].x + this.bbox[2].x) / 2,
      y: (this.bbox[0].y + this.bbox[1].y) / 2,
    };

    for (const key of this.selectedObjects) {
      const poly = inst.drawnPolygons[key];
      inst.drawnPolygons[key] = rotatePolygon(poly, center, this.bboxRotate);
      const object = inst.drawnLayers[key].d;

      switch (object.type) {
        case "line":
          const obj = object as IDrawLine;
          obj.from = rotateLine(center, obj.from, obj.to, this.bboxRotate)[0];
          obj.to = rotateLine(center, obj.from, obj.to, this.bboxRotate)[1];
          break;
        case "image":
          const nrect = rotateRect(
            {
              height: object.height,
              width: object.width,
              rotate: object.rotate,
              x: object.left,
              y: object.top,
            },
            this.mouseStart.x * CONFIG.SCALE,
            this.mouseStart.y * CONFIG.SCALE,
            this.bboxRotate
          );
          object.left = nrect.x;
          object.top = nrect.y;
          object.width = nrect.width;
          object.height = nrect.height;
          object.rotate = nrect.rotate;

          break;
        default:
          inst.drawnLayers[key].d = {
            fillColor:
              object.fillColor === "transparent"
                ? object.strokeColor
                : object.fillColor,
            points: inst.drawnPolygons[key],
            strokeColor: "transparent",
            strokeWidth: 0,
            type: "polygon",
            z: object.z,
          };
          break;
      }
    }
  }

  rotate_bindMDN = this.rotate_mouseDown.bind(this);
  rotate_bindMMV = this.rotate_mouseMove.bind(this);
  rotate_bindMUP = this.rotate_mouseUp.bind(this);

  setupRotate(): HTMLDivElement {
    const rotateElement = document.createElement("div");
    rotateElement.classList.add("rotate");

    ael(
      rotateElement,
      ["mousedown", "touchstart", "pointerdown"],
      this.rotate_bindMDN
    );
    ael(
      rotateElement,
      ["mousemove", "touchmove", "pointermove"],
      this.rotate_bindMMV
    );
    ael(
      rotateElement,
      ["mouseup", "touchend", "pointerup"],
      this.rotate_bindMUP
    );

    return rotateElement;
  }

  bbox_mouseDown(e: MouseEvent) {
    e.stopPropagation();

    this.mouseStart = { x: e.clientX, y: e.clientY };
    this.lastApplied = { x: e.clientX, y: e.clientY };
    this.workingState = "BBOX_MOVE";

    if (this.bboxElement) this.bboxElement.style.cursor = "grabbing";
  }
  bbox_mouseMove() {}
  bbox_handleMove(e: MouseEvent) {
    const newMouse = { x: e.clientX, y: e.clientY };
    const dx = newMouse.x - this.lastApplied.x;
    const dy = newMouse.y - this.lastApplied.y;

    const inst = getInstance();

    const DO_RENDER = (() => {
      const dist = pointDistance(this.lastApplied, newMouse);
      if (dist < 5) return false;
      this.lastApplied = { x: newMouse.x, y: newMouse.y };
      return true;
    })();

    if (!DO_RENDER) return;
    const zi = zIndex();
    for (let i = 0; i < this.selectedObjects.length; i++) {
      transform(
        this.selectedObjects[i],
        dx * CONFIG.SCALE,
        dy * CONFIG.SCALE,
        zi
      );
      inst.rerender(this.selectedObjects[i]);
    }
    this.bbox_transform(dx, dy);
    this.context_drawSelected(dx, dy);
  }
  bbox_mouseUp(e: MouseEvent) {
    if (this.workingState != "BBOX_MOVE") return;
    e.stopPropagation();
    debug(`<SelTl> BBOX_MOUSEUP`);
    this.workingState = "SELECTED";

    getInstance().saveAsHistory();
    if (this.bboxElement) this.bboxElement.style.cursor = "grab";
  }

  bbox_transform(dx: number, dy: number) {
    if (!this.bboxElement) return;
    this.bboxElement!.style.left = `${
      parseFloat(this.bboxElement!.style.left) + dx
    }px`;
    this.bboxElement!.style.top = `${
      parseFloat(this.bboxElement!.style.top) + dy
    }px`;
  }

  bbox_bindMDN = this.bbox_mouseDown.bind(this);
  bbox_bindMMV = this.bbox_mouseMove.bind(this);
  bbox_bindMUP = this.bbox_mouseUp.bind(this);

  setupToolButton(
    type: "REMOVE" | "TRANSFORM" | "FLIPX" | "FLIPY" | "COPY",
    el: HTMLElement
  ) {
    el.style.position = "absolute";
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.backgroundColor = "white";
    el.style.color = "black";
    el.style.textAlign = "center";
    el.style.lineHeight = "20px";
    el.style.cursor = "pointer";
    el.style.border = "1px solid black";
    el.style.display = "flex";
    el.style.justifyContent = "center";
    el.style.alignItems = "center";
    el.style.zIndex = "10000000";
    el.style.pointerEvents = "all";

    switch (type) {
      case "REMOVE":
        el.style.left = "-30px";
        el.style.top = "0px";
        break;
      case "TRANSFORM":
        el.style.left = "-30px";
        el.style.top = "20px";
        break;
      case "FLIPX":
        el.style.left = "-30px";
        el.style.top = "40px";
        break;
      case "FLIPY":
        el.style.left = "-30px";
        el.style.top = "60px";
        break;
      case "COPY":
        el.style.right = "-30px";
        el.style.top = "0px";
        break;
    }
  }

  setupButtonEventHandler(el: HTMLElement, evHandler: () => any) {
    el.addEventListener("pointerup", (e) => {
      e.preventDefault();
      // e.stopPropagation();
      setTimeout(() => evHandler(), 3);
    });
  }

  setupRemoveButton() {
    const removeButton = document.createElement("div");
    this.setupToolButton("REMOVE", removeButton);
    this.setupButtonEventHandler(removeButton, () => {
      for (let i = 0; i < this.selectedObjects.length; i++) {
        getInstance().removeLayer(this.selectedObjects[i]);
      }
      this.disselect();
      getInstance().saveAsHistory();
    });

    removeButton.innerHTML = `<svg style="width: 20px; height: 20px;"  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;

    return removeButton;
  }

  setupTransformButton() {
    const transformButton = document.createElement("div");
    this.setupToolButton("TRANSFORM", transformButton);
    this.setupButtonEventHandler(transformButton, () => {
      const modal = new CoordinateInputModal(
        (resu) => {
          if (resu === null) return;
          const inst = getInstance();
          this.context_drawSelected(resu.x, resu.y);
          for (let i = 0; i < this.selectedObjects.length; i++) {
            inst.transform(this.selectedObjects[i], resu.x, resu.y);
            inst.rerender(this.selectedObjects[i]);
          }
          getInstance().saveAsHistory();
          this.bbox_transform(resu.x / CONFIG.SCALE, resu.y / CONFIG.SCALE);
        },
        "이동",
        "상대적 좌표가 필요합니다"
      );
      modal.open();
    });

    transformButton.innerHTML = `<svg style="width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M440-40v-167l-44 43-56-56 140-140 140 140-56 56-44-43v167h-80ZM220-340l-56-56 43-44H40v-80h167l-43-44 56-56 140 140-140 140Zm520 0L600-480l140-140 56 56-43 44h167v80H753l43 44-56 56Zm-260-80q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0-180L340-740l56-56 44 43v-167h80v167l44-43 56 56-140 140Z"/></svg>`;

    return transformButton;
  }

  setupFlipXButton() {
    const flipXButton = document.createElement("div");
    this.setupToolButton("FLIPX", flipXButton);
    this.setupButtonEventHandler(flipXButton, () => {
      const nzi = zIndex();
      const bbox = computeBoundingRectangle(
        this.selectedObjects.map((key) => getInstance().drawnPolygons[key])
      );
      for (const key of this.selectedObjects) {
        (() => {
          getInstance()
            .flipX(key, bbox[0].x + (bbox[2].x - bbox[0].x) / 2, nzi)
            .then(() => {
              getInstance().rerender(key);
            });
        })();
      }

      getInstance().saveAsHistory();
      this.context_drawSelected(0, 0);
    });

    flipXButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M360-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160v80H200v560h160v80Zm80 80v-880h80v880h-80Zm160-80v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80q0 33-23.5 56.5T760-120Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80q33 0 56.5 23.5T840-760h-80Z"/></svg>`;

    return flipXButton;
  }

  setupFlipYButton() {
    const flipYButton = document.createElement("div");
    this.setupToolButton("FLIPY", flipYButton);
    this.setupButtonEventHandler(flipYButton, () => {
      const nzi = zIndex();
      const bbox = computeBoundingRectangle(
        this.selectedObjects.map((key) => getInstance().drawnPolygons[key])
      );
      for (const key of this.selectedObjects) {
        (() => {
          getInstance()
            .flipY(key, bbox[0].y + (bbox[2].y - bbox[0].y) / 2, nzi)
            .then(() => {
              getInstance().rerender(key);
            });
        })();
      }

      getInstance().saveAsHistory();
      this.context_drawSelected(0, 0);
    });

    flipYButton.innerHTML = `<svg style="rotate: 90deg;" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M360-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160v80H200v560h160v80Zm80 80v-880h80v880h-80Zm160-80v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80q0 33-23.5 56.5T760-120Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80q33 0 56.5 23.5T840-760h-80Z"/></svg>`;

    return flipYButton;
  }

  setupCopyButton() {
    const copyButton = document.createElement("div");
    this.setupToolButton("COPY", copyButton);
    this.setupButtonEventHandler(copyButton, () => {
      let id: string[] = [];
      for (let i = 0; i < this.selectedObjects.length; i++) {
        id.push(
          fabricAdd(getInstance().drawnLayers[this.selectedObjects[i]].d)
        );
      }
      this.disselect();
      this.handleSelect(id);

      getInstance().saveAsHistory();
    });

    copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>`;

    return copyButton;
  }

  setupBBox(bbox: Polygon) {
    this.bboxRotate = 0;
    const bboxElement = document.createElement("div");
    bboxElement.classList.add("bbox");

    bboxElement.style.left = `${bbox[0].x / CONFIG.SCALE}px`;
    bboxElement.style.top = `${bbox[0].y / CONFIG.SCALE}px`;
    bboxElement.style.width = `${(bbox[2].x - bbox[0].x) / CONFIG.SCALE}px`;
    bboxElement.style.height = `${(bbox[1].y - bbox[0].y) / CONFIG.SCALE}px`;

    bboxElement.appendChild(this.setupRotate());

    bboxElement.appendChild(this.setupResize());
    bboxElement.appendChild(this.setupRemoveButton());
    bboxElement.appendChild(this.setupTransformButton());
    bboxElement.appendChild(this.setupFlipXButton());
    bboxElement.appendChild(this.setupFlipYButton());
    bboxElement.appendChild(this.setupCopyButton());

    this.wk.appendChild(bboxElement);
    this.bboxElement = bboxElement;

    ael(
      this.bboxElement,
      ["mousedown", "touchstart", "pointerdown"],
      this.bbox_bindMDN
    );
    ael(
      this.bboxElement,
      ["mousemove", "touchmove", "pointermove"],
      this.bbox_bindMMV
    );
    ael(
      this.bboxElement,
      ["mouseup", "touchend", "pointerup"],
      this.bbox_bindMUP
    );
  }

  destroyBBox() {
    if (this.bboxElement) {
      this.wk.removeChild(this.bboxElement);
      this.bboxElement = null;
    }
  }
  disselect() {
    debug(`<SelTl> Disselect`);
    this.selectedObjects = [];
    this.destroyBBox();
    this.allowDrawing();
    this.workingState = "NONE";
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  selectedObjects: string[] = [];

  handleSelect(selected: string[]) {
    this.selectedObjects = selected;
    const inst = getInstance();

    let polygons = selected.map((key) => inst.drawnPolygons[key]);
    let bbox = computeBoundingRectangle(polygons);

    this.disallowDrawing();
    this.setupBBox(bbox);
  }

  canvas_state = {
    dragging: false,
    polygon: [] as { x: number; y: number }[],
    lastPos: { x: 0, y: 0 },
  };
  canvas_initState() {
    this.canvas_state.dragging = false;
    this.canvas_state.polygon = [];
    this.canvas_state.lastPos = { x: 0, y: 0 };
  }
  canvas_mouseDown(e: MouseEvent) {
    this.workingState = "SELECTING";
    this.canvas_state.dragging = true;
    this.canvas_state.polygon = [];
    this.canvas_state.polygon.push({
      x: (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE,
      y: (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE,
    });
    this.canvas_state.lastPos = {
      x: this.canvas_state.polygon[0].x,
      y: this.canvas_state.polygon[0].y,
    };
  }
  canvas_mouseMove(e: MouseEvent) {
    if (!this.canvas_state.dragging) return;
    if (this.workingState !== "SELECTING") return;
    const x = (e.clientX - this.canvas.offsetLeft) * CONFIG.SCALE;
    const y = (e.clientY - this.canvas.offsetTop) * CONFIG.SCALE;

    const dx = x - this.canvas_state.lastPos.x;
    const dy = y - this.canvas_state.lastPos.y;
    if (dx * dx + dy * dy < 25 ** 2 * CONFIG.SCALE) return;

    this.canvas_state.polygon.push({ x, y });
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = "rgb(0, 0, 0)";
    this.context.fillStyle = hslColor(0.3);
    this.context.lineWidth = 3 * CONFIG.SCALE;
    this.context.setLineDash([6, 9]);
    this.context.beginPath();
    this.context.moveTo(
      this.canvas_state.polygon[0].x,
      this.canvas_state.polygon[0].y
    );
    for (let i = 1; i < this.canvas_state.polygon.length; i++) {
      this.context.lineTo(
        this.canvas_state.polygon[i].x,
        this.canvas_state.polygon[i].y
      );
    }
    this.context.closePath();
    this.context.stroke();
    this.context.fill();
    this.context.setLineDash([]);

    this.canvas_state.lastPos = { x, y };
  }
  canvas_mouseUp() {
    if (!this.canvas_state.dragging) return;
    this.canvas_state.dragging = false;
    this.workingState = "SELECTED";
    debug(`<SelTl> CV MouseUp with ${this.canvas_state.polygon.length} points`);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const inst = getInstance();
    const keys = Object.keys(inst.drawnPolygons);
    const selected: string[] = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const poly = inst.drawnPolygons[key];
      const area = polygonArea(poly);
      const inter = intersect(this.canvas_state.polygon, poly);

      this.context.fillStyle = hslColor(0.3);
      this.context.lineWidth = 2 * CONFIG.SCALE;

      if (inter.length === 0) continue;

      let sumArea = 0;
      for (let j = 0; j < inter.length; j++) {
        sumArea += polygonArea(inter[j]);
      }
      const ratio = sumArea / area;
      if (ratio < CONFIG.SELECT_RATIO) continue;

      selected.push(key);
    }
    if (selected.length === 0) return;
    this.handleSelect(selected);
    this.context_drawSelected();
  }

  apply() {
    debug(`<SelTl> Apply`);

    const mdn = this.canvas_mouseDown.bind(this);
    const mmv = this.canvas_mouseMove.bind(this);
    const mup = this.canvas_mouseUp.bind(this);

    this.canvas_initState();
    ael(this.canvas, ["mousedown", "touchstart", "pointerdown"], mdn);
    ael(this.canvas, ["mousemove", "touchmove", "pointermove"], mmv);
    ael(document, ["mouseup", "touchend", "pointerup"], mup);

    return () => {
      rel(this.canvas, ["mousedown", "touchstart", "pointerdown"], mdn);
      rel(this.canvas, ["mousemove", "touchmove", "pointermove"], mmv);
      rel(document, ["mouseup", "touchend", "pointerup"], mup);

      this.allowDrawing();
      this.destroyBBox();
      this.disselect();
    };
  }
}
