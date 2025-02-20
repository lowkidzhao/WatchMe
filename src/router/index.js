import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MotionView from "../views/MotionView.vue";
import InfoView from "@/views/InfoView.vue";
import ServerView from "@/views/ServerView.vue";
import ServerMotionView from "@/views/ServerMotionView.vue";

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/motion/:uuid",
			name: "motion",
			component: MotionView,
		},
		{
			path: "/info/:uuid",
			name: "info",
			component: InfoView,
		},
		{
			path: "/server",
			name: "server",
			component: ServerView,
		},
		{
			path: "/server/motion/:uuid",
			name: "serverMotion",
			component: ServerMotionView,
		},
	],
});

export default router;
