import buildUrl from 'build-url';
import Vue from 'vue'

export const state = () => ({
  subscriptions: {},
  nextId: 1
})

export const getters = {
  subscriptions:  (state) => state.subscriptions,
  getSubscriptionById: (state) => (id) => {
    return state.subscriptions[id];
  }
}

export const actions = {
  async addSubscription({ commit, state }, subscriptionRequest) {

    const id = state.nextId

    const finalUrl = buildUrl(subscriptionRequest.url, {
      path: subscriptionRequest.path,
      queryParams: {
        pubsub: subscriptionRequest.pubsub
      }
    });

    const newSubscription = Object.assign({}, {
      id,

      url: finalUrl,
      baseUrl: subscriptionRequest.url,
      path: subscriptionRequest.path,
      pubsub: subscriptionRequest.pubsub,

      notification: subscriptionRequest.notification,
      timeout: subscriptionRequest.timeout,
    });

    commit('incrementLastId')

    commit('newSubscription', newSubscription)

    const { CancelToken } = this.$axios

    try {
      const response = await this.$axios.$get(finalUrl, {
        timeout:  newSubscription.timeout,
        cancelToken: new CancelToken(cancel => {
          commit('setSubscriptionCancel', { 
            id,
            cancel 
          })
        }),
        responseType: 'text'
      })

      commit('setSubscriptionResponseText', { 
        id,
        responseAsText: response.data
      })
      
      setCompleted(commit, id, 'success');
    } catch (err) {
      if (!err.message) {
        // Axios doesn't seem to tell us anything if an abort happens
        setCompleted(commit, 'aborted');
        return;
      }
      if(err.message.indexOf('Network Error') > -1){
        console.error(err)
        setCompleted(commit, id, 'failed');
      }
      if(err.message.indexOf('timeout') > -1){
        setCompleted(commit, id, 'timedout');
      }
    }

    return state.nextId

  },
  removeSubscription({ commit }, subscription) {
    commit('deleteSubscription', { id: subscription.id })
  },
  cloneSubscription({ state, dispatch }, subscription) {
    const stateSubscription = state.subscriptions[subscription.id];
    dispatch('addSubscription', {
      url: stateSubscription.baseUrl,
      path: stateSubscription.path,
      pubsub: stateSubscription.pubsub,
      notification: stateSubscription.notification,
      timeout: stateSubscription.timeout,
    });
  },  
  cancelSubscription({ commit, state }, payload){
    const stateSubscription = { ...state.subscriptions[payload.id] };
    // completedState can only be set once.
    if(stateSubscription) {
      stateSubscription.cancel();
      setCompleted(commit, payload.id, 'aborted');
    }
  }
}

export const mutations = {
  newSubscription:  (state, subscription) => Vue.set(state.subscriptions, subscription.id, subscription),
  setSubscriptionCancel:  (state, subscription) => {
    const stateSubscription = state.subscriptions[subscription.id];
    // completedState can only be set once.
    if(stateSubscription) {
      stateSubscription.cancel = subscription.cancel;
    }
  },
  deleteSubscription: (state, subscription) => {
    Vue.delete(state.subscriptions, subscription.id);
  },
  setSubscriptionResponseText:  (state, subscription) => {
    const stateSubscription = state.subscriptions[subscription.id];
    // completedState can only be set once.
    if(stateSubscription) {
      Vue.set(stateSubscription, 'responseAsText', subscription.responseAsText)
    }
  },
  setSubscriptionCompletedState:  (state, subscription) => {
    const stateSubscription = state.subscriptions[subscription.id];
    // completedState can only be set once.
    if(stateSubscription && !stateSubscription.completedOn) {
      Vue.set(stateSubscription, 'completedOn', subscription.completedOn)
      Vue.set(stateSubscription,'completedState', subscription.completedState)
    }
  },
  incrementLastId:  (state) => state.nextId++,
}

function setCompleted(commit, id, completedState) {
  commit('setSubscriptionCompletedState', {
    id,
    completedOn: new Date(),
    completedState: completedState
  })
}