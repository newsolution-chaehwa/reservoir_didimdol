const reservoirModule = {
  namespaced: true,

  state: () => ({
    reserovoirInfo: {},
  }),

  mutations: {
    SET_RESERVOIR_INFO(state, payload) {
      state.reserovoirInfo = payload;
    },
  },

  getters: {
    GET_RESERVOIR_INFO(state) {
      return state.reserovoirInfo;
    },
  },
};

export default reservoirModule;
