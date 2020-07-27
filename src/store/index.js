import Vue from "vue";
import Vuex from "vuex";
import Toasted from 'vue-toasted';

Vue.use(Vuex);
//Vue.use(Toasted);

export default new Vuex.Store({
  state: {
    $loading: false,
    test: "",
    toasted : Toasted
  },
  mutations: {
    changeTest(state, new_value) {
      state.test = new_value
    }
  },
  actions: {
  },
  modules: {
  }
})
