import Vue from 'vue'
import buildUrl from 'build-url';
import uuidv4 from 'uuid/v4'

export const state = () => ({
  subscriptions: {},

  patchLink: '',
  patchBaseUrl: '',

  nextId: 1
})

export const getters = {
  subscriptions:  (state) => state.subscriptions,
  getSubscriptionById: (state) => (id) => {
    return state.subscriptions[id];
  },

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
  generateAndUpdatePatchLink({ commit }) {
    commit('setPatchLink', uuidv4())
  },
  setCompleted({ commit }, setCompletedRequest) {
    commit('setSubscriptionCompletedState', {
      id: setCompletedRequest.id,
      completedState: setCompletedRequest.completedState,
      completedOn: new Date(),
    })
  },
  async addSubscription({ commit, dispatch, state }, subscriptionRequest) {

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
        responseType: 'text',
        // https://github.com/axios/axios/issues/907
        transformResponse: [(data) => { return data; }],
      })

      await commit('setSubscriptionResponseText', { 
        id,
        responseAsText: response
      })
      
      dispatch('setCompleted', {
        id,
        completedState: 'success'
      });
    } catch (err) {
      if (!err.message) {
        // Axios doesn't seem to tell us anything if an abort happens
        dispatch('setCompleted', {
          id,
          completedStae: 'aborted'
        });        
        return;
      }
      if(err.message.indexOf('Network Error') > -1){
        console.error(err)
        dispatch('setCompleted', {
          id,
          completedState: 'failed'
        });             
      }
      if(err.message.indexOf('timeout') > -1){
        dispatch('setCompleted', {
          id,
          completedState: 'timedout'
        });           
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
  setPatchBaseUrl:  (state, patchBaseUrl) => state.patchBaseUrl = patchBaseUrl,
  setPatchLink:  (state, patchLink) => state.patchLink = patchLink,
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