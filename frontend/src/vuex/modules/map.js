const mapModule = {
  namespaced: true,

  state: () => ({
    centerLatlng: [34.451248, 126.590949],
  }),

  mutations: {
    SET_CENTER_LATLNG(state, payload) {
      console.log("--->payload", payload);
      state.centerLatlng = payload;
    },
  },

  getters: {
    GET_CENTER_LATLNG(state) {
      return state.centerLatlng;
    },
  },
};

export default mapModule;
