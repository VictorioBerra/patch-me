<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="PatchBaseUrl"
          label="Patch Base Url"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="patchLink" label="Patch Link"></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          dark
          large
          @click="generate"
          class="primary"
          title="Generate Random"
        >
      <v-icon
        title="generate random"
        >mdi-refresh</v-icon
      >
        </v-btn>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          dark
          large
          block
          @click="add"
          :disabled="patchLink.length <= 6"
          class="deep-purple accent-4"
        >
          Add
        </v-btn>
        <!-- TODO: Add a button to copy the current configuration over to the publisher. And maybe back again. -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <v-switch v-model="pubSub" class="ma-2" label="PubSub"></v-switch>
      </v-col>
      <v-col cols="12" md="3">
        <v-switch
          v-model="notification"
          class="ma-2"
          label="Notification"
        ></v-switch>
      </v-col>
      <v-col cols="12" md="3">
        <v-switch
          v-model="timeout"
          class="ma-2"
          label="Timeout"
        ></v-switch>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field 
        v-model="timeoutMs" 
        label="timeout MS" 
        :disabled="!timeout">
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-toolbar dark>
        <v-toolbar-title>Subscriptions</v-toolbar-title>
      </v-toolbar>
      <v-list width="100%">
        <template v-for="patchSub in PatchSubscriptions">
          <SubscriptionItem :patchSub="patchSub" :key="patchSub.id"></SubscriptionItem>
        </template>
      </v-list>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SubscriptionItem from '~/components/SubscriptionItem.vue'

export default {
  components: {
    SubscriptionItem
  },
  data() {
    return {
      PatchBaseUrl: 'https://patchbay.pub/',
      pubSub: true,
      notification: true,
      timeoutMs: 60000,
      timeout: true,
      PatchSubscriptions: []
    }
  },
  computed:{
    ...mapGetters({
      patchLink: 'patchLink' // TODO: Test with shorthand prop
    })
  },
  methods: {
    ...mapActions({
      generate: 'newLinkCode'
    }),
    add() {
      this.$store.dispatch('subscription/addSubscription', {
        fullUrl: this.PatchBaseUrl + this.patchLink,
        notification: this.notification,
        pubSub: this.pubSub,
        timeout: this.timeout ? this.timeoutMs : null
      })
    }
  },
  created() {
    if(this.patchLink === '') {
      this.$store.dispatch('newLinkCode'); // Todo move to constants file.
    }
  }
}
</script>
