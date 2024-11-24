import "./style.css";
import { getState, setState } from "./utils/state";

import { createCanvas } from "./utils/createCanvas";

import { LineTool } from "./tools/lineTool";
import { OvalTool } from "./tools/ovalTool";
import { RectTool } from "./tools/rectTool";
import { TriangleTool } from "./tools/triangleTool";
import { IDraw } from "./types/draw";
import Instance from "./instance";
import { SelectTool } from "./tools/selectTool";
import zIndex from "./utils/zIndexManager";
import { EraseTool } from "./tools/eraseTool";

// const inst = await (false
//   ? await fetch("/nocanvas.bin")
//   : await fetch("/7753b615-0930-4147-ba39-e220fdb1a3f2")
// ).arrayBuffer();

const instances: Instance[] = [new Instance()];
let currentInstance = 0;
export let getInstance = () => instances[currentInstance];
export let fabricAdd = (object: IDraw) => {
  instances[currentInstance].fabricAdd(object);
  console.log("Add object!", currentInstance, object);
};

export let exportInstance = async () => {
  const str = await instances[0].exportInstance();
  // blob
  const blob = new Blob([str], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  return url;
};

(window as any).exportInstance = exportInstance;
(window as any).instances = instances;

const main = () => {
  const app = document.getElementById("app") as HTMLDivElement;

  document.addEventListener("keydown", (e) => {
    // shift
    if (e.shiftKey) {
      setState("SHIFT", true);
    }
  });
  document.addEventListener("keyup", (e) => {
    // shift
    if (!e.shiftKey) {
      setState("SHIFT", false);
    }
  });
  document.getElementById("selectTool")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
  });

  const [drawCanvas, context] = createCanvas();
  drawCanvas.id = "draw-layer";
  drawCanvas.addEventListener("mousedown", () => {
    document.getElementById("disup")?.classList.add("hide");
  });
  drawCanvas.addEventListener("mouseup", () => {
    document.getElementById("disup")?.classList.remove("hide");
  });
  document.getElementById("drawnLayer")?.appendChild(drawCanvas);

  const drawnLayer = document.getElementById("drawnLayer");
  if (!drawnLayer) return;
  drawnLayer.appendChild(instances[0].instanceElement);

  // paste image
  const pasteImage = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === -1) continue;
      const blob = items[i].getAsFile();
      if (!blob) continue;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const [width, height] = [img.width, img.height];
          let scale = 1;
          if (width > window.innerWidth) {
            scale = window.innerWidth / width;
          }
          if (height * scale > window.innerHeight) {
            scale = window.innerHeight / height;
          }
          fabricAdd({
            type: "image",
            image: img,
            left: 0,
            top: 0,
            rotate: 0,
            width: width * scale,
            height: height * scale,
            z: zIndex(),
          });
        };
      };
      reader.readAsDataURL(blob);
    }
  };
  document.addEventListener("paste", pasteImage);

  const props = {
    canvas: drawCanvas,
    context,
    app,
  };
  let tools = [
    new SelectTool(props),
    new LineTool(props),
    new LineTool(props),
    new RectTool(props),
    new OvalTool(props),
    new TriangleTool(props),
    new EraseTool(props),
  ];

  let currentTool = 1;
  let disap = tools[currentTool].apply();

  const buttons = document.querySelectorAll("button.tool-button");
  buttons[currentTool].classList.add("active");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      buttons[currentTool].classList.remove("active");
      buttons[i].classList.add("active");
      disap();
      currentTool = i;
      disap = tools[currentTool].apply();
    });
  }

  const toggles = document.querySelectorAll("button.toggle-button");
  for (let i = 0; i < toggles.length; i++) {
    const attr = toggles[i].getAttribute("data-config");
    if (!attr) continue;

    const value = getState(attr);
    if (value) {
      toggles[i].classList.add("active");
    }

    toggles[i].addEventListener("click", () => {
      const value = !getState(attr);
      setState(attr, value);
      if (value) {
        toggles[i].classList.add("active");
      } else {
        toggles[i].classList.remove("active");
      }
    });
  }

  console.log("Load instance!");
  // instances[0].importInstance(inst);

  document.getElementById("export")?.addEventListener("click", async () => {
    const url = await exportInstance();
    const a = document.createElement("a");
    a.href = url;
    a.download = "instance.bin";
    a.click();
  });

  document.getElementById("import")?.addEventListener("click", async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".bin";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const buffer = await file.arrayBuffer();
      instances[0].importInstance(buffer);
    };
    input.click();
  });

  document.getElementById("color")?.addEventListener("change", (e) => {
    const color = (e.target as HTMLInputElement).value;
    setState("PENCOLOR", color);
  });

  document.getElementById("stroke")?.addEventListener("change", (e) => {
    const stroke = parseInt((e.target as HTMLInputElement).value);
    setState("PENSTROKE", stroke);
  });

  const updatePageIndicator = () => {
    const indi = document.getElementById("pageindi");
    if (!indi) return;
    indi.innerHTML = `${currentInstance + 1}/${instances.length}`;

    (buttons[currentTool] as HTMLButtonElement).click();
  };

  document.getElementById("left")?.addEventListener("click", () => {
    instances[currentInstance].instanceElement.style.display = "none";
    currentInstance = Math.max(0, currentInstance - 1);
    instances[currentInstance].instanceElement.style.display = "block";
    updatePageIndicator();
  });

  document.getElementById("right")?.addEventListener("click", () => {
    instances[currentInstance].instanceElement.style.display = "none";
    if (currentInstance == instances.length - 1) {
      instances.push(new Instance());
      drawnLayer.appendChild(instances[instances.length - 1].instanceElement);
    }
    currentInstance = currentInstance + 1;
    instances[currentInstance].instanceElement.style.display = "initial";
    updatePageIndicator();
  });

  // const poly = [];

  // let i = 0;
  // setInterval(() => {
  //   if (i == 0) {
  //     context.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  //     context.strokeStyle = "rgb(0, 0, 0)";
  //     context.lineWidth = 3 * 1;
  //     context.setLineDash([]);
  //     context.beginPath();
  //     context.moveTo(poly[0].x, poly[0].y);
  //     i++;
  //     return;
  //   }
  //   context.lineTo(poly[i].x, poly[i].y);
  //   context.stroke();
  //   i++;
  //   i %= poly.length;
  // }, 30);

  // // drawPoly([
  // //   { x: 0, y: 0 },
  // //   { x: 100, y: 50 },
  // //   { x: 200, y: 50 },
  // //   { x: 250, y: 0 },
  // // ]);
  // drawPoly(poly);

  // const drawPoly = (poly: { x: number; y: number }[]) => {
  //   poly = poly.map((p) => {
  //     return {
  //       x: p.x * 4 + 100,
  //       y: p.y * 4 + 100,
  //     };
  //   });
  //   context.strokeStyle = "rgb(0, 0, 0)";
  //   context.lineWidth = 3 * 1;
  //   context.setLineDash([]);
  //   context.beginPath();
  //   context.moveTo(poly[0].x, poly[0].y);
  //   for (let i = 1; i < poly.length; i++) {
  //     context.lineTo(poly[i].x, poly[i].y);
  //   }
  //   context.closePath();
  //   context.stroke();
  //   context.fillStyle = "rgba(15, 15, 200, 0.3)";
  //   context.fill();
  // };

  // const d = {
  //   outer: [
  //     {
  //       x: 98.88196601125007,
  //       y: 51.118033988749886,
  //     },
  //     {
  //       x: 147.9875388202502,
  //       y: 149.32917960675005,
  //     },
  //     {
  //       x: 51.001690545622594,
  //       y: 197.82210374406384,
  //     },
  //     {
  //       x: 2.2462026918718183,
  //       y: 2.8001523290607513,
  //     },
  //   ],
  //   inner: [
  //     {
  //       x: 101.11803398874993,
  //       y: 48.881966011250114,
  //     },
  //     {
  //       x: 152.0124611797498,
  //       y: 150.67082039324995,
  //     },
  //     {
  //       x: 48.998309454377406,
  //       y: 202.17789625593616,
  //     },
  //     {
  //       x: -2.2462026918718183,
  //       y: -2.8001523290607513,
  //     },
  //   ],
  // };
  // drawPoly(d.outer);
  // drawPoly(d.inner);
};
main();
