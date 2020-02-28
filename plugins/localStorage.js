import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  window.onNuxtReady(() => {
    createPersistedState({
        key: 'vuex',
        rehydrated: store => {
          for (const [id, value] of Object.entries(store.state.subscription.subscriptions)) {
            if(!value.completedOn) {
              value.completedOn = new Date(),
              value.completedState = 'aborted'
            }
          }
        }
    })(store)
  })
}