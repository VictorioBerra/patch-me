<template v-slot:default>
  <v-list-item>
    <v-list-item-icon>
      <v-icon
        @click="cancel"
        text
        color="error"
        v-if="!patchSub.completedOn"
        title="cancel"
        >mdi-close-circle-outline</v-icon
      >
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>
        <!-- We use the text field for loading bar because when a card is in the loading state nothing is clickable -->
        <v-text-field
          color="primary"
          loading
          disabled
          loader-height="3"
          height="1"
          v-if="!patchSub.completedState"
        >
        </v-text-field>
      </v-list-item-title>

      <v-list-item-subtitle
        class="text--primary"
        v-if="patchSub.completedState"
      >
        <v-list-item-content>
          <span
            class="success--text"
            v-if="patchSub.completedState === 'success'"
          >
            COMPLETED {{ patchSub.completedOn | moment('MM/DD h:m:s') }}
          </span>
          <span
            class="secondary--text"
            v-if="patchSub.completedState === 'aborted'"
          >
            CANCELLED {{ patchSub.completedOn | moment('MM/DD h:m:s') }}
          </span>
          <span
            class="secondary--text"
            v-if="patchSub.completedState === 'timedout'"
          >
            TIMEOUT {{ patchSub.completedOn | moment('MM/DD h:m:s') }}
          </span>
        </v-list-item-content>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>Url:</strong>
        <a href="fullUrl">{{ patchSub.fullUrl }}</a>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <div v-if="!patchSub.completedState">
          <strong>Publish with CURL:</strong>
          <kbd>curl {{ patchSub.fullUrl }} -d "Hello World"</kbd>
        </div>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>PubSub: </strong><span>{{ patchSub.pubSub }}</span>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>Timeout: </strong
        ><span>{{ patchSub.timeout > 0 ? patchSub.timeout : 'none' }}</span>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <div v-if="patchSub.responseAsText">
          <strong class="title success--text">Response:</strong>
          <p>{{ patchSub.responseAsText }}</p>
        </div>
      </v-list-item-subtitle>

      <v-divider></v-divider>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    patchSub: {
      type: Object,
      required: true // TODO: Maybe make a default function that can auto-generate all the props in here? Also, https://vuejs.org/v2/guide/components-props.html#Type-Checks
    }
  },
  data() {
    return {

    }
  },
  computed: {
  },
  created: async function() {
    const abortController = new AbortController()

    const signal = abortController.signal

    if (this.patchSub.timeout > 0) {
      // If user cancels, dont trigger this timeout.
      this.patchSub.abortTimeout = setTimeout(() => {
        abortController.abort()
        // This is needed to let the abort trigger the below try/catch. Aborting causes the fetch to throw.
        setTimeout(() => {
          this.setCompleted('timedout');
          this.maybeNotify()
        })
      }, this.patchSub.timeout)
    }

    // TODO: Use a URL builder instead of this, fine for MVP.
    if (this.patchSub.pubSub) {
      this.patchSub.fullUrl += '?pubsub=true'
    }

    try {
      const response = await fetch(this.patchSub.fullUrl, { signal })
      const responseAsText = await response.text()

      this.patchSub.responseAsText = responseAsText
      this.setCompleted('success');
      this.maybeNotify()
    } catch (err) {
      console.log(err)
      if (err.name === 'AbortError') {
        this.setCompleted('aborted');
        this.maybeNotify()
      }
    } finally {
      clearTimeout(this.patchSub.abortTimeout)
    }
  },
  methods: {
    setCompleted(completedState) {
        this.patchSub.completedOn = new Date()
        this.patchSub.completedState = completedState
    },
    cancel() {
      clearTimeout(this.patchSub.abortTimeout)
      abortController.abort()
      this.setCompleted('aborted');
      this.maybeNotify()
    },
    maybeNotify() {
      if (this.patchSub.notification) {
        // process.client tells us if we are running client side or server side.
        if (process.client) {
          let body = ''

          if (this.patchSub.completedState === 'success') {
            body += '\n' + this.patchSub.responseAsText
          } else {
            body += this.patchSub.linkCode
          }

          this.$notification.show(
            `Patch Me: ${this.patchSub.completedState}`,
            {
              body: body
            },
            {}
          )
        }
      }
    }
  }
}
</script>
