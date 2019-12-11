<template>
  <v-card max-width="344">
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

    <v-list-item one-line v-if="completedState">
      <v-list-item-content>
        <v-list-item-title
          class="overline success--text"
          v-if="completedState === 'success'"
        >
          COMPLETED {{ completedOn | moment('MM/DD h:m:s') }}
        </v-list-item-title>
        <v-list-item-title
          class="overline secondary--text"
          v-if="completedState === 'aborted'"
        >
          CANCELLED {{ completedOn | moment('MM/DD h:m:s') }}
        </v-list-item-title>
        <v-list-item-title
          class="overline secondary--text"
          v-if="completedState === 'timedout'"
        >
          TIMEOUT {{ completedOn | moment('MM/DD h:m:s') }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-card-text v-if="responseAsText">
      <p>{{ responseAsText }}</p>
    </v-card-text>

    <v-card-text v-if="!completedState">
      <strong>Publish with CURL:</strong>
      <p class="text--primary">curl {{ fullUrl }} -d "Hello World"</p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        @click="cancel"
        text
        color="error"
        :class="{ 'd-none': completedOn }"
        >Cancel</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn text disabled>
        <span v-if="patchSub.pubSub">✔ PubSub | {{ patchSub.timeout }}</span>
      </v-btn>
    </v-card-actions>
  </v-card>
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
            let body = '';

            if (state === 'success') {
              body += '\n' + this.responseAsText
            } else {
              body += this.patchSub.linkCode;
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

    // If user cancels, dont trigger this timeout.
    this.abortTimeout = setTimeout(() => {
      this.abortController.abort()
      this.completed = 'timedout'
    }, this.patchSub.timeout)

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
