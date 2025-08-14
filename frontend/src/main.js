import { createApp } from "vue";
import App from "./App.vue";

import "leaflet/dist/leaflet.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ko from "element-plus/dist/locale/ko.min.mjs";

import axios from "axios";

import router from "./router/index.js";
import store from "./vuex/store.js";

import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

import initializeReservoirList from "./modules/init/initializeReservoirList.js";

initializeReservoirList;

import "moment/locale/ko";

let app = createApp(App);
// Element Plus Icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.config.globalProperties.$axios = axios;
app.use(ElementPlus, { locale: ko }).use(router).use(store).mount("#app");
