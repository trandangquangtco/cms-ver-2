import Vue from "vue"
import App from "./App.vue"
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/src/jquery.js";
import "./registerServiceWorker";
import Toasted from "vue-toasted";

import router from "./router"
import store from "./store"

import axios from "axios";
import VueSweetalert2 from 'vue-sweetalert2';
 
// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';
 
Vue.use(VueSweetalert2);
Vue.use(Toasted);

Vue.config.productionTip = false

//Khai bao bien global
Vue.prototype.$configs = {
  api: "https://ext.botup.io/v1/",
  // api: "http://localhost:1337/v1/",
};
Vue.prototype.$http = axios;
Vue.prototype.$loading = false;
Vue.prototype.$userLogged = JSON.parse(localStorage.getItem("user-cms")) || null;

//Check token login
if (Vue.prototype.$userLogged) {
  Vue.prototype.$http.defaults.headers.common["x-botup-token"] = Vue.prototype.$userLogged.token;
  Vue.prototype.$http.get(Vue.prototype.$configs.api + "users/users/getuser")
    .then((reponses) => {
      if (reponses.data.data) {

        //  reponses.data.data.token = Vue.prototype.$userLogged.token;
        localStorage.setItem("user-cms", JSON.stringify(reponses.data.data));
      }
      else
        localStorage.removeItem("user-cms");
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem("user-cms");
    })
}

Vue.filter("loading", value => {
  console.log("value", value);
  Vue.prototype.$loading = value;
  console.log("loading", Vue.prototype.$loading);

  return value
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")



