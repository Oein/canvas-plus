import computeStrokeOutline from "../algorithm/outStrokePolygon";
import { generateStrokedPolygon } from "../algorithm/penPolygon";
import { Polygon, polygonArea } from "../algorithm/polygon";
import calculateRectangleCorners from "../algorithm/rotatedRect";
import createThickPolygon from "../algorithm/strokePolygon";
import {
  IDraw,
  IDrawImage,
  IDrawLine,
  IDrawPolygon,
  IDrawRect,
  IDrawTriangle,
} from "../types/draw";
import CONFIG from "../utils/config";
import { createCanvas } from "../utils/createCanvas";
import debug from "../utils/debugMsg";
import zIndex from "../utils/zIndexManager";

type IDrawnLayer = {
  // canvas
  c: HTMLCanvasElement;
  // ctx
  t: CanvasRenderingContext2D;
  // draw object
  d: IDraw;
};

type IDrawnHistory = {
  // canvas
  c: HTMLCanvasElement;
  // ctx
  t: CanvasRenderingContext2D;
  // draw object
  d: string;
};

export default class Instance {
  instanceElement: HTMLDivElement;
  drawnLayerParent: HTMLDivElement;
  drawnLayers: { [key: string]: IDrawnLayer } = {};
  drawnPolygons: { [key: string]: Polygon } = {};

  history: {
    idraw: { [key: string]: IDrawnHistory };
    ipoly: { [key: string]: Polygon };
  }[] = [
    {
      idraw: {},
      ipoly: {},
    },
  ];

  clonedLayer() {
    // @ts-ignore
    let ret: { [key: string]: IDrawnHistory } = {};
    const keys = Object.keys(this.drawnLayers);
    for (const key of keys) {
      ret[key] = {
        c: this.drawnLayers[key].c,
        t: this.drawnLayers[key].t,
        d: JSON.stringify(this.drawnLayers[key].d),
      };
    }
    return ret;
  }

  saveAsHistory() {
    this.history.push({
      idraw: this.clonedLayer(),
      ipoly: { ...this.drawnPolygons },
    });
    if (this.history.length > CONFIG.MAX_HISTORY) {
      this.history.shift();
    }
  }

  drawnHistory2drawnLayer(history: { [key: string]: IDrawnHistory }): {
    [key: string]: IDrawnLayer;
  } {
    // @ts-ignore
    const ret: { [key: string]: IDrawnLayer } = {};
    const keys = Object.keys(history);
    for (const key of keys) {
      // @ts-ignore
      ret[key] = {
        c: history[key].c,
        t: history[key].t,
        d: JSON.parse(history[key].d),
      };
    }

    return ret;
  }

  undo() {
    if (this.history.length < 2) {
      return;
    }
    this.history.pop();
    let history = this.history[this.history.length - 1];
    if (!history) {
      return;
    }

    const keys = Object.keys(this.drawnLayers);
    debug(`<Insta> Undo ${keys.length} objects`);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      this.removeLayer(key);
    }

    this.drawnLayers = this.drawnHistory2drawnLayer(history.idraw);
    this.drawnPolygons = history.ipoly;
    const keys2 = Object.keys(this.drawnLayers);
    for (let i = 0; i < keys2.length; i++) {
      const key = keys2[i];
      const layer = this.drawnLayers[key];
      this.drawnLayerParent.appendChild(layer.c);
      this.render(layer.t, layer.d, key, false);
    }
  }

  constructor(importData?: ArrayBuffer) {
    this.instanceElement = document.createElement("div");
    this.instanceElement.className = "instance";

    this.drawnLayerParent = document.createElement("div");
    this.drawnLayerParent.className = "drawn-layer-parent";
    this.instanceElement.appendChild(this.drawnLayerParent);

    if (importData) {
      this.importInstance(importData);
    }
  }

  drawLine(object: IDrawLine, context: CanvasRenderingContext2D): Polygon {
    context.strokeStyle = object.strokeColor;
    context.lineWidth = object.strokeWidth;
    context.setLineDash(object.strokeDashArray);
    context.beginPath();
    context.moveTo(object.from.x, object.from.y);
    context.lineTo(object.to.x, object.to.y);
    context.stroke();

    context.setLineDash([]);

    return [object.from, object.to];
  }

  drawRect(object: IDrawRect): Polygon {
    // context.strokeStyle = object.strokeColor;
    // context.fillStyle = object.fillColor;
    // context.lineWidth = object.strokeWidth;
    // context.beginPath();
    // context.rect(
    //   object.leftTop.x,
    //   object.leftTop.y,
    //   object.width,
    //   object.height
    // );
    // context.stroke();
    // context.fill();

    return [
      object.leftTop,
      { x: object.leftTop.x + object.width, y: object.leftTop.y },
      {
        x: object.leftTop.x + object.width,
        y: object.leftTop.y + object.height,
      },
      { x: object.leftTop.x, y: object.leftTop.y + object.height },
    ];
  }

  drawTriangle(object: IDrawTriangle): Polygon {
    // context.strokeStyle = object.strokeColor;
    // context.fillStyle = object.fillColor;
    // context.lineWidth = object.strokeWidth;
    // context.beginPath();
    // context.moveTo(object.points[0].x, object.points[0].y);
    // context.lineTo(object.points[1].x, object.points[1].y);
    // context.lineTo(object.points[2].x, object.points[2].y);
    // context.closePath();
    // context.stroke();
    // context.fill();

    return object.points;
  }

  drawImage(object: IDrawImage, context: CanvasRenderingContext2D): Polygon {
    context.save();
    const poly = calculateRectangleCorners(
      object.left + object.width / 2,
      object.top + object.height / 2,
      object.width,
      object.height,
      object.rotate
    );

    let xAvg = 0;
    let yAvg = 0;
    for (let i = 0; i < poly.length; i++) {
      xAvg += poly[i].x;
      yAvg += poly[i].y;
    }
    xAvg /= poly.length;
    yAvg /= poly.length;

    context.translate(xAvg, yAvg);
    context.rotate((object.rotate * Math.PI) / 180);
    context.translate(-xAvg, -yAvg);
    // debug(
    //   `<Insta> Draw image ${object.left.toFixed(3)} ${object.top.toFixed(
    //     3
    //   )} ${xAvg.toFixed(3)} ${yAvg.toFixed(3)}`
    // );
    context.drawImage(
      object.image,
      object.left,
      object.top,
      object.width,
      object.height
    );
    context.restore();

    return poly;
  }

  drawPoly(object: IDrawPolygon): Polygon {
    return object.points;
  }

  drawPolyToCanvas(object: IDrawPolygon, context: CanvasRenderingContext2D) {
    context.lineCap = "round";
    context.strokeStyle = object.strokeColor;
    context.fillStyle = object.fillColor;
    context.lineWidth = object.strokeWidth;
    context.beginPath();
    context.moveTo(object.points[0].x, object.points[0].y);
    for (let i = 1; i < object.points.length; i++) {
      context.lineTo(object.points[i].x, object.points[i].y);
    }
    context.closePath();
    context.stroke();
    context.fill();
    context.lineCap = "butt";

    // add points
    // context.fillStyle = "red";
    // context.strokeStyle = "red";
    // for (let i = 0; i < object.points.length; i++) {
    //   context.beginPath();
    //   context.arc(object.points[i].x, object.points[i].y, 4, 0, 2 * Math.PI);
    //   context.fill();
    //   context.stroke();
    // }
  }

  rerender(id: string) {
    const layer = this.drawnLayers[id];
    if (!layer) return;
    const context = layer.t;
    context.clearRect(0, 0, layer.c.width, layer.c.height);
    let object = layer.d;

    if (object.type == "pen") {
      debug(`<Insta> Rerender pen ${id}`);
      context.strokeStyle = object.strokeColor;
      context.lineWidth = object.strokeWidth;
      context.beginPath();
      context.moveTo(object.points[0].x, object.points[0].y);
      for (let i = 1; i < object.points.length; i++) {
        context.lineTo(object.points[i].x, object.points[i].y);
      }
      context.stroke();
      this.drawnPolygons[id] = generateStrokedPolygon(
        object.points,
        object.strokeWidth
      );
      return;
    }

    let polygon: Polygon = [];

    switch (object.type) {
      case "line":
        polygon = createThickPolygon(
          this.drawLine(object, context),
          object.strokeWidth
        );
        break;
      case "rect":
        polygon = this.drawRect(object);
        break;
      case "triangle":
        polygon = this.drawTriangle(object);
        break;
      case "image":
        polygon = this.drawImage(object, context);
        break;
      case "polygon":
        polygon = this.drawPoly(object);
        break;
    }

    const area = polygonArea(polygon);
    if (area < (CONFIG.SCALE * 5) ** 2) {
      layer.c.remove();
      delete this.drawnLayers[id];
      return;
    }

    if (object.type != "image" && object.type != "line") {
      layer.d = {
        fillColor:
          object.fillColor === "transparent"
            ? object.strokeColor
            : object.fillColor,
        points: polygon,
        strokeColor: "transparent",
        strokeWidth: 0,
        type: "polygon",
        z: object.z,
      };
      this.drawnLayers[id].d = layer.d;
      // draw as polygon
      this.drawPolyToCanvas(layer.d, context);
    }

    this.drawnPolygons[id] = polygon;
  }

  transform(id: string, dx: number, dy: number, nzi?: number) {
    if (typeof nzi === "number") {
      this.drawnLayers[id].c.style.zIndex = nzi.toString();
      this.drawnLayers[id].d.z = nzi;
    }
    this.drawnPolygons[id] = this.drawnPolygons[id].map((p) => {
      return { x: p.x + dx, y: p.y + dy };
    });
    if (this.drawnLayers[id].d.type === "image") {
      this.drawnLayers[id].d.left += dx;
      this.drawnLayers[id].d.top += dy;
    }
    if (this.drawnLayers[id].d.type === "rect") {
      this.drawnLayers[id].d.leftTop.x += dx;
      this.drawnLayers[id].d.leftTop.y += dy;
    }
    if (this.drawnLayers[id].d.type === "triangle") {
      this.drawnLayers[id].d.points = this.drawnLayers[id].d.points.map((p) => {
        return { x: p.x + dx, y: p.y + dy };
      });
    }
    if (this.drawnLayers[id].d.type === "polygon") {
      this.drawnLayers[id].d.points = this.drawnLayers[id].d.points.map((p) => {
        return { x: p.x + dx, y: p.y + dy };
      });
    }
    if (this.drawnLayers[id].d.type === "line") {
      this.drawnLayers[id].d.from.x += dx;
      this.drawnLayers[id].d.from.y += dy;
      this.drawnLayers[id].d.to.x += dx;
      this.drawnLayers[id].d.to.y += dy;
    }
    if (this.drawnLayers[id].d.type === "pen") {
      this.drawnLayers[id].d.points = this.drawnLayers[id].d.points.map((p) => {
        return { x: p.x + dx, y: p.y + dy };
      });
    }
  }

  async flipX(id: string, flipCenterX: number, nzi?: number) {
    const layer = this.drawnLayers[id];
    if (!layer) return;

    if (typeof nzi === "number") {
      this.drawnLayers[id].c.style.zIndex = nzi.toString();
      this.drawnLayers[id].d.z = nzi;
    }

    this.drawnPolygons[id] = this.drawnPolygons[id].map((p) => {
      return { x: flipCenterX - (p.x - flipCenterX), y: p.y };
    });

    if (layer.d.type === "image") {
      // flip image
      const img = layer.d.image;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.translate(img.width, 0);
      context.scale(-1, 1);
      context.drawImage(img, 0, 0);
      // get image data
      const imgData = canvas.toDataURL("image/webp");
      const newImg = new Image();
      newImg.src = imgData;
      layer.d.image = newImg;
      await new Promise((res) => {
        newImg.onload = res;
      });

      // flip object
      layer.d.left = flipCenterX - (layer.d.left - flipCenterX) - layer.d.width;
    }

    if (layer.d.type === "rect") {
      layer.d.leftTop.x =
        flipCenterX - (layer.d.leftTop.x - flipCenterX) - layer.d.width;
    }

    if (layer.d.type === "triangle") {
      layer.d.points = layer.d.points.map((p) => {
        return { x: flipCenterX - (p.x - flipCenterX), y: p.y };
      });
    }

    if (layer.d.type === "polygon") {
      layer.d.points = layer.d.points.map((p) => {
        return { x: flipCenterX - (p.x - flipCenterX), y: p.y };
      });
    }

    if (layer.d.type === "line") {
      layer.d.from.x = flipCenterX - (layer.d.from.x - flipCenterX);
      layer.d.to.x = flipCenterX - (layer.d.to.x - flipCenterX);
    }

    if (layer.d.type === "pen") {
      layer.d.points = layer.d.points.map((p) => {
        return { x: flipCenterX - (p.x - flipCenterX), y: p.y };
      });
    }
  }

  async flipY(id: string, flipCenterY: number, nzi?: number) {
    const layer = this.drawnLayers[id];
    if (!layer) return;

    if (typeof nzi === "number") {
      this.drawnLayers[id].c.style.zIndex = nzi.toString();
      this.drawnLayers[id].d.z = nzi;
    }

    this.drawnPolygons[id] = this.drawnPolygons[id].map((p) => {
      return { x: p.x, y: flipCenterY - (p.y - flipCenterY) };
    });

    if (layer.d.type === "image") {
      // flip image
      const img = layer.d.image;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.translate(0, img.height);
      context.scale(1, -1);
      context.drawImage(img, 0, 0);
      // get image data
      const imgData = canvas.toDataURL("image/webp");
      const newImg = new Image();
      newImg.src = imgData;
      layer.d.image = newImg;
      await new Promise((res) => {
        newImg.onload = res;
      });

      // flip object
      layer.d.top = flipCenterY - (layer.d.top - flipCenterY) - layer.d.height;
    }

    if (layer.d.type === "rect") {
      layer.d.leftTop.y =
        flipCenterY - (layer.d.leftTop.y - flipCenterY) - layer.d.height;
    }

    if (layer.d.type === "triangle") {
      layer.d.points = layer.d.points.map((p) => {
        return { x: p.x, y: flipCenterY - (p.y - flipCenterY) };
      });
    }

    if (layer.d.type === "polygon") {
      layer.d.points = layer.d.points.map((p) => {
        return { x: p.x, y: flipCenterY - (p.y - flipCenterY) };
      });
    }

    if (layer.d.type === "line") {
      layer.d.from.y = flipCenterY - (layer.d.from.y - flipCenterY);
      layer.d.to.y = flipCenterY - (layer.d.to.y - flipCenterY);
    }

    if (layer.d.type === "pen") {
      layer.d.points = layer.d.points.map((p) => {
        return { x: p.x, y: flipCenterY - (p.y - flipCenterY) };
      });
    }
  }

  render(
    canvas: string | CanvasRenderingContext2D,
    object: IDraw,
    objectid: string,
    saveDrawnPoly = true,
    clear = true
  ) {
    if (typeof canvas === "string") {
      canvas = this.drawnLayers[canvas].t;
    }

    if (typeof canvas == "string") return;
    if (clear)
      canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    canvas.canvas.style.zIndex = (object.z || zIndex()).toString();

    if (object.type == "pen") {
      debug(`<Insta> Render pen ${objectid}`);
      canvas.strokeStyle = object.strokeColor;
      canvas.lineWidth = object.strokeWidth;
      canvas.beginPath();
      canvas.moveTo(object.points[0].x, object.points[0].y);
      for (let i = 1; i < object.points.length; i++) {
        canvas.lineTo(object.points[i].x, object.points[i].y);
      }
      canvas.stroke();

      if (saveDrawnPoly)
        this.drawnPolygons[objectid] = generateStrokedPolygon(
          object.points,
          object.strokeWidth
        );
      return;
    }

    let polygon: Polygon = [];

    switch (object.type) {
      case "line":
        polygon = createThickPolygon(
          this.drawLine(object, canvas),
          object.strokeWidth
        );
        break;
      case "rect":
        polygon = this.drawRect(object);
        break;
      case "triangle":
        polygon = this.drawTriangle(object);
        break;
      case "image":
        polygon = this.drawImage(object, canvas);
        break;
      case "polygon":
        polygon = this.drawPoly(object);
        break;
    }

    if ("fillColor" in object && object.type != "polygon") {
      if (object.fillColor === "transparent") {
        polygon = createThickPolygon(polygon, object.strokeWidth);
      } else {
        polygon = computeStrokeOutline(polygon, object.strokeWidth / 2);
      }
    }

    const area = polygonArea(polygon);
    if (area <= 1) {
      return;
    }

    if (object.type != "image" && object.type != "line") {
      object = {
        fillColor:
          object.fillColor === "transparent"
            ? object.strokeColor
            : object.fillColor,
        points: polygon,
        strokeColor: "transparent",
        strokeWidth: 0,
        type: "polygon",
        z: object.z,
      };
      if (saveDrawnPoly) this.drawnLayers[objectid].d = object;
      // draw as polygon
      this.drawPolyToCanvas(object, canvas);
    }

    debug(`<Insta> Render ${object.type} ${objectid}`);
    if (saveDrawnPoly) this.drawnPolygons[objectid] = polygon;
  }

  fabricAdd(object: IDraw) {
    const id = Math.random().toString(36).substr(2, 9);

    debug(`<Insta> Add ${object.type} ${id}`);

    object.z = object.z || zIndex();

    const [drawCanvas, context] = createCanvas(() => {
      this.rerender(id);
    });
    drawCanvas.style.position = "absolute";
    drawCanvas.style.top = "0";
    drawCanvas.style.left = "0";
    drawCanvas.style.zIndex = object.z.toString();
    drawCanvas.setAttribute("data-id", id);

    this.drawnLayerParent.appendChild(drawCanvas);
    this.drawnLayers[id] = {
      c: drawCanvas,
      t: context,
      d: object,
    };

    this.render(context, object, id);

    return id;
  }

  removeLayer(id: string) {
    const layer = this.drawnLayers[id];
    if (!layer) return;
    layer.c.remove();
    delete this.drawnLayers[id];
    delete this.drawnPolygons[id];
  }

  async exportInstance() {
    const exportData: string[] = [];
    const imageList: ArrayBuffer[] = [];
    const values = Object.values(this.drawnLayers);
    for (let i = 0; i < values.length; i++) {
      const layer = values[i];

      if (layer.d.type === "image") {
        // image to base64
        const canvas = document.createElement("canvas");
        canvas.width = layer.d.image.width;
        canvas.height = layer.d.image.height;
        const context = canvas.getContext("2d");
        if (!context) continue;
        context.drawImage(layer.d.image, 0, 0);
        const blob = new Promise<Blob>((res) => {
          canvas.toBlob((blob) => {
            res(blob!);
          }, "image/webp");
        });
        imageList.push(await (await blob).arrayBuffer());
        exportData.push(
          JSON.stringify({ idx: imageList.length - 1, ...layer.d })
        );
        continue;
      }
      exportData.push(JSON.stringify(layer.d));
    }
    const arrayBuffer: number[] = [];
    arrayBuffer.push(...new TextEncoder().encode(imageList.length + "\n"));
    imageList.forEach((v) => {
      let u8a = new Uint8Array(v);
      const padLength_to_36 = u8a.byteLength.toString(36).padStart(10, "0");
      arrayBuffer.push(...new TextEncoder().encode(padLength_to_36));
      // append by 1024 * 8 size chunks
      while (u8a.length > 0) {
        const chunk = u8a.slice(0, 1024 * 8);
        u8a = u8a.slice(1024 * 8);
        arrayBuffer.push(...chunk);
      }
    });
    const exportDataStr = exportData.join(";");
    arrayBuffer.push(...new TextEncoder().encode(exportDataStr));
    return new Uint8Array(arrayBuffer).buffer;
  }

  async importInstance(importData: ArrayBuffer) {
    let imgCntStr = "";
    // read until \n
    for (let i = 0; i < importData.byteLength; i++) {
      if (
        String.fromCharCode(new Uint8Array(importData.slice(i, i + 1))[0]) ===
        "\n"
      ) {
        imgCntStr = String.fromCharCode(
          ...new Uint8Array(importData.slice(0, i))
        );
        importData = importData.slice(i + 1);
        break;
      }
    }
    const imgCnt = Number(imgCntStr);
    if (imgCnt > 0) importData = importData.slice(1);
    const images: string[] = [];
    for (let i = 0; i < imgCnt; i++) {
      // read 10 characters
      const lengthStr = String.fromCharCode(
        ...new Uint8Array(importData.slice(0, 9))
      );
      const length = parseInt(lengthStr, 36);
      // slice 2 unit8array
      const arrayBuffer = new ArrayBuffer(length);
      const view = new Uint8Array(arrayBuffer);
      view.set(new Uint8Array(importData.slice(9, 9 + length)));
      importData = importData.slice(9 + length + (i == imgCnt - 1 ? 0 : 1));

      // @ts-ignore
      const blob = new Blob([arrayBuffer], {
        type: "image/webp",
      });
      const url = URL.createObjectURL(blob);
      images.push(url);
    }
    const u8a = new Uint8Array(importData);
    const importDataStr = String.fromCharCode(...u8a);
    const layers = importDataStr.split(";");
    for (let i = 0; i < layers.length; i++) {
      let layer = layers[i];
      const object = JSON.parse(layer) as IDraw;

      if (object.type === "image") {
        const img = new Image();
        img.src = images[(object as any).idx];
        await new Promise((res) => {
          img.onload = res;
        });
        object.image = img;
        delete (object as any).idx;
      }

      const id = this.fabricAdd(object);
      if (!id) continue;
    }
  }

  async exportImage() {
    const [canvas, context] = createCanvas();

    let keys = Object.keys(this.drawnLayers).map((v, i) => [v, i]);
    // sort by zIndex and original order
    keys = keys.sort((a, b) => {
      return (
        // @ts-ignore
        this.drawnLayers[a[0]].d.z - this.drawnLayers[b[0]].d.z || a[1] - b[1]
      );
    });

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    debug(`<Insta> Export ${keys.length} objects to image`);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i][0] as string;
      const layer = this.drawnLayers[key];
      if (!layer) continue;
      this.render(context, layer.d, key, false, false);
    }

    return canvas.toDataURL("image/png");
  }
}
