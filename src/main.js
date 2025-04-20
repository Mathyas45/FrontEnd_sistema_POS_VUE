import { createApp } from "vue";
import App from "@/App.vue";
import { registerPlugins } from "@core/utils/plugins";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

// Styles
import "@core/scss/template/index.scss";
import "@styles/styles.scss";

const app = createApp(App);

// Usar Toast en la aplicación
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
});

// Register plugins
registerPlugins(app);

// Mount vue app
app.mount("#app");
