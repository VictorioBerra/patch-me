

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage
// })

// export const plugins = [vuexLocal.plugin];

export const state = () => ({
  publishedRequests: [],
  nextId: 1
})

export const getters = {
  allPublishedRequests: state => state.publishedRequests
}

export const actions = {
  async addPublishedRequest({ commit, state }, publishedRequest) {
    commit('incrementLastId')
    commit('newPublishedRequest', {
      id: state.nextId,
      url: publishedRequest.patchUrl,
      payload: publishedRequest.patchPayload,
      pubsub: publishedRequest.patchPubSub
    })
  },
  async deletePublishedRequest({ commit }, id) {
    commit('removePublishedRequest', id)
  },
  // TODO Filter 
}

export const mutations = {
  setPublishedRequests: (state, publishedRequests) => (state.publishedRequests = publishedRequests),
  newPublishedRequest: (state, publishedRequests) => state.publishedRequests.push(publishedRequests),
  removePublishedRequest: (state, id) =>
    (state.publishedRequests = state.publishedRequests.filter(publishedRequests => publishedRequests.id !== id)),
    incrementLastId:  (state) => state.nextId++,
}