import { ref, reactive } from "vue";
import { defineStore } from "pinia";

export const useComputersStore = defineStore("computer", () => {
	// 使用 reactive 创建响应式数据
	const computers = reactive([]);
	const computerNow = ref({});
	const showWaiting = ref(false);

	// 添加电脑信息
	function add(newComputer) {
		computers[0] = newComputer;
		// 将更新后的电脑信息存入本地存储
		localStorage.setItem("computers", JSON.stringify(computers));
	}

	// 定位目前选择的电脑信息
	function getCurrentComputer(uuid) {
		const index = computers.findIndex(
			(computer) => computer.system.systemInfo.uuid === uuid
		);
		if (index !== -1) {
			// 直接替换 computerNow 对象，确保响应式更新
			computerNow.value = computers[index];
		}
	}

	return { computers, add, computerNow, getCurrentComputer, showWaiting };
});
