import uuidv4 from 'uuid/v4'

export const state = () => ({
    patchLink: ''
})

export const getters = {
  patchLink: state => state.patchLink
}

export const actions = {
  newLinkCode({ commit }) {
    let newLinkCode = uuidv4();
    commit('generate', newLinkCode)
  },
}

export const mutations = {
  generate(state, linkCode) {
    state.patchLink = linkCode
  }
}
