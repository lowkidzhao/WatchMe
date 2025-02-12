const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 700,
		title: "WatchMe", // 设置窗口标题
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

// 新增：监听来自渲染进程的消息
ipcMain.handle("call-main-method", async (event, arg) => {
	// 这里可以调用主进程的方法
	const result = await getOsData(arg);
	return result;
});

const si = require("systeminformation"); // 引入 systeminformation 模块来获取更全面的系统信息

async function getOsData(arg) {
	try {
		// 获取内存信息
		const memoryInfo = await si.mem();
		const totalMemory = Math.round(memoryInfo.total / 1048576);
		const freeMemory = Math.round(memoryInfo.free / 1048576);
		const usedMemory = Math.round(memoryInfo.used / 1048576);

		// 获取 CPU 信息
		const cpuInfo = await si.cpu();
		const cpuManufacturer = cpuInfo.manufacturer;
		const cpuBrand = cpuInfo.brand;
		const cpuSpeed = cpuInfo.speed;
		const cpuCores = cpuInfo.cores;
		const cpuPhysicalCores = cpuInfo.physicalCores;
		const cpuTemperature = await si.cpuTemperature();
		const cpuTemperature1 = cpuTemperature.main;

		// 获取 CPU 占用率
		const cpuLoad = await si.currentLoad();
		const cpuUsage = Math.round(cpuLoad.currentLoad);

		// 获取 GPU 信息
		const gpuInfo = await si.graphics();
		const gpuModels = gpuInfo.controllers.map((controller) => controller.model);
		const temperatureGpu = gpuInfo.controllers.map(
			(controller) => controller.temperatureGpu
		);

		// 获取网络信息
		const networkInfo = await si.networkInterfaces();
		const ip4 = networkInfo.map((info) => info.ip4);
		const ip6 = networkInfo.map((info) => info.ip6);
		const mac = networkInfo.map((info) => info.mac);

		// 获取硬盘信息
		const diskInfo = await si.diskLayout();

		// 获取系统信息
		const systemInfo = await si.system();
		const osDistro = systemInfo.distro;
		const osRelease = systemInfo.release;

		return {
			memory: {
				total: totalMemory,
				free: freeMemory,
				used: usedMemory,
			},
			cpu: {
				manufacturer: cpuManufacturer,
				brand: cpuBrand,
				speed: cpuSpeed,
				cores: cpuCores,
				physicalCores: cpuPhysicalCores,
				usage: cpuUsage,
				temperature: cpuTemperature1,
			},
			gpu: {
				models: gpuModels,
				temperature: temperatureGpu,
			},
			network: {
				ip4: ip4,
				ip6: ip6,
				mac: mac,
			},
			disk: {
				diskinfo: diskInfo,
			},
			system: {
				systemInfo: systemInfo,
			},
		};
	} catch (error) {
		console.error("Error getting system information:", error);
		return null;
	}
}
