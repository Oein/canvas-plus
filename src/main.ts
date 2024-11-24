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
import { PenTool } from "./tools/penTool";

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
    new PenTool(props),
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
  document.getElementById("undo")?.addEventListener("click", () => {
    instances[currentInstance].undo();
  });

  // const poly = [
  //   {
  //     x: -1943.5396657670906,
  //     y: -332.6623828722935,
  //   },
  //   {
  //     x: 1031.6814691618085,
  //     y: 749.2362116473054,
  //   },
  //   {
  //     x: 993.6836646807878,
  //     y: 722.6377485105908,
  //   },
  //   {
  //     x: 937.423513251974,
  //     y: 680.4426349389805,
  //   },
  //   {
  //     x: 879.4682461293083,
  //     y: 643.1856775029812,
  //   },
  //   {
  //     x: 818.94387983238,
  //     y: 620.2281592524222,
  //   },
  //   {
  //     x: 760.5885579601539,
  //     y: 605.6393287843656,
  //   },
  //   {
  //     x: 700.8848951305516,
  //     y: 601.5218347961172,
  //   },
  //   {
  //     x: 648.3171904315035,
  //     y: 599.5,
  //   },
  //   {
  //     x: 613.0861452207319,
  //     y: 599.5,
  //   },
  //   {
  //     x: 573.0765214591393,
  //     y: 603.9455137512881,
  //   },
  //   {
  //     x: 529.3867465967936,
  //     y: 626.9401320998911,
  //   },
  //   {
  //     x: 488.8600359689043,
  //     y: 675.9987818073353,
  //   },
  //   {
  //     x: 446.3751630031232,
  //     y: 736.6914574727367,
  //   },
  //   {
  //     x: 413.7013527876625,
  //     y: 785.7021727959286,
  //   },
  //   {
  //     x: 383.0399378181823,
  //     y: 847.0250027348869,
  //   },
  //   {
  //     x: 356.1904445133368,
  //     y: 908.9853718999171,
  //   },
  //   {
  //     x: 345.62531256549795,
  //     y: 959.6980052495438,
  //   },
  //   {
  //     x: 341.4026869088149,
  //     y: 1016.7034516147636,
  //   },
  //   {
  //     x: 349.93733293943984,
  //     y: 1070.0449893061689,
  //   },
  //   {
  //     x: 366.9324748866202,
  //     y: 1118.9060224043126,
  //   },
  //   {
  //     x: 390.6592030844838,
  //     y: 1159.8885529278948,
  //   },
  //   {
  //     x: 420.7131014140694,
  //     y: 1192.0891582810225,
  //   },
  //   {
  //     x: 454.1222654509019,
  //     y: 1219.2341040609485,
  //   },
  //   {
  //     x: 493.4839215846241,
  //     y: 1246.1657635208644,
  //   },
  //   {
  //     x: 536.4817611891259,
  //     y: 1268.6884414089338,
  //   },
  //   {
  //     x: 573.0546610922815,
  //     y: 1286.974891360514,
  //   },
  //   {
  //     x: 616.2226889848979,
  //     y: 1305.4754747430648,
  //   },
  //   {
  //     x: 667.7915409517947,
  //     y: 1321.9775073724707,
  //   },
  //   {
  //     x: 717.2463868746269,
  //     y: 1332.2806002730613,
  //   },
  //   {
  //     x: 763.3870404795182,
  //     y: 1338.2989463954382,
  //   },
  //   {
  //     x: 804.4525500535988,
  //     y: 1346.1209482190723,
  //   },
  //   {
  //     x: 842.4335805956041,
  //     y: 1355.6162058545738,
  //   },
  //   {
  //     x: 874.2229333918649,
  //     y: 1370.5759012881088,
  //   },
  //   {
  //     x: 902.4169484753414,
  //     y: 1387.492310338194,
  //   },
  //   {
  //     x: 923.1505891603764,
  //     y: 1404.7703442423901,
  //   },
  //   {
  //     x: 936.6097962948294,
  //     y: 1428.3239567276828,
  //   },
  //   {
  //     x: 943.8540617209567,
  //     y: 1455.4899520756594,
  //   },
  //   {
  //     x: 949.5,
  //     y: 1489.36558174992,
  //   },
  //   {
  //     x: 949.5,
  //     y: 1522.4425719034682,
  //   },
  //   {
  //     x: 942.1271967951039,
  //     y: 1561.1497887291723,
  //   },
  //   {
  //     x: 925.4308551283915,
  //     y: 1600.1079192848358,
  //   },
  //   {
  //     x: 903.4498415176129,
  //     y: 1633.0794397010018,
  //   },
  //   {
  //     x: 869.8942387926982,
  //     y: 1662.9066421231498,
  //   },
  //   {
  //     x: 824.1778719397909,
  //     y: 1693.3842200250865,
  //   },
  //   {
  //     x: 778.4674519171837,
  //     y: 1712.4302283678403,
  //   },
  //   {
  //     x: 726.3275484462595,
  //     y: 1727.8790886555205,
  //   },
  //   {
  //     x: 665.9139705568086,
  //     y: 1737.6232141215617,
  //   },
  //   {
  //     x: 603.2282545201303,
  //     y: 1743.5,
  //   },
  //   {
  //     x: 535.3655817499207,
  //     y: 1743.5,
  //   },
  //   {
  //     x: 465.9171487741696,
  //     y: 1731.9252611707082,
  //   },
  //   {
  //     x: 399.5051476387781,
  //     y: 1710.4390255092585,
  //   },
  //   {
  //     x: 348.16456206419065,
  //     y: 1690.6926464421106,
  //   },
  //   {
  //     x: 311.07535038300557,
  //     y: 1675.076136260557,
  //   },
  //   {
  //     x: 278.457945959275,
  //     y: 1657.8080986244645,
  //   },
  //   {
  //     x: 250.81386164358784,
  //     y: 1639.3787090806732,
  //   },
  //   {
  //     x: 230.47652459414363,
  //     y: 1617.1925232085498,
  //   },
  //   {
  //     x: 213.59562905880833,
  //     y: 1596.5603175542549,
  //   },
  //   {
  //     x: 201.03944482180668,
  //     y: 1575.0354302908227,
  //   },
  //   {
  //     x: 189.9980527628387,
  //     y: 1543.7514861237469,
  //   },
  //   {
  //     x: 182.369495843332,
  //     y: 1501.7944230664596,
  //   },
  //   {
  //     x: 176.44428972823079,
  //     y: 1434.6420870953132,
  //   },
  //   {
  //     x: 170.4160955055836,
  //     y: 1356.2755622008988,
  //   },
  //   {
  //     x: 162.35526036126348,
  //     y: 1295.8192986184981,
  //   },
  //   {
  //     x: 154.42016734233428,
  //     y: 1236.306100976529,
  //   },
  //   {
  //     x: 148.5211597789284,
  //     y: 1155.6863309433154,
  //   },
  //   {
  //     x: 152.4540551104766,
  //     y: 1043.5988139941912,
  //   },
  //   {
  //     x: 168.03106172151362,
  //     y: 946.2425226752106,
  //   },
  //   {
  //     x: 197.19628158741705,
  //     y: 868.4686030328016,
  //   },
  //   {
  //     x: 240.1950819127264,
  //     y: 778.5620205344266,
  //   },
  //   {
  //     x: 296.60438562320917,
  //     y: 702.7012327858466,
  //   },
  //   {
  //     x: 353.7661298902996,
  //     y: 643.5683938888542,
  //   },
  //   {
  //     x: 394.15255673353533,
  //     y: 603.1819670456214,
  //   },
  //   {
  //     x: 416.15255673353386,
  //     y: 577.181967045622,
  //   },
  //   {
  //     x: 434.4964286625315,
  //     y: 558.8380951166247,
  //   },
  //   {
  //     x: 433.7794982548418,
  //     y: 559.7940023268777,
  //   },
  //   {
  //     x: 4035.539665767091,
  //     y: 1876.6623828722936,
  //   },
  //   {
  //     x: 422.2205017451582,
  //     y: 520.2059976731223,
  //   },
  //   {
  //     x: 409.5035713374685,
  //     y: 537.1619048833753,
  //   },
  //   {
  //     x: 391.84744326646614,
  //     y: 554.818032954378,
  //   },
  //   {
  //     x: 369.84744326646467,
  //     y: 580.8180329543786,
  //   },
  //   {
  //     x: 330.2338701097004,
  //     y: 620.4316061111458,
  //   },
  //   {
  //     x: 271.3956143767903,
  //     y: 681.2987672141542,
  //   },
  //   {
  //     x: 211.80491808727362,
  //     y: 761.4379794655732,
  //   },
  //   {
  //     x: 166.80371841258295,
  //     y: 855.5313969671984,
  //   },
  //   {
  //     x: 135.96893827848632,
  //     y: 937.7574773247898,
  //   },
  //   {
  //     x: 119.54594488952345,
  //     y: 1040.401186005808,
  //   },
  //   {
  //     x: 115.47884022107164,
  //     y: 1156.313669056685,
  //   },
  //   {
  //     x: 121.57983265766573,
  //     y: 1239.693899023471,
  //   },
  //   {
  //     x: 129.64473963873652,
  //     y: 1300.1807013815019,
  //   },
  //   {
  //     x: 137.5839044944164,
  //     y: 1359.7244377991012,
  //   },
  //   {
  //     x: 143.55571027176921,
  //     y: 1437.3579129046875,
  //   },
  //   {
  //     x: 149.630504156668,
  //     y: 1506.2055769335404,
  //   },
  //   {
  //     x: 158.0019472371613,
  //     y: 1552.2485138762531,
  //   },
  //   {
  //     x: 170.96055517819332,
  //     y: 1588.9645697091773,
  //   },
  //   {
  //     x: 186.40437094119167,
  //     y: 1615.4396824457451,
  //   },
  //   {
  //     x: 205.52347540585637,
  //     y: 1638.8074767914502,
  //   },
  //   {
  //     x: 229.18613835641216,
  //     y: 1664.6212909193268,
  //   },
  //   {
  //     x: 261.542054040725,
  //     y: 1686.1919013755346,
  //   },
  //   {
  //     x: 296.92464961699443,
  //     y: 1704.923863739443,
  //   },
  //   {
  //     x: 335.83543793580935,
  //     y: 1721.3073535578894,
  //   },
  //   {
  //     x: 388.4948523612219,
  //     y: 1741.5609744907415,
  //   },
  //   {
  //     x: 458.0828512258304,
  //     y: 1764.0747388292918,
  //   },
  //   {
  //     x: 532.6344182500793,
  //     y: 1776.5,
  //   },
  //   {
  //     x: 604.7717454798697,
  //     y: 1776.5,
  //   },
  //   {
  //     x: 670.0860294431914,
  //     y: 1770.3767858784383,
  //   },
  //   {
  //     x: 733.6724515537405,
  //     y: 1760.1209113444795,
  //   },
  //   {
  //     x: 789.5325480828163,
  //     y: 1743.5697716321597,
  //   },
  //   {
  //     x: 839.8221280602091,
  //     y: 1722.6157799749135,
  //   },
  //   {
  //     x: 890.1057612073018,
  //     y: 1689.0933578768502,
  //   },
  //   {
  //     x: 928.5501584823871,
  //     y: 1654.9205602989982,
  //   },
  //   {
  //     x: 954.5691448716085,
  //     y: 1615.8920807151642,
  //   },
  //   {
  //     x: 973.8728032048961,
  //     y: 1570.8502112708277,
  //   },
  //   {
  //     x: 982.5,
  //     y: 1525.5574280965318,
  //   },
  //   {
  //     x: 982.5,
  //     y: 1486.63441825008,
  //   },
  //   {
  //     x: 976.1459382790433,
  //     y: 1448.5100479243406,
  //   },
  //   {
  //     x: 967.3902037051706,
  //     y: 1415.6760432723172,
  //   },
  //   {
  //     x: 948.8494108396236,
  //     y: 1383.2296557576096,
  //   },
  //   {
  //     x: 921.5830515246593,
  //     y: 1360.5076896618061,
  //   },
  //   {
  //     x: 889.7770666081351,
  //     y: 1341.4240987118912,
  //   },
  //   {
  //     x: 853.5664194043959,
  //     y: 1324.3837941454262,
  //   },
  //   {
  //     x: 811.5474499464012,
  //     y: 1313.8790517809277,
  //   },
  //   {
  //     x: 768.6129595204818,
  //     y: 1305.7010536045618,
  //   },
  //   {
  //     x: 722.7536131253731,
  //     y: 1299.7193997269387,
  //   },
  //   {
  //     x: 676.2084590482053,
  //     y: 1290.0224926275293,
  //   },
  //   {
  //     x: 627.7773110151021,
  //     y: 1274.5245252569352,
  //   },
  //   {
  //     x: 586.9453389077185,
  //     y: 1257.025108639486,
  //   },
  //   {
  //     x: 551.5182388108741,
  //     y: 1239.3115585910662,
  //   },
  //   {
  //     x: 510.5160784153759,
  //     y: 1217.8342364791356,
  //   },
  //   {
  //     x: 473.8777345490981,
  //     y: 1192.7658959390515,
  //   },
  //   {
  //     x: 443.2868985859306,
  //     y: 1167.9108417189775,
  //   },
  //   {
  //     x: 417.34079691551625,
  //     y: 1140.1114470721052,
  //   },
  //   {
  //     x: 397.0675251133798,
  //     y: 1105.0939775956874,
  //   },
  //   {
  //     x: 382.06266706056016,
  //     y: 1061.9550106938311,
  //   },
  //   {
  //     x: 374.597313091185,
  //     y: 1015.2965483852364,
  //   },
  //   {
  //     x: 378.37468743450205,
  //     y: 964.3019947504562,
  //   },
  //   {
  //     x: 387.8095554866632,
  //     y: 919.0146281000829,
  //   },
  //   {
  //     x: 412.9600621818177,
  //     y: 860.9749972651131,
  //   },
  //   {
  //     x: 442.2986472123375,
  //     y: 802.2978272040714,
  //   },
  //   {
  //     x: 473.6248369968768,
  //     y: 755.3085425272633,
  //   },
  //   {
  //     x: 515.1399640310957,
  //     y: 696.0012181926647,
  //   },
  //   {
  //     x: 550.6132534032064,
  //     y: 653.0598679001089,
  //   },
  //   {
  //     x: 582.9234785408607,
  //     y: 636.0544862487119,
  //   },
  //   {
  //     x: 614.9138547792681,
  //     y: 632.5,
  //   },
  //   {
  //     x: 647.6828095684965,
  //     y: 632.5,
  //   },
  //   {
  //     x: 699.1151048694484,
  //     y: 634.4781652038828,
  //   },
  //   {
  //     x: 755.4114420398461,
  //     y: 638.3606712156344,
  //   },
  //   {
  //     x: 809.05612016762,
  //     y: 651.7718407475779,
  //   },
  //   {
  //     x: 864.5317538706917,
  //     y: 672.8143224970188,
  //   },
  //   {
  //     x: 918.576486748026,
  //     y: 707.5573650610195,
  //   },
  //   {
  //     x: 974.3163353192122,
  //     y: 749.3622514894092,
  //   },
  //   {
  //     x: 1016.3185308381915,
  //     y: 778.7637883526946,
  //   },
  //   {
  //     x: 4035.539665767091,
  //     y: 1876.6623828722936,
  //   },
  //   {
  //     x: -1943.5396657670906,
  //     y: -332.6623828722935,
  //   },
  // ];

  // if (false) {
  //   let i = 0;
  //   setInterval(() => {
  //     if (i == 0) {
  //       context.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  //       context.strokeStyle = "rgb(0, 0, 0)";
  //       context.lineWidth = 3 * 1;
  //       context.setLineDash([]);
  //       context.beginPath();
  //       context.moveTo(poly[0].x, poly[0].y);
  //       i++;
  //       return;
  //     }
  //     context.lineTo(poly[i].x, poly[i].y);
  //     context.stroke();
  //     i++;
  //     i %= poly.length;
  //   }, 30);
  // }

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
