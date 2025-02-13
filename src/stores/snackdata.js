import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useSnackdataStore = defineStore("snackdata", () => {
	const snackbar = ref(false);
	const timeout = ref(2000);
	const text = ref("");
	const color1 = ref("success");
	const color2 = ref("white");

	return { snackbar, timeout, text, color1, color2 };
});
