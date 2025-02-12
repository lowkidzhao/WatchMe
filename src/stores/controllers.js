import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useControllersStore = defineStore("controllers", () => {
	const drawerside = ref(false);

	function changedrawer() {
		drawerside.value = !drawerside.value;
	}

	return { drawerside, changedrawer };
});
