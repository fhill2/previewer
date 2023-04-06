console.log(`Hello from Electron 👋`);

import { app, BrowserWindow } from "electron";
import { resolveHtmlPath } from "./util";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html");

  win.loadURL(resolveHtmlPath("index.html"));
  // win.loadURL()
};

app.whenReady().then(() => {
  createWindow();
});
