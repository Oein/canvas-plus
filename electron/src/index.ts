import { app, BrowserWindow, ipcMain, screen, protocol } from "electron";
import path from "path";
import cap from "screenshot-desktop";

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
  // protocol handler
  protocol.handle("image", (req) => {
    return new Response(pngBuf, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  });
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
  });
  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, "..", "web", "index.html"));

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

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
};

app.whenReady().then(createWindow);
