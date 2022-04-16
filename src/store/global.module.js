export const globalStore = {
  namespaced: true,
  state: () => ({
    loadApp: true,
  }),
  actions: {
    setLoadApp({ commit }, status = false) {
      commit("setLoadAPP", status);
    },
  },
  mutations: {
    setLoadAPP(state, status) {
      state.loadApp = status;
    },
  },
  getters: {},
};
