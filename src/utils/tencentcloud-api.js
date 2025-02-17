const tencentcloud = require("tencentcloud-sdk-nodejs");

// 导入 CVM 模块的 client models
const CvmClient = tencentcloud.cvm.v20170312.Client;

// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey
const clientConfig = {
	credential: {
		secretId: "your-secret-id",
		secretKey: "your-secret-key",
	},
	region: "ap-guangzhou", // 根据实际情况修改区域
	profile: {
		httpProfile: {
			endpoint: "cvm.tencentcloudapi.com",
		},
	},
};

// 实例化要请求产品的 client 对象
const client = new CvmClient(clientConfig);

// 定义请求参数
const params = {
	Offset: 0,
	Limit: 100, // 一次最多返回 100 条记录
};

// 调用 DescribeInstances 接口获取所有实例
client.DescribeInstances(params).then(
	(data) => {
		console.log(data);
		return data;
	},
	(err) => {
		console.error("error", err);
	}
);

module.exports = {
	getTencentCloudInstances: () => {
		return client.DescribeInstances(params);
	},
};

/* 数据示例  Uuid 是实例的唯一标识，可以用于查询实例的详细信息 
{
  "Response": {
    "InstanceSet": [
      {
        "BlueprintId": "lhbp-r8j2ftq0",
        "BundleId": "bundle_starter_mc_med2_02",
        "CPU": 2,
        "CreatedTime": "2023-12-27T12:33:54Z",
        "ExpiredTime": "2025-12-27T12:33:54Z",
        "InitInvocationId": "",
        "InstanceChargeType": "PREPAID",
        "InstanceId": "lhins-kidjvnd7",
        "InstanceName": "OpenCloudOS-7QaG",
        "InstanceRestrictState": "NORMAL",
        "InstanceState": "RUNNING",
        "InstanceViolationDetail": null,
        "InternetAccessible": {
          "InternetChargeType": "TRAFFIC_POSTPAID_BY_HOUR",
          "InternetMaxBandwidthOut": 4,
          "PublicIpAssigned": true
        },
        "IsolatedTime": null,
        "LatestOperation": "RebootInstances",
        "LatestOperationRequestId": "9f14eabe-e183-4321-9c20-361c4e5892e8",
        "LatestOperationStartedTime": "2025-01-24T08:11:22Z",
        "LatestOperationState": "SUCCESS",
        "LoginSettings": {
          "KeyIds": []
        },
        "Memory": 2,
        "OsName": "OpenCloudOS 9",
        "Platform": "OPENCLOUDOS",
        "PlatformType": "LINUX_UNIX",
        "PrivateAddresses": [
          "10.0.8.9"
        ],
        "PublicAddresses": [
          "114.132.41.169"
        ],
        "PublicIpv6Addresses": [
          "2402:4e00:c011:1700:4ee0:27aa:3aa6:0"
        ],
        "RenewFlag": "NOTIFY_AND_MANUAL_RENEW",
        "SupportIpv6Detail": {
          "Detail": "HAD_BEEN_ASSIGNED",
          "IsSupport": false,
          "Message": "当前实例已经分配IPv6地址。"
        },
        "SystemDisk": {
          "DiskId": "lhdisk-o6ng0v1h",
          "DiskSize": 50,
          "DiskType": "CLOUD_SSD"
        },
        "Tags": [],
        "Uuid": "7cbb660a-0a34-4fb7-aabd-fc2305bd3b26",
        "Zone": "ap-guangzhou-3"
      }
    ],
    "RequestId": "0f15c1ab-dc53-4ab3-980a-594d91c6bfc3",
    "TotalCount": 1
  }
}
*/
