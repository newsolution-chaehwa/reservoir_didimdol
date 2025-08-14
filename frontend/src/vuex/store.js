import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import reservoirModule from "./modules/reservoir.js";
import mapModule from "./modules/map.js";

const store = createStore({
  modules: {
    reservoir: reservoirModule,
    map: mapModule,
  },

  plugins: [createPersistedState()],
});

export default store;
 