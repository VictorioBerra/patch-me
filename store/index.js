const { v4: uuidv4 } = require('uuid');

export const state = () => ({
    // Serves as a starting default for the patchbay path across all components.
    // The idea is to not keep them synced after that initial state set.
    patchLink: uuidv4(),
    patchUrl: 'https://patchbay.pub/'
})

export const actions = {
  updateDefaultPatchUrl({ commit }, payload) {
    commit('setDefaultPatchUrl', payload.url)
  },
  newLinkCode({ commit }) {
    commit('generate', uuidv4())
  },
  reset({ commit }) {
    commit('reset') // this will cause the vue-persist-store plugin to set all state to empty
    location.reload()  
  }
}

export const mutations = {
  reset(state) {
    state.reset = true
  },
  setDefaultPatchUrl(state, url) {
    state.defaultPatchUrl = url
  },
  generate(state, linkCode) {
    state.patchLink = linkCode
  }
}
