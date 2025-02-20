import { reactive } from "vue";
import { defineStore } from "pinia";

export const useDataStore = defineStore("data", () => {
	const params = reactive({
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
	});
	//服务器
	const server = reactive({
		Response: {
			ProductList: [
				{
					Namespace: "test/17_01",
					ProductEnName: "shan_17_01_policy01",
					ProductName: "shan_17_01_policy01",
				},
			],
			RequestId: "addfaffqqn",
			TotalCount: 1,
		},
	});

	return { params, server };
});
