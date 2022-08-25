import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";

import router from "./router/index";

//test
import VueConfetti from "vue-confetti";

createApp(App).use(router).use(VueConfetti).mount("#app");
