<template>
  <v-card max-width="344">
    <v-text-field
      color="primary"
      :loading="!completed && !aborted"
      disabled
      loader-height="3"
      height="1"
    >
    </v-text-field>

    <v-card-subtitle>
      <span v-if="patchBaySub.pubSub">✔ PubSub | </span>
      <span>Tmeout MS: {{ patchBaySub.timeout }}</span>
    </v-card-subtitle>

    <v-card-text>
      <p v-if="completed">
        {{ responseAsText }}
      </p>

      <p v-if="cancelledOn" class="red--text">
        Cancel clicked on {{ cancelledOn }}
      </p>

      <p v-if="timedoutOn" class="red--text">Timedout on {{ timedoutOn }}</p>

      <div v-if="!completed">
        <div>Example invoke:</div>
        <div class="text--primary">curl {{ fullUrl }} -d "Hello World"</div>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        @click="cancel"
        text
        color="error"
        :class="{ 'd-none': completed || aborted }"
        >Cancel</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    patchBaySub: {
      type: Object,
      required: true // TODO: Maybe make a default function that can auto-generate all the props in here? Also, https://vuejs.org/v2/guide/components-props.html#Type-Checks
    }
  },
  data() {
    return {
      responseAsText: null,
      fullUrl: null,
      completed: false,
      aborted: false,

      cancelledOn: null,
      timedoutOn: null,

      // TODO how to make private??
      controller: new AbortController()
    }
  },
  created: async function() {
    if (this.patchBaySub.linkCode.length == 0) {
      throw Error('link is a required parameter!')
    }

    const signal = this.controller.signal

    // If user cancels, dont trigger this timeout.
    this.abortTimeout = setTimeout(() => {
      this.controller.abort()
      this.timedoutOn = new Date() // TODO how to moment?
    }, this.patchBaySub.timeout)

    this.fullUrl = this.patchBaySub.patchBaseUrl + this.patchBaySub.linkCode

    if (this.patchBaySub.pubSub) {
      this.fullUrl += '?pubsub=true'
    }

    try {
      const response = await fetch(this.fullUrl, { signal })
      const responseAsText = await response.text()

      this.responseAsText = responseAsText
      this.completed = true
    } catch (err) {
      if (err.name === 'AbortError') {
        this.completed = true
        this.aborted = true
      }
    }
  },
  methods: {
    cancel() {
      clearTimeout(this.abortTimeout)
      this.controller.abort()
      this.completed = true
      this.aborted = true
      this.cancelledOn = new Date() // TODO how to moment?
    }
  }
}
</script>
