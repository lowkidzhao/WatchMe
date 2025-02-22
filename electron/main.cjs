const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const logger = require("./logger.cjs");

let mainWindow;
let splashWindow;

function createWindow() {
	try {
		// 创建开屏动画窗口
		splashWindow = new BrowserWindow({
			width: 400,
			height: 300,
			transparent: true,
			frame: false,
			alwaysOnTop: true,
			center: true, // 确保窗口显示在屏幕中央
		});
		splashWindow.loadFile(path.join(__dirname, "splash.html"));
		logger.info("开屏动画窗口已创建");

		// 创建主窗口时设置 show 为 false，初始隐藏
		mainWindow = new BrowserWindow({
			width: 1054,
			height: 720,
			title: "WatchMe", // 设置窗口标题
			webPreferences: {
				preload: path.join(__dirname, "preload.cjs"),
				nodeIntegration: false,
				contextIsolation: true,
			},
			// 隐藏菜单栏
			autoHideMenuBar: true,
			// 隐藏窗口边框
			frame: false,
			backgroundColor: "#000000", // 设置主窗口背景颜色为黑色
			show: false, // 初始隐藏主窗口
		});
		logger.info("主窗口已创建");

		// 设置 Content Security Policy
		mainWindow.webContents.session.webRequest.onHeadersReceived(
			(details, callback) => {
				// 定义 CSP 策略，考虑 Vue 项目特性
				let csp =
					"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https://cloudcache.tencent-cloud.com data:; connect-src 'self'; font-src 'self';";
				if (process.env.NODE_ENV === "development") {
					// 将 http://localhost:5173 添加到 font-src 指令的值中
					csp = csp.replace(
						"font-src 'self';",
						"font-src 'self' http://localhost:5173;"
					);
				}
				callback({
					responseHeaders: {
						...details.responseHeaders,
						"Content-Security-Policy": [csp],
					},
				});
			}
		);
		if (process.env.NODE_ENV === "development") {
			mainWindow.loadURL("http://localhost:5173");
		} else {
			mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
		}
		logger.info("主窗口加载 URL 完成");

		// 主窗口加载完成后显示主窗口并关闭开屏动画窗口
		mainWindow.webContents.on("did-finish-load", () => {
			if (splashWindow) {
				splashWindow.close();
				splashWindow = null;
				logger.info("开屏动画窗口已关闭");
			}
			mainWindow.show(); // 显示主窗口
			logger.info("主窗口已显示");
		});
		mainWindow.on("closed", () => {
			mainWindow = null;
			logger.info("主窗口已关闭");
		});
	} catch (error) {
		logger.error(`创建窗口时出错: ${error.message}`);
	}
}

app.whenReady().then(() => {
	try {
		createWindow();
		logger.info("应用已准备好，窗口已创建");

		// 监听最小化窗口事件
		ipcMain.on("minimize-window", () => {
			mainWindow.minimize();
			logger.info("主窗口已最小化");
		});
		// 监听关闭窗口事件
		ipcMain.on("close-window", () => {
			mainWindow.close();
			logger.info("主窗口已关闭");
		});

		app.on("activate", function () {
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
			logger.info("应用被激活，窗口已创建");
		});
	} catch (error) {
		logger.error(`应用启动时出错: ${error.message}`);
	}
});

// 监听所有窗口关闭事件
app.on("window-all-closed", function () {
	try {
		if (process.platform !== "darwin") {
			// 向渲染进程发送关闭信号
			if (mainWindow) {
				mainWindow.webContents.send("close-vue-app");
				logger.info("向渲染进程发送关闭信号");
			}
			// 等待一段时间后退出应用
			setTimeout(() => {
				app.quit();
				logger.info("应用已退出");
			}, 500);
		}
	} catch (error) {
		logger.error(`窗口关闭时出错: ${error.message}`);
	}
});

ipcMain.on("vue-app-closed", () => {
	try {
		app.quit();
		logger.info("Vue 应用关闭，应用已退出");
	} catch (error) {
		logger.error(`Vue 应用关闭时出错: ${error.message}`);
	}
});

// 新增：监听来自渲染进程的消息
ipcMain.handle("call-main-method", async (event, arg) => {
	try {
		// 这里可以调用主进程的方法
		const result = await getOsData(arg);
		return result;
	} catch (error) {
		logger.error(`调用主进程方法时出错: ${error.message}`);
		throw error;
	}
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

		// 获取 CPU 占用率
		const cpuLoad = await si.currentLoad();
		const cpuUsage = Math.round(cpuLoad.currentLoad);

		// 获取 GPU 信息
		const gpuInfo = await si.graphics();
		// console.log(gpuInfo);

		// 获取网络信息
		const networkInfo = await si.networkInterfaces();
		const ip4 = networkInfo.map((info) => info.ip4);
		const ip6 = networkInfo.map((info) => info.ip6);
		const mac = networkInfo.map((info) => info.mac);

		// 获取硬盘信息
		const diskInfo = await si.diskLayout();
		// 获取硬盘占用信息
		const diskUsage = await si.fsSize();

		// 获取系统信息
		const systemInfo = await si.system();

		logger.info("系统信息获取成功");
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
			},
			gpu: {
				models: gpuInfo,
			},
			network: {
				ip4: ip4,
				ip6: ip6,
				mac: mac,
			},
			disk: {
				diskinfo: diskInfo,
				diskusage: diskUsage,
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

// 引入 tencentcloud-api.js 中的函数
const tencentcloudApi = require("./tencentcloud-api.cjs");
const fs = require("fs");
// 定义 config.json 文件的路径
const configFilePath = path.join(app.getPath("userData"), "config.json");

// 检查文件是否存在
fs.access(configFilePath, fs.constants.F_OK, (err) => {
	if (err) {
		// 文件不存在，创建默认配置
		const defaultConfig = {
			tencentcloud: {
				credential: {
					secretId: "",
					secretKey: "",
				},
				region: "",
				profile: {
					httpProfile: {
						endpoint: "",
					},
				},
			},
		};
		const defaultConfigData = JSON.stringify(defaultConfig, null, 2);
		fs.writeFile(configFilePath, defaultConfigData, "utf8", (writeErr) => {
			if (writeErr) {
				logger.error("创建默认配置文件时出错:", writeErr);
			} else {
				logger.info("默认配置文件已创建");
				updateConfig();
			}
		});
	} else {
		logger.info("配置文件已存在");
	}
});

// 监听来自渲染进程的消息
ipcMain.handle("call-tencentcloud-api", async (event, choice, params) => {
	// 将 choice 转换为字符串
	choice = String(choice);
	logger.info("接收到的 choice:", choice); // 确认 choice 是否正确接收
	if (!choice) {
		throw new Error("方法未指定");
	}
	try {
		switch (choice) {
			case "updataConfig":
				try {
					const result = await tencentcloudApi.updateConfig(params);
					logger.info("成功调用 updataConfig 方法");
					return result;
				} catch (error) {
					logger.error("调用 updataConfig 方法时出错:", error);
					throw error;
				}
			case "getConfig":
				try {
					const result = await tencentcloudApi.getConfig();
					logger.info("成功调用 getConfig 方法");
					return result;
				} catch (error) {
					logger.error("调用 getConfig 方法时出错:", error);
					throw error;
				}
			case "clientUse":
				try {
					const result = await tencentcloudApi.clientUse();
					logger.info("成功调用 clientUse 方法");
					return result;
				} catch (error) {
					logger.error("调用 clientUse 方法时出错:", error);
					throw error;
				}
			case "getMonitorData":
				try {
					const result = await tencentcloudApi.getMonitorData(params);
					logger.info("成功调用 getMonitorData 方法");
					return result;
				} catch (error) {
					logger.error("调用 getMonitorData 方法时出错:", error);
					throw error;
				}

			default:
				logger.error("未找到对应的 API 方法");
				throw new Error("未找到对应的 API 方法");
		}
	} catch (error) {
		logger.error("处理 call-tencentcloud-api 时出错:", error);
		throw error;
	}
});
