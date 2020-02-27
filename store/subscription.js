import buildUrl from 'build-url';

export const state = () => ({
  subscriptions: [],
  nextId: 1
})

export const getters = {
}

export const actions = {
  async addSubscription({ commit, state }, subscription) {

    commit('incrementLastId')

    commit('newSubscription', {
      id: state.nextId,

      fullUrl: subscription.fullUrl,
      notification: subscription.notification,
      pubSub: subscription.pubSub,
      timeout: subscription.timeout,

      responseAsText: null,
      completedOn: false,
      completedState: null
    })

    const abortController = new AbortController()
    const signal = abortController.signal

    // Configure timer to fire abort controller.
    if (subscription.timeout > 0) {
      // If user cancels, dont trigger this timeout.
      subscription.abortTimeout = setTimeout(() => {
        abortController.abort()
        // This is needed to let the abort trigger the below try/catch. Aborting causes the fetch to throw.
        setTimeout(() => {
          this.setCompleted('timedout');
          //this.maybeNotify() // TODO: FIX!
        })
      }, subscription.timeout)
    }

    
    const url = buildUrl(this.PatchUrl, {
      queryParams: {
        pubsub: this.pubSub
      }
    });

  },
}

export const mutations = {
  newSubscription:  (state, subscription) => state.subscriptions.push(subscription),
  updateSubscription:  (state, subscription) => {
    const index = state.subscriptions.findIndex(todo => todo.id === updTodo.id);
    if (index !== -1) {
      state.todos.splice(index, 1, updTodo);
    }
  },
  incrementLastId:  (state) => state.nextId++,
}
