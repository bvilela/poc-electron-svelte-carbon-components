const { app, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
  });

  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  // mainWindow.webContents.openDevTools();
  // mainWindow.maximize();
});