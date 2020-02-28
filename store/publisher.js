import Vue from 'vue'

export const state = () => ({
  publishedRequests: {},

  patchLink: '',
  patchBaseUrl: '',

  nextId: 1
})

export const getters = {
  getPatchLink: (state, getters, rootState) => {
    if(state.patchLink == '') {
      return rootState.patchLink;
    }
    return state.patchLink;
  },

  getPatchBaseUrl: (state, getters, rootState) => {
    if(state.patchBaseUrl == '') {
      return rootState.patchUrl;
    }
    return state.patchBaseUrl;
  }
}

export const actions = {
  
  updatePatchBaseUrl({ commit }, patchBaseUrlRequest) {
    commit('setPatchBaseUrl', patchBaseUrlRequest.patchBaseUrl)
  },
  updatePatchLink({ commit }, patchLinkRequest) {
    commit('setPatchLink', patchLinkRequest.patchLink)
  },

  async addPublishedRequest({ commit, state }, publishedRequest) {
    commit('incrementLastId')
    commit('newPublishedRequest', {
      id: state.nextId,

      url: publishedRequest.patchUrl,
      payload: publishedRequest.patchPayload,
      pubsub: publishedRequest.patchPubSub
    })
  }
}

export const mutations = {
  newPublishedRequest:  (state, publishedRequest) => Vue.set(state.publishedRequests, publishedRequest.id, publishedRequest),
  incrementLastId:  (state) => state.nextId++,

  setPatchBaseUrl:  (state, patchBaseUrl) => state.patchBaseUrl = patchBaseUrl,
  setPatchLink:  (state, patchLink) => state.patchLink = patchLink,
}