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
}

export const mutations = {
  setDefaultPatchUrl(state, url) {
    state.defaultPatchUrl = url
  },
  generate(state, linkCode) {
    state.patchLink = linkCode
  }
}
