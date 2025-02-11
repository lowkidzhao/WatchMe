const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.cjs"),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	if (process.env.NODE_ENV === "development") {
		mainWindow.loadURL("http://localhost:5173");
	} else {
		mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
	}

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// 监听所有窗口关闭事件
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		// 向渲染进程发送关闭信号
		if (mainWindow) {
			mainWindow.webContents.send("close-vue-app");
			// app.quit();
		}
		// 等待一段时间后退出应用
		setTimeout(() => {
			app.quit();
		}, 500);
	}
});

ipcMain.on("vue-app-closed", () => {
	app.quit();
});
