import CONFIG from "./config";

export const createCanvas: () => [
  HTMLCanvasElement,
  CanvasRenderingContext2D
] = () => {
  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return [null, null] as any;
  }

  // Set canvas size to window size
  canvas.width = window.innerWidth * CONFIG.SCALE;
  canvas.height = window.innerHeight * CONFIG.SCALE;

  return [canvas, ctx] as const;
};
