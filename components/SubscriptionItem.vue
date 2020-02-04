<template v-slot:default>
  <v-list-item>    

    <v-list-item-icon>
      <v-icon
        @click="cancel"
        text
        color="error"
        v-if="!completedOn"
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
          v-if="!completedState"
        >
        </v-text-field>
      </v-list-item-title>

      <v-list-item-subtitle class="text--primary" v-if="completedState">
        <v-list-item-content>
          <span class="success--text" v-if="completedState === 'success'">
            COMPLETED {{ completedOn | moment('MM/DD h:m:s') }}
          </span>
          <span class="secondary--text" v-if="completedState === 'aborted'">
            CANCELLED {{ completedOn | moment('MM/DD h:m:s') }}
          </span>
          <span class="secondary--text" v-if="completedState === 'timedout'">
            TIMEOUT {{ completedOn | moment('MM/DD h:m:s') }}
          </span>
        </v-list-item-content>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
          <strong>Url:</strong>
          <a href="fullUrl">{{ fullUrl }}</a>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <div v-if="!completedState">
          <strong>Publish with CURL:</strong>
          <span class="text--primary">curl {{ fullUrl }} -d "Hello World"</span>
        </div>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>PubSub: </strong><span>{{ patchSub.pubSub }}</span>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <strong>Timeout: </strong><span>{{ patchSub.timeout > 0 ? patchSub.timeout : "none" }}</span>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        <div v-if="responseAsText">
          <strong class="title success--text">Response:</strong>
          <p>{{ responseAsText }}</p>
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
      responseAsText: null,
      fullUrl: null,

      completedOn: false,
      completedState: null,

      // TODO: How to use private instance variables?
      abortController: new AbortController()
    }
  },
  computed: {
    completed: {
      // getter
      get: function() {
        return {
          completedOn: this.completedOn,
          completedState: this.completedState
        }
      },
      // setter
      set: function(state) {
        this.completedOn = new Date()
        this.completedState = state

        if (this.patchSub.notification) {
          if (process.client) {
            let body = ''

            if (state === 'success') {
              body += '\n' + this.responseAsText
            } else {
              body += this.patchSub.linkCode
            }

            this.$notification.show(
              `Patch Me: ${state}`,
              {
                body: body
              },
              {}
            )
          }
        }
      }
    }
  },
  created: async function() {
    if (this.patchSub.linkCode.length == 0) {
      throw Error('link is a required parameter!')
    }

    const signal = this.abortController.signal

    if(this.patchSub.timeout > 0) {
      // If user cancels, dont trigger this timeout.
      this.abortTimeout = setTimeout(() => {
        this.abortController.abort()
          // This is needed to let the abort trigger the below try/catch. Aborting causes the fetch to throw.
          setTimeout(() => {
            this.completed = 'timedout'
          });
      }, this.patchSub.timeout)
    }

    this.fullUrl = this.patchSub.patchBaseUrl + this.patchSub.linkCode

    // TODO: Use a URL builder instead of this, fine for MVP.
    if (this.patchSub.pubSub) {
      this.fullUrl += '?pubsub=true'
    }

    try {
      const response = await fetch(this.fullUrl, { signal })
      const responseAsText = await response.text()

      this.responseAsText = responseAsText
      this.completed = 'success'
    } catch (err) {
      console.log(err)
      if (err.name === 'AbortError') {
        this.completed = 'aborted'
      }
    } finally {
      clearTimeout(this.abortTimeout)
    }
  },
  methods: {
    cancel() {
      clearTimeout(this.abortTimeout)
      this.abortController.abort()
      this.completed = 'aborted'
    }
  }
}
</script>
