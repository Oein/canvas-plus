import "./style.css";

import { getState, setState } from "./utils/state";
import { createCanvas } from "./utils/createCanvas";
import zIndex from "./utils/zIndexManager";

import { LineTool } from "./tools/lineTool";
import { OvalTool } from "./tools/ovalTool";
import { RectTool } from "./tools/rectTool";
import { TriangleTool } from "./tools/triangleTool";
import { EraseTool } from "./tools/eraseTool";
import { PenTool } from "./tools/penTool";
import { SelectTool } from "./tools/selectTool";

import { IDraw } from "./types/draw";
import Instance from "./instance";
import TextInputModal from "./utils/textInputModal";
import renderTextToImageWebPTransparent from "./utils/twebp";
import CONFIG from "./utils/config";
import CoordinateInputModal from "./utils/xyInputModal";
import { ael } from "./utils/addEventListener";
import debug from "./utils/debugMsg";

// const inst = await (false
//   ? await fetch("/nocanvas.bin")
//   : await fetch("/7753b615-0930-4147-ba39-e220fdb1a3f2")
// ).arrayBuffer();

let instances: Instance[] = [new Instance()];
let currentInstance = 0;
export let canUpdate = false;
export let updated = () => (canUpdate = false);
export let getInstance = () => instances[currentInstance];
export let fabricAdd = (object: IDraw) => {
  return instances[currentInstance].fabricAdd(object);
};
export let transform = (id: string, dx: number, dy: number, nzi?: number) => {
  instances[currentInstance].transform(id, dx, dy, nzi);
};

export let exportInstance = async () => {
  const strs: ArrayBufferLike[] = [];
  const instanceCount = new Uint8Array(
    new TextEncoder().encode(instances.length.toString(36).padStart(10, "0"))
  );
  for (let i = 0; i < instances.length; i++) {
    const str = await instances[i].exportInstance();
    const sizeString = str.byteLength.toString(36).padStart(10, "0");
    const strArray = new Uint8Array(new TextEncoder().encode(sizeString));
    strs.push(strArray.buffer);
    strs.push(str);
  }
  // blob
  const blob = new Blob([instanceCount, ...strs], {
    type: "application/octet-stream",
  });
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
  ael(drawCanvas, ["mousedown", "touchstart", "pointerdown"], () => {
    document.getElementById("disup")?.classList.add("hide");
  });
  ael(drawCanvas, ["mouseup", "touchend", "pointerup"], () => {
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
            left: ((window.innerWidth - width * scale) / 2) * CONFIG.SCALE,
            top: ((window.innerHeight - height * scale) / 2) * CONFIG.SCALE,
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
    new PenTool(props),
    new EraseTool(props),
    new LineTool(props),
    new LineTool(props),
    new OvalTool(props),
    new TriangleTool(props),
    new RectTool(props),
  ];

  let currentTool = 0;
  let disap = tools[currentTool].apply();

  const buttons = document.querySelectorAll("button.tool-button");
  buttons[currentTool].classList.add("active");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      debug("<Headr> Tool: " + i);
      if (currentTool == 4 && i == 4) {
        // ask for new dash array
        const dashModal = new CoordinateInputModal(
          (dashArray) => {
            if (!dashArray) return;
            setState("DASHLINE", [dashArray.x, dashArray.y]);
          },
          "간격 설정",
          "기본값 (12, 18)<br />(그려지는 길이, 빈 길이) 순서 입니다."
        );
        dashModal.open();
      }
      if (currentTool == i) return;
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

  let focusedColor = 0;
  const clwrp = document.querySelectorAll(".colorwrp");
  clwrp.forEach((e, i) => {
    (e.children[0] as HTMLDivElement).style.background = (
      e.children[1] as HTMLInputElement
    ).value;

    e.addEventListener("click", () => {
      if (focusedColor == i) {
        (e.children[1] as HTMLInputElement).click();
      } else clwrp[focusedColor].classList.remove("focus");
      focusedColor = i;
      e.classList.add("focus");
      setState("PENCOLOR", (e.children[1] as HTMLInputElement).value);
    });
    e.children[1].addEventListener("input", () => {
      (e.children[0] as HTMLDivElement).style.background = (
        e.children[1] as HTMLInputElement
      ).value;
      setState("PENCOLOR", (e.children[1] as HTMLInputElement).value);
    });
  });

  const strks = document.querySelectorAll("#strokes > .strkel");
  const stsel = document.getElementById("selstk");
  const strokeSizez = [3, 9, 15];
  strks.forEach((e, i) => {
    e.addEventListener("click", () => {
      if (stsel) stsel.style.left = `calc(1.5rem * ${i})`;
      setState("PENSTROKE", strokeSizez[i]);
    });
  });

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
      debug(`<Impot> File: ${file.name}`);
      const buffer = await file.arrayBuffer();

      const instanceCount = parseInt(
        new TextDecoder().decode(new Uint8Array(buffer.slice(0, 10))),
        36
      );

      let offset = 10;
      instances.length = 0;
      debug(`<Impot> Instance Count: ${instanceCount}`);
      for (const inst of instances) {
        inst.instanceElement.remove();
      }

      instances.length = 0;
      for (let i = 0; i < instanceCount; i++) {
        const size = parseInt(
          new TextDecoder().decode(
            new Uint8Array(buffer.slice(offset, offset + 10))
          ),
          36
        );
        debug(`<Impot> Instance Size: ${size}`);
        offset += 10;
        instances.push(new Instance());
        instances[instances.length - 1].instanceElement.style.display = "none";
        drawnLayer.appendChild(instances[instances.length - 1].instanceElement);
        await instances[instances.length - 1].importInstance(
          buffer.slice(offset, offset + size)
        );

        offset += size;
      }

      currentInstance = 0;
      instances[currentInstance].instanceElement.style.display = "block";
      updatePageIndicator();

      (buttons[0] as HTMLDivElement).click();
    };
    input.click();
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
  document.getElementById("undo")?.addEventListener("click", () => {
    instances[currentInstance].undo();
  });
  document.getElementById("wincap")?.addEventListener("click", () => {
    // @ts-ignore
    window.require("electron").ipcRenderer.send("wincap");
  });

  document.getElementById("pdf")?.addEventListener("click", async (e) => {
    (e.target as HTMLButtonElement).style.background = "black";
    const pdfLinks: string[] = [];
    for (let i = 0; i < instances.length; i++) {
      pdfLinks.push(await instances[i].exportImage());
    }

    const imageW = window.innerWidth;
    const imageH = window.innerHeight;

    // @ts-ignore
    window
      // @ts-ignore
      .require("electron")
      .ipcRenderer.send("pdf", [imageW, imageH, pdfLinks]);

    (e.target as HTMLButtonElement).style.background = "";
  });

  try {
    let screenSZ = { width: 0, height: 0 };
    // @ts-ignore
    require("electron").ipcRenderer.on(
      "cap",
      (
        _e: any,
        data: {
          start: { x: number; y: number };
          end: { x: number; y: number };
        }
      ) => {
        debug(
          `<WinCP> ${data.start.x} ${data.start.y} ${data.end.x} ${data.end.y}`
        );
        // Fetch image from "image://png" then cut it by data and append it to the canvas
        const img = new Image();
        img.src = "image://png/" + Date.now();
        img.onload = () => {
          const scale = img.width / screenSZ.width;
          debug(`<WinCP> ${img.width} ${img.height} Scale ${scale}`);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) return;
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          const cut = context.getImageData(
            data.start.x * scale,
            data.start.y * scale,
            (data.end.x - data.start.x) * scale,
            (data.end.y - data.start.y) * scale
          );
          const cutCanvas = document.createElement("canvas");
          const cutContext = cutCanvas.getContext("2d");
          if (!cutContext) return;
          cutCanvas.width = (data.end.x - data.start.x) * scale;
          cutCanvas.height = (data.end.y - data.start.y) * scale;
          cutContext.putImageData(cut, 0, 0);

          const cutImg = new Image();
          cutImg.src = cutCanvas.toDataURL();
          cutImg.onload = () => {
            fabricAdd({
              type: "image",
              image: cutImg,
              left: 0,
              top: 0,
              rotate: 0,
              width: cutImg.width,
              height: cutImg.height,
              z: zIndex(),
            });
          };
        };
      }
    );

    // @ts-ignore
    require("electron").ipcRenderer.on(
      "screen",
      (
        _e: any,
        data: {
          width: number;
          height: number;
        }
      ) => {
        screenSZ = data;
      }
    );
  } catch (e) {}

  document.getElementById("textbtn")?.addEventListener("click", () => {
    const modal = new TextInputModal((text) => {
      if (!text) return;
      const imgURL = renderTextToImageWebPTransparent(text);
      const img = new Image();
      img.onload = () => {
        let [width, height] = [img.width, img.height];
        width /= CONFIG.TEXT_RES;
        height /= CONFIG.TEXT_RES;

        const GLOBAL_PADDING = CONFIG.IMAGE_GLOBAL_PADDING;

        let scale = 1;
        if (width > window.innerWidth - GLOBAL_PADDING) {
          scale = (window.innerWidth - GLOBAL_PADDING) / width;
        }
        if (height * scale > window.innerHeight - GLOBAL_PADDING) {
          scale = (window.innerHeight - GLOBAL_PADDING) / height;
        }
        debug(`<Text> ${width} ${height} ${scale}`);
        fabricAdd({
          type: "image",
          image: img,
          left: ((window.innerWidth - width * scale) / 2) * CONFIG.SCALE,
          top: ((window.innerHeight - height * scale) / 2) * CONFIG.SCALE,
          rotate: 0,
          width: width * scale * CONFIG.SCALE,
          height: height * scale * CONFIG.SCALE,
          z: zIndex(),
        });
      };
      img.src = imgURL;
      debug(`<Text> ${imgURL.slice(0, 100)}`);
    });
    modal.open();
  });

  const aniframe = () => {
    canUpdate = true;
    requestAnimationFrame(aniframe);
  };
  requestAnimationFrame(aniframe);
};
main();
