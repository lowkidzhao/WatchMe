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
	uuid,
	metricName,
	period = 300,
	namespace = "QCE/LIGHTHOUSE"
) {
	try {
		// 添加参数验证
		if (!uuid || typeof uuid !== "string") {
			throw new Error("无效的实例ID");
		}
		const now = Math.floor(Date.now() / 1000);
		const params = {
			Namespace: namespace,
			MetricName: metricName,
			Instances: [
				{
					Dimensions: [
						{
							Name: "InstanceId",
							Value: uuid,
						},
					],
				},
			],
			Period: period,
			// 新增时间范围参数（查询最近1小时数据）
			StartTime:
				new Date((now - 3600) * 1000).toISOString().split(".")[0] + "Z",
			EndTime: new Date(now * 1000).toISOString().split(".")[0] + "Z",
		};
		const result = await window.electronAPI.callTencentCloudAPI(
			"getMonitorData",
			params
		);
		// 重构数据处理逻辑
		const validDataPoints = result.DataPoints.flatMap((dp) => {
			if (!dp.Timestamps || !dp.Values) return [];
			return dp.Timestamps.map((timestamp, index) => ({
				Timestamp: timestamp,
				Value: dp.Values[index] ?? null,
			}));
		}).filter(
			(dp) => dp.Value !== null && !isNaN(dp.Value) && dp.Timestamp > 0
		);
		return {
			MetricName: metricName,
			DataPoints: validDataPoints
				.map((dp) => ({
					Timestamp: dp.Timestamp * 1000,
					Value: Number(parseFloat(dp.Value).toFixed(2)),
				}))
				.sort((a, b) => a.Timestamp - b.Timestamp),
		};
	} catch (error) {
		// 优化错误信息
		const errorDetail = error.message.includes("toFixed")
			? "监控数据格式异常"
			: error.message.split("]")[1]?.trim();
		throw new Error(`监控数据获取失败: ${errorDetail || error.message}`);
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
