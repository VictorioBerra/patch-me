import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
        key: 'vuex',
        rehydrated: val => {
          // Clear any incomplete HTTP requests
          for (const [id, value] of Object.entries(val.state.subscription.subscriptions)) {
            if(!value.completedOn) {
              value.completedOn = new Date(),
              value.completedState = 'aborted'
            }
          }
        },
        reducer (val) {                                
          if(val.reset === true) {           
            return {}
          }
          return val
        }
    })(store)
  })
}