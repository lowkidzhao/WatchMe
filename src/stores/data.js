import { reactive, ref } from "vue";
import { defineStore } from "pinia";

export const useDataStore = defineStore("data", () => {
	const cloud = ref("未选中");
	const monitorData = ref();

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
	const server = reactive();

	function setInstanceMonitorData(data) {
		monitorData.value = data;
	}

	return { params, server, cloud, monitorData, setInstanceMonitorData };
});
