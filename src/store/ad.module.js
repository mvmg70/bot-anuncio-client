import { get, post } from "@/services/api.service";

export const adStore = {
  namespaced: true,
  state: () => ({
    loadAds: true,
    ads: [],
  }),

  actions: {
    async getAds({ commit }, uf = null) {
      let filter = `?filter=%7B%22where%22%3A%7B%22active%22%3A%22approved%22%7D%7D`;
      if (uf) filter = `?filter=%7B%22where%22%3A%7B%22active%22%3A%22approved%22%2C%22locale.uf%22%3A%22${uf.split("-")[1]}%22%7D%7D`;

      commit("START_LOAD_ADS");
      var ads = await get("ads" + filter);
      commit("SET_ADS", ads.data);
      commit("FINISH_LOAD_ADS");
    },

    async searchAds({ commit }, search) {
      let filter = `?filter=%7B%22offset%22%3A%200%2C%20%22limit%22%3A%2050%2C%20%22where%22%3A%20%7B%20%22active%22%3A%20%22approved%22%2C%22locale.uf%22%3A%22SP%22%2C%20%22title%22%3A%20%7B%20%22regexp%22%3A%20%22${search}%22%20%7D%7D%7D`;

      commit("START_LOAD_ADS");
      var ads = await get("ads" + filter);
      commit("SET_ADS", ads.data);
      commit("FINISH_LOAD_ADS");
    },

    // eslint-disable-next-line no-empty-pattern
    async moreViews({}, id) {
      let response = await get(`ads/${id}/more`);
      return response;
    },

    // eslint-disable-next-line no-empty-pattern
    async saveAds({}, data) {
      let response = await post(`users/${data.id}/advertisings`, data.ads);
      return response;
    },

    // eslint-disable-next-line no-empty-pattern
    async getAdsById({}, id) {
      var ads = await get(`ads/${id}`);
      return ads;
    },
  },

  mutations: {
    SET_ADS(state, ads) {
      state.ads = ads;
    },
    START_LOAD_ADS(state) {
      state.loadAds = true;
    },
    FINISH_LOAD_ADS(state) {
      state.loadAds = false;
    },
  },

  getters: {
    allAds(state) {
      return state.ads;
    },
    isLoadingAds(state) {
      return state.loadAds;
    },
  },
};
