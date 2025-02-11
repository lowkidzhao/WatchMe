import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/about",
			name: "about",
			// 使用动态导入（Dynamic Import），也称为懒加载（Lazy Loading）。
			component: () => import("../views/AboutView.vue"),
		},
	],
});

export default router;
