import { reactive, ref } from "vue";
import { defineStore } from "pinia";

export const useDataStore = defineStore("data", () => {
	const cloud = ref("未选中");

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
					Namespace: "",
					ProductEnName: "",
					ProductName: "",
				},
			],
			RequestId: "",
			TotalCount: 0,
		},
	});

	return { params, server, cloud };
});
