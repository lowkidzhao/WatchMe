import { createApp } from "vue";
import { createPinia } from "pinia";
import "modern-css-reset/dist/reset.min.css"; // 引入 Reset.css
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
const vuetify = createVuetify({
	icons: {
		defaultSet: "mdi", // This is already the default value - only for display purposes
	},
});

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
