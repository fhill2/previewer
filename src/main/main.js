console.log(`Hello from Electron 👋`);
require("file-loader?name=[name].[ext]!./pipe.js");
require("file-loader?name=[name].[ext]!./i3wm.py");

import { app, BrowserWindow, protocol, screen } from "electron";
import { resolveHtmlPath, isTextFile } from "./util";

import path from "path";
import os from "os";
import mime from "mime-types";
import fs from "fs";
import child_process from "child_process";

// for resizing electron window to video dimensions
import probe from "node-ffprobe";

// ~/.config/previewer
const configDir = app.getPath("appData");
const config = JSON.parse(
  fs.readFileSync(path.join(configDir, "previewer", "conf.json"))
);

var PREV_STATE = true;
var statusHeight = 25;

function i3wm(actions) {
  // move previewer to 0 0 of the current monitor its on
  try {
    // let childFile =
    // process.env.NODE_ENV == 'production'
    // ? 'i3wm.py'
    // : path.join(__dirname, 'i3wm.py');

    const i3wmCmd = `python ${path.join(__dirname, "i3wm.py")} ${actions}`;
    const output = child_process.execSync(i3wmCmd);

    if (output) console.log(`i3wm Output: ${output}`);
  } catch (error) {
    console.error(`i3wm Error: ${error}`);
  }
}

function notifySend(msg) {
  try {
    const output = child_process.execSync("notify-send " + msg);
  } catch (error) {
    console.error(`notify-send Error: ${error}`);
  }
}

function getScreenWH() {
  // get the current screen the electron application is on
  const currentScreen = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint()
  );
  return [currentScreen.workAreaSize.width, currentScreen.workAreaSize.height];
}

function limitImageVideoSize(width, height) {
  // limits the size of the preview window when auto scaling videos and images
  // if previewer width is more than half the width of the currernt screen
  // scale the previewer window down to half the width of the current screen, maintaining aspect ratio.
  const [screenW, screenH] = getScreenWH();
  console.log("before limit: ", screenW, width, height);
  if (width > screenW / 2) {
    console.log("larger than half screen");
    console.log("calculated: ", width, height);
    let aspect = width / height;
    width = Math.floor(screenW / 2);
    height = Math.floor(width / aspect);
    console.log("new: ", width, height, aspect);
  }

  console.log("new: ", width, height);
  return [width, height];
}

function resizeWinToVideo(fp) {
  probe(fp)
    .then((probeData) => {
      console.log(probeData);
      let streamW, streamH;
      for (const stream of probeData.streams) {
        if (stream.codec_type == "video") {
          streamW = stream.width;
          streamH = stream.height;
        }
      }

      const [width, height] = limitImageVideoSize(streamW, streamH);
      console.log("setting size: ", width, height);
      win.setSize(width, height);
    })
    .catch(console.error);
}

function setSize() {
  // affects setting size on all previewers
  // can add global limit functions here. such as keeping the window sm,
}

function mimeToPreviewer(fp) {
  // decide the previewer to use for the file
  const mimeType = mime.lookup(fp);

  if (!mimeType) {
  if (isTextFile(fp)) return "text";
  // the file could not have an extension, but still be a text file. detect it here.
  // this applies to files like i3/config
    throw new Error("mimeType not found");
  }

  console.log("main: ", mimeType);

  if (mimeType.startsWith("video")) {
    resizeWinToVideo(fp);
    return "video";
  }

  if (mimeType.startsWith("audio")) {
    win.setSize(500, 100);
    return "audio";
  }

  if (mimeType.startsWith("image")) {
    resizeWinToVideo(fp);
    return "image";
  }

  if (mimeType == "application/pdf") {
    const [screenW, screenH] = getScreenWH();
    win.setSize(Math.floor(screenW / 2), screenH - statusHeight);
    return "pdf";
  }

  // some text files arent detected by isTextFile(fp)
  // these mimes are application/javascript application/toml
  if (mimeType == "application/javascript" || mimeType == "application/toml") {
    return "text";
  }

  // if mimeType failed to detect, mimeType=false
  if (mimeType.startsWith("text")) {
    // win.setSize(340, 2400)
    return "text";
  }
}

const preview = (fp) => {
  const filepath = fp.replace(/^~(?=$|\/|\\)/, os.homedir());
  if (!fs.existsSync(filepath)) {
    console.log("DOES NOT EXIST - BLOCKING: " + filepath);
    return;
  }

  const stat = fs.statSync(filepath);
  // if a directory, ignore for now
  if (stat.isDirectory()) return;

  let previewer;
  try {
    previewer = mimeToPreviewer(filepath);
  } catch (e) {
    console.log(e);
    return;
  }
  console.log("previewer: ", previewer, filepath);
  i3wm("move");
  win.webContents.send("custom-endpoint", {
    previewer: previewer,
    filepath: filepath,
  });
};

const stopPreviewer = () => {
  PREV_STATE = false;
  notifySend("Stopping previewer...");
  i3wm("hide");
};

const startPreviewer = () => {
  PREV_STATE = true;
  notifySend("Starting previewer...");
  // i3wm('hide');
};

const doAction = (action) => {
  console.log("action: ", action);
  switch (action) {
    case "toggle":
      if (PREV_STATE) {
        stopPreviewer();
      } else {
        startPreviewer();
      }
      break;
    case "exit" || "quit":
      app.quit();
      break;
    case "stop":
      stopPreviewer();
      break;
    case "start":
      startPreviewer();
      break;
    default:
  }
};

function setupIPC() {
  // conditional file, otherwise production env does not find the dist file
  // let childFile =
  //   process.env.NODE_ENV == 'production'
  //     ? 'release/app/dist/main/pipe.js'
  //     : path.join(__dirname, 'pipe.js');
  const p = child_process.fork(path.join(__dirname, "pipe.js"), ["hello"], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });
  // p.stdout.on('data', (d) => {
  // console.log("p.stdout.on: ", d)
  // });
  p.stderr.on("data", (d) => {
    console.log("error: ", d.toString());
  });

  p.on("message", (m) => {
    console.log("pipe->main: ", m);
    let msg = m.replace(/\n/g, "");
    msg.includes("/") && PREV_STATE == true ? preview(msg) : doAction(msg);
  });
  p.on("exit", (code, sig) => {
    console.log("exiting child process");
  });
}

function onRendererMsg(event, channel, res) {
  console.log(`Received ${channel} message from renderer process`, res);
  if (res.command == "resize") {
    // setting width height in pixels from char count values is bad
    // instead, set codemirror to autosize width and height, then get the size in pixels of the dom element
    // then resize electron window with these values
    // const screenBounds = screen.getDisplayMatching(win.getBounds()).size;
    const [screenW, screenH] = getScreenWH();

    let width = Math.round(res.data.width * 9);
    let maxWidth = Math.round(screenW / 2);
    if (width > screenW / 2) width = maxWidth;

    // limit to height of screen
    let height = Math.round(res.data.height * 19); // * to badly convert char count -> pixels until a better implementation
    if (height > screenH) height = screenH;

    // let appBounds = win.getBounds();
    // let maxHeight = screenH - appBounds.y;

    win.setSize(width, height - statusHeight);
  }
}

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences: {
      // if nodeIntegration: false, I have to use a preload script
      // https://stackoverflow.com/questions/62433323/using-the-electron-ipcrenderer-from-a-front-end-javascript-file
      nodeIntegration: true, // allows running node.js APIs in the renderer process
      contextIsolation: false, // allow access to the require function in the renderer process
      webSecurity: false, // allow loading local files in the renderer process

      // worldSafeExecuteJavaScript: true, // This must be true
      devtools: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "renderer", "index.html")); // prod
  } else {
    win.loadURL("http://localhost:3000"); // dev
  }
  // win.loadURL()

  // Add IPC listener on mainWindow instance
  win.webContents.on("custom-endpoint", (event, channel, data) =>
    onRendererMsg(event, channel, data)
  );

  // Remove reference to mainWindow on close
  win.on("closed", () => {
    win = null;
  });

  win.on("ready-to-show", () => {
    win.minimize();
    win.setMenu(null);
    // win.show();
    win.webContents.openDevTools();
    setupIPC();
  });
};

app
  .whenReady()
  .then(() => {
    createWindow();
  })
  .then(() => {
    protocol.registerFileProtocol("file", (request, callback) => {
      const url = request.url.substr(7);
      callback({ path: url });
    });
  })
  .catch(console.error);
