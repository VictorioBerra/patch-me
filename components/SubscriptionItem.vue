<template v-slot:default>
  <v-list-item>

    <v-list-item-content>
      <v-list-item-title>
        <!-- We use the text field for loading bar because when a card is in the loading state nothing is clickable -->
        <v-text-field
          color="primary"
          loading
          disabled
          loader-height="3"
          height="1"
          v-if="!subscription.completedState"
        >
        </v-text-field>
      </v-list-item-title>

      <v-list-item-subtitle
        class="text--primary"
        v-if="subscription.completedState"
      >
        <!-- TODO: Move stuff like this into its own component -->
        <v-list-item-content>
          <span
            class="success--text"
            v-if="subscription.completedState === 'success'"
          >
            COMPLETED {{ subscription.completedOn | moment('MM/DD h:m:s') }}
          </span>
          <span
            class="secondary--text"
            v-if="subscription.completedState === 'aborted'"
          >
            CANCELLED {{ subscription.completedOn | moment('MM/DD h:m:s') }}
          </span>
          <span
            class="secondary--text"
            v-if="subscription.completedState === 'timedout'"
          >
            TIMEOUT {{ subscription.completedOn | moment('MM/DD h:m:s') }}
          </span>
          <span
            class="red--text"
            v-if="subscription.completedState === 'failed'"
          >
            FAILED (see console) {{ subscription.completedOn | moment('MM/DD h:m:s') }}
          </span>
          <!-- Inturrupted? -->
        </v-list-item-content>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>Url:</strong>
        <a href="subscription.url">{{ subscription.url }}</a>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <div v-if="!subscription.completedState">
          <strong>Publish with CURL:</strong>
          <kbd>curl {{ subscription.url }} -d "Hello World"</kbd>
        </div>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>PubSub: </strong><span>{{ subscription.pubsub }}</span>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>Timeout: </strong
        ><span>{{ subscription.timeout > 0 ? subscription.timeout : 'none' }}</span>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>Looping: </strong
        ><span>{{ subscription.loop  ? 'yes ': 'no' }}</span>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <div v-if="subscription.responseAsText">
          <strong class="title success--text">Response:</strong>
          <p>{{ subscription.responseAsText }}</p>
        </div>
      </v-list-item-subtitle>

    <v-row justify="end">
      <v-col cols="12" sm="2">
            <v-btn 
            v-if="!subscription.completedOn"
            text
            color="error"
            @click="cancel" 
            title="cancel">cancel
            </v-btn>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn 
          text
          @click="clone" 
          title="clone">clone
          </v-btn>
      </v-col>
        <v-col cols="12" sm="2">
          <v-btn 
            text
            color="deep-orange" 
            @click="remove" 
            title="remove">remove
            </v-btn>
        </v-col>
      </v-row>
 
    <v-divider></v-divider>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: ['subscription'],
  computed: {
  },
  created() { var self = this;
    this.$store.subscribe((mutation, state) => {
      if(mutation.type === 'subscription/setSubscriptionCompletedState' &&
          //Check the mutation was intended for this component.
          // Otherwise every component calls notify. This may not scale well.
          mutation.payload.id === self.subscription.id) {
        let subscription = state.subscription.subscriptions[this.subscription.id];
        if(subscription) {
          this.maybeNotify(subscription);
        }
      }
    })      
  },
  methods: {
    cancel() {
      this.$store.dispatch('subscription/cancelSubscription', {
        id: this.subscription.id
      });
    },
    clone() {
      this.$store.dispatch('subscription/cloneSubscription', {
        id: this.subscription.id
      });
    },
    async remove() {
      if(!this.subscription.completedOn) {
        const res = await this.$dialog.confirm({ text: 'Operation in progress. Remove this result?', title: 'Remove?' })
        if (res) {
          await this.$store.dispatch('subscription/cancelSubscription', {
            id: this.subscription.id
          });
          this.$store.dispatch('subscription/removeSubscription', {
            id: this.subscription.id
          });
        }
      } else {
          this.$store.dispatch('subscription/removeSubscription', {
            id: this.subscription.id
          });
      }
    },
    maybeNotify(subscription) {

      // They know.
      if(subscription.completedState === 'aborted') {
        return
      }

      if (subscription.notification) {
        // process.client tells us if we are running client side or server side.
        if (process.client) {
          let body = ''

          if (subscription.completedState === 'success') {
            body += '\n' + subscription.responseAsText
          } else {
            body += subscription.url
          }

          this.$notification.show(
            `Patch Me: ${subscription.completedState}`,
            {
              body: body
            },
          {})
        }
      }
    }
  }
}
</script>
