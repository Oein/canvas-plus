import CONFIG from "./config";

let canvases: [HTMLCanvasElement, any][] = [];

window.addEventListener("resize", () => {
  canvases = canvases.filter((canvas) => {
    if (document.body.contains(canvas[0])) {
      return true;
    } else {
      canvas[0].remove();
      return false;
    }
  });
  for (const canvas of canvases) {
    canvas[0].width = window.innerWidth * CONFIG.SCALE;
    canvas[0].height = window.innerHeight * CONFIG.SCALE;
    canvas[0].style.width = window.innerWidth + "px";
    canvas[0].style.height = window.innerHeight + "px";

    if (canvas[1]) {
      canvas[1]();
    }
  }
});

export const createCanvas: (
  rerenderCallback?: null | (() => any)
) => [HTMLCanvasElement, CanvasRenderingContext2D] = (
  rerenderCallback: null | (() => any) = null
) => {
  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return [null, null] as any;
  }

  // Set canvas size to window size
  canvas.width = window.innerWidth * CONFIG.SCALE;
  canvas.height = window.innerHeight * CONFIG.SCALE;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  canvases.push([canvas, rerenderCallback]);

  return [canvas, ctx] as const;
};
