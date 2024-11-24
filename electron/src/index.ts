import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  protocol,
  dialog,
} from "electron";
import path from "path";
import cap from "screenshot-desktop";
import PDFKit from "pdfkit";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "image",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
    },
  },
]);

let capWin: BrowserWindow;
let pngBuf: Buffer;
const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // protocol handler
  protocol.handle("image", (req) => {
    return new Response(pngBuf, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  });
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    width: width,
    height: height,
  });

  setTimeout(() => {
    mainWindow.maximize();
    mainWindow.loadFile(path.join(__dirname, "..", "web", "index.html"));

    mainWindow.webContents.on("dom-ready", () => {
      mainWindow.webContents.send("screen", { width, height });
    });

    ipcMain.on("btp", (event, arg) => {
      mainWindow.maximize();
      capWin.close();
    });

    ipcMain.on("cap", (event, arg) => {
      // capWin.setFullScreen(true);
      capWin.setPosition(0, 0);
      capWin.setSize(width, height);
      // capWin.focus();
      // transparent window
      console.log("cap");
    });

    ipcMain.on("esc", (event, arg) => {
      capWin.setFullScreen(false);
      capWin.setKiosk(false);
      capWin.setPosition(25, 25);
      capWin.setSize(100, 35);
    });

    ipcMain.on("cat", (event, arg) => {
      capWin.close();

      //@ts-ignore
      capWin = null;
      setTimeout(() => {
        console.log(arg);
        const dd = arg as {
          start: { x: number; y: number };
          end: { x: number; y: number };
        };

        cap({
          format: "png",
        }).then((img) => {
          pngBuf = img;
          mainWindow.webContents.send("cap", dd);
          mainWindow.maximize();
        });
      }, 50);
    });

    ipcMain.on("wincap", (event, arg) => {
      mainWindow.minimize();

      capWin = new BrowserWindow({
        width: 100,
        height: 35,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        alwaysOnTop: true,
        frame: false,
        fullscreen: false,
        resizable: false,
        x: 25,
        y: 25,
        transparent: true,
      });
      capWin.loadFile(path.join(__dirname, "..", "web", "wincap.html"));
    });

    ipcMain.on(
      "pdf",
      (
        event,
        /* collection of webp data urls */ arg: [number, number, string[]]
      ) => {
        const cache = app.getPath("temp");
        // console.log(arg);

        // save all images to temp folder
        arg[2].forEach((dataUrl, index) => {
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          require("fs").writeFileSync(
            path.join(cache, `image-${index}.png`),
            base64Data,
            "base64"
          );
        });

        // create pdf
        const doc = new PDFKit({
          autoFirstPage: false,
        });
        const pdfPath = path.join(cache, "pdf.pdf");
        for (let i = 0; i < arg[2].length; i++) {
          doc
            .addPage({
              size: [arg[0], arg[1]],
            })
            .image(path.join(cache, `image-${i}.png`), 0, 0, {
              width: arg[0],
              height: arg[1],
            });
        }

        doc.pipe(require("fs").createWriteStream(pdfPath));
        doc.end();

        // ask for save dialog
        dialog
          .showSaveDialog(mainWindow, {
            defaultPath: path.join(app.getPath("documents"), "pdf.pdf"),
            filters: [{ name: "PDF", extensions: ["pdf"] }],
          })
          .then((result) => {
            if (result.canceled) return;
            require("fs").copyFileSync(pdfPath, result.filePath);
            // remove pdf
            require("fs").unlinkSync(pdfPath);
          });

        // clear cache
        // remove all images
        arg[2].forEach((_, index) => {
          require("fs").unlinkSync(path.join(cache, `image-${index}.png`));
        });
      }
    );
  }, 100);
};

app.whenReady().then(createWindow);
