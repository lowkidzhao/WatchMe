import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useSnackdataStore = defineStore("snackdata", () => {
	const snackbar = ref(false);
	const timeout = ref(2000);
	const text = ref("");
	const color1 = ref("success");
	const color2 = ref("white");
	// 修正函数定义语法
	function success(message) {
		text.value = message;
		color1.value = "success";
		color2.value = "white";
		snackbar.value = true;
	}
	// 修正函数定义语法
	function error(message) {
		text.value = message;
		color1.value = "error";
		color2.value = "white";
		snackbar.value = true;
	}
	return { snackbar, timeout, text, color1, color2, success, error };
});
