import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useDataStore = defineStore("data", () => {
	// cpu
	const cpuname = ref("");
	const cpuspeed = ref("");
	const cputemp = ref("");
	// gpu
	const gpuname = ref("");
	const gpuspeed = ref("");
	const gputemp = ref("");
	// ram
	const totalram = ref("");
	const usedram = ref("");
	const freeram = ref("");
	// storage
	const totalstorage = ref("");
	const usedstorage = ref("");
	const freestorage = ref("");
	// network
	const netspeedup = ref("");
	const netspeeddown = ref("");

	function increment() {
		count.value++;
	}

	return {
		cpuname,
		cpuspeed,
		cputemp,
		gpuname,
		gpuspeed,
		gputemp,
		totalram,
		usedram,
		freeram,
		totalstorage,
		usedstorage,
		freestorage,
		netspeedup,
		netspeeddown,
	};
});
