const winston = require("winston");
const { app } = require("electron");
const path = require("path");

// 定义日志文件夹路径
const LOG_FOLDER_PATH = path.join(app.getAppPath(), "log");
// 确保日志文件夹存在
const fs = require("fs");
if (!fs.existsSync(LOG_FOLDER_PATH)) {
	fs.mkdirSync(LOG_FOLDER_PATH);
}

// 定义日志文件路径
const LOG_FILE_PATH = path.join(LOG_FOLDER_PATH, "app.log");

// 配置 winston 日志器
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.printf(({ timestamp, level, message }) => {
			return `[${timestamp}] ${level}: ${message}`;
		})
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: LOG_FILE_PATH }),
	],
});

module.exports = logger;
