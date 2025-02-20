import { useComputersStore } from "@/stores/mycomputers";
import { fetchTencentCloudConfig } from "@/utils/Tencentcloud-Api";

export default async function initialize() {
	// 初始化函数
	await getdata();
	//获取云服务配置
	return await fetchTencentCloudConfig();
}
async function getdata() {
	// 获取数据函数
	const store = useComputersStore();
	// 从本地存储中获取计算机信息
	const getComputers = JSON.parse(localStorage.getItem("computers"));
	if (getComputers) {
		// 将获取到的计算机信息赋值给 store 中的 computers
		store.computers = getComputers;
		// 如果有计算机信息，将第一条信息赋值给当前选中的计算机
		if (getComputers.length > 0) {
			store.computerNow = getComputers[0];
		}
	} else {
		// 将模拟数据存入本地存储
		localStorage.setItem("computers", JSON.stringify(data));
	}
}

//模拟数据
const data = [
	{
		memory: {},
		cpu: {},
		gpu: {
			models: {
				controllers: [{}],
				displays: [{}],
			},
		},
		network: {
			ip4: [],
			ip6: [],
			mac: [],
		},
		disk: {
			diskinfo: [{}],
			diskusage: [],
		},
		system: {
			systemInfo: {
				manufacturer: "",
				model: "",
				version: "",
				serial: "",
				uuid: "beb85a58-c4ab-11ea-80de-002b67d4f347",
				sku: "",
				virtual: false,
			},
		},
		home: true,
	},
];
