//腾讯云获取指定地域的机器信息（使用已保存的配置信息）
async function fetchTencentCloudClientUse() {
	try {
		const result = await window.electronAPI.callTencentCloudAPI("clientUse");
		console.log("腾讯云 API 调用结果:", result);
		// 返回包含状态和结果的对象
		return {
			status: "获取成功",
			result: result,
		};
	} catch (error) {
		let errorType;
		if (error.message.includes("TencentCloudSDKException")) {
			if (
				error.message.includes(
					"The request action=`DescribeInstances` is invalid or not found"
				)
			) {
				errorType = "腾讯云操作无效";
			} else {
				errorType = "腾讯云 SDK 异常";
			}
		} else {
			errorType = "未知错误";
		}
		console.error(error);
		return errorType;
	}
}
//腾讯云监控数据
async function fetchInstanceMonitorData(
	instanceId,
	metricName,
	period = 300,
	Namespace
) {
	try {
		const now = Math.floor(Date.now() / 1000);
		let params = {
			Namespace: Namespace,
			InstanceId: instanceId,
			MetricName: metricName,
			StartTime: now - 3600 * 3, // 默认查询3小时数据
			EndTime: now,
			Period: period,
		};
		const result = await window.electronAPI.callTencentCloudAPI(
			"getMonitorData",
			params
		);

		return {
			MetricName: metricName,
			DataPoints: result.DataPoints.filter((dp) => dp.Value !== null)
				.map((dp) => ({
					Timestamp: dp.Timestamp * 1000, // 转换为毫秒时间戳
					Value: Number(dp.Value.toFixed(2)),
				}))
				.sort((a, b) => a.Timestamp - b.Timestamp), // 按时间排序
		};
	} catch (error) {
		// 错误处理与其它接口保持一致
		if (error.message.includes("TencentCloudSDKException")) {
			throw new Error(
				`腾讯云接口错误: ${error.message.split("]")[1]?.trim() || "未知错误"}`
			);
		}
		throw new Error(`监控数据获取失败: ${error.message}`);
	}
}
//获取腾讯云配置
async function fetchTencentCloudConfig() {
	try {
		const result = await window.electronAPI.callTencentCloudAPI("getConfig");
		console.log("获取配置信息:", result);
		return result;
	} catch (error) {
		console.error(error);
	}
}
//更新腾讯云配置
async function fetchTencentCloudUpdataConfig(params) {
	try {
		// 过滤不可克隆的属性
		const sanitizedParams = JSON.parse(JSON.stringify(params));
		const result = await window.electronAPI.callTencentCloudAPI(
			"updataConfig",
			sanitizedParams
		);
		return "更新成功";
	} catch (error) {
		return error.message;
	}
}

export {
	fetchTencentCloudClientUse,
	fetchTencentCloudConfig,
	fetchTencentCloudUpdataConfig,
	fetchInstanceMonitorData,
};
