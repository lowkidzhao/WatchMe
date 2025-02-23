// 引入依赖
const tencentcloud = require("tencentcloud-sdk-nodejs");
const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { log } = require("console");
const { default: logger } = require("./logger.cjs");

// 定义 Lighthouse 客户端
const LighthouseClient = tencentcloud.lighthouse.v20200324.Client;

// 定义配置文件路径，可根据实际情况调整
const CONFIG_FILE_PATH = path.join(app.getPath("userData"), "config.json");

// 读取配置文件并返回配置对象
const readConfig = () => {
	try {
		const data = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
		return JSON.parse(data);
	} catch (error) {
		if (error.code === "ENOENT") {
			// 文件不存在，创建并初始化配置
			const initialConfig = {
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
			try {
				fs.writeFileSync(
					CONFIG_FILE_PATH,
					JSON.stringify(initialConfig, null, 2)
				);
				console.log("配置文件已创建并初始化。");
				return initialConfig;
			} catch (writeError) {
				console.error("创建并初始化配置文件时出错:", writeError);
				throw writeError;
			}
		} else {
			console.error("读取或解析配置文件时出错:", error);
			throw error;
		}
	}
};

// 获取客户端配置
const getClientConfig = () => {
	const config = readConfig();
	if (
		!config ||
		!config.tencentcloud ||
		!config.tencentcloud.credential.secretId ||
		!config.tencentcloud.credential.secretKey
	) {
		throw new Error(
			"配置文件中缺少腾讯云授权信息，请检查 secretId 和 secretKey。"
		);
	}
	return config.tencentcloud;
};

// 初始化客户端，只在模块加载时创建一次
let clientConfig;
let client;
try {
	clientConfig = getClientConfig();
	client = clientConfig ? new LighthouseClient(clientConfig) : null;
} catch (error) {
	console.error(error.message);
	client = null;
}

// 定义 clientUse 函数
const clientUse = async () => {
	if (!client) {
		throw new Error("没有授权信息");
	}
	try {
		const params = {};
		// 调用 DescribeInstances 接口查询实例信息

		const result = await client.DescribeInstances(params);
		return result;
	} catch (error) {
		console.error("调用腾讯云 API 时出错:", error);
		throw error;
	}
};

// 更改配置文件中的密钥信息
const updateConfig = (params) => {
	const config = readConfig();
	if (!config) {
		console.error("无法读取配置文件，无法更新配置");
		return;
	}
	if (!config.tencentcloud) {
		config.tencentcloud = {};
	}
	config.tencentcloud.credential.secretId =
		params.tencentcloud.credential.secretId;
	config.tencentcloud.credential.secretKey =
		params.tencentcloud.credential.secretKey;
	config.tencentcloud.region = params.tencentcloud.region;
	config.tencentcloud.profile = params.tencentcloud.profile;
	try {
		fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2));
		console.log("配置文件更新成功");
		// 更新客户端配置和客户端实例
		clientConfig = getClientConfig();
		client = clientConfig ? new LighthouseClient(clientConfig) : null;
	} catch (error) {
		console.error("更新配置文件时出错:", error);
		throw error;
	}
};

const getConfig = () => {
	try {
		return readConfig();
	} catch (error) {
		throw error;
	}
};

// 在文件顶部添加 Monitor 客户端
const MonitorClient = tencentcloud.monitor.v20180724.Client;

// 在模块导出前添加监控方法
const getMonitorData = async (params) => {
	try {
		let config = getClientConfig();
		config.profile.httpProfile.endpoint = "monitor.tencentcloudapi.com";
		const client = new MonitorClient(config);
		const result = await client.GetMonitorData(params);
		return result;
	} catch (error) {
		logger.error(
			`腾讯云监控接口错误: ${
				error.message.match(/\[.*?\]\s*(?<detail>.+)/)?.groups?.detail
			}`
		);
		throw new Error(
			`腾讯云监控接口错误: ${
				error.message.match(/\[.*?\]\s*(?<detail>.+)/)?.groups?.detail
			}`
		);
	}
};

module.exports = {
	clientUse,
	updateConfig,
	getConfig,
	getMonitorData,
};
