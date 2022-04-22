import {get, post, deleteAd } from "@/services/api.service";

export const adStore = {
    namespaced: true,
    state: () => ({
        loadAds: true,
        ads: [],
    }),

    actions: {
        async getAds({ commit, rootState }, data = {}) {
            let userLocale = rootState.user.locale;
            let filter = {
                filter: {
                    where: {
                        and: [{ or: [{ typeLocation: "country" }, { typeLocation: "word" }] }, { active: "approved" }],
                    },
                },
            };

            if (userLocale.latitude) {
                let uf = userLocale.principalSubdivisionCode.split("-")[1];
                filter.filter.where.and[0].or.push({ "locale.uf": uf });
            }
            if (data.search) {
                var pattern = `/.*${data.search}.*/i`;
                filter.filter.where.and.push({ or: [{ title: { regexp: pattern } }, { description: { regexp: pattern } }] });
            }

            commit("START_LOAD_ADS");
            var ads = await get("advertisings", filter);
            commit("SET_ADS", ads.data);
            commit("FINISH_LOAD_ADS");
        },

        // eslint-disable-next-line no-empty-pattern
        async moreViews({}, id) {
            let response = await get(`advertisings/${id}/more`);
            return response;
        },

        // eslint-disable-next-line no-empty-pattern
        async saveAds({}, data) {
            let response = await post(`users/${data.id}/advertisings`, data.ads);
            return response;
        },

        // eslint-disable-next-line no-empty-pattern
        async deleteAds({ rootState }, id) {
            let userID = rootState.user.current.id;
            let response = await deleteAd(`users/${userID}/advertisings/${id}`);
            return response;
        },

        // eslint-disable-next-line no-empty-pattern
        async getAdsById({}, id) {
            var ads = await get(`advertisings/${id}`);
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