import uuidv4 from 'uuid/v4'

export const state = () => ({
    patchLink: '',
    patchUrl: 'http://localhost:9001',// 'https://patchbay.pub/'
})

export const getters = {
}

export const actions = {
  updateDefaultPatchUrl({ commit }, payload) {
    commit('setDefaultPatchUrl', payload.url)
  },
  newLinkCode({ commit }) {
    let newLinkCode = uuidv4();
    commit('generate', newLinkCode)
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
