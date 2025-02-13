import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useComputersStore = defineStore("computers", () => {
	const computers = ref([]);

	function add(newComputer) {
		// 查找是否存在相同 uuid 的电脑信息
		const index = computers.value.findIndex(
			(computer) =>
				computer.system.systemInfo.uuid === newComputer.system.systemInfo.uuid
		);
		if (index !== -1) {
			// 如果存在相同 uuid 的电脑信息，则替换原有信息
			computers.value[index] = newComputer;
		} else {
			// 如果不存在，则添加新的电脑信息
			computers.value.push(newComputer);
		}
		// 将更新后的电脑信息存入本地存储
		localStorage.setItem("computers", JSON.stringify(computers.value));
	}

	return { computers, add };
});
