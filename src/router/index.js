import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MotionView from "../views/MotionView.vue";
import InfoView from "@/views/InfoView.vue";

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/motion",
			name: "motion",
			component: MotionView,
		},
		{
			path: "/info/:uuid",
			name: "info",
			component: InfoView,
		},
	],
});

export default router;
