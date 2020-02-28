import Vue from 'vue'

export const state = () => ({
  publishedRequests: {},
  nextId: 1
})

// export const getters = {
// }

export const actions = {
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
}