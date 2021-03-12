<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="patchBaseUrl"
          label="Patch Base Url"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="patchLink" label="Patch Link"></v-text-field>
      </v-col>
      <v-col cols="12" md="1">
        <v-btn
          dark
          small
          @click="generate"
          class="primary"
          title="Generate Random"
        >
      <v-icon
        >mdi-refresh</v-icon
      >
        </v-btn>
      </v-col>
      <v-col cols="12" md="1">
        <v-btn
          dark
          small
          @click="sync"
          class="info"
          title="Sync to Publisher"
        >
      <v-icon
        >mdi-sync</v-icon
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
        <v-switch v-model="pubsub" class="ma-2" label="PubSub"></v-switch>
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
      <v-col cols="12" md="3">
        <v-switch
          v-model="loop"
          class="ma-2"
          label="Loop"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-toolbar dark>
        <v-toolbar-title>Subscriptions</v-toolbar-title>
      </v-toolbar>
      <v-list width="100%">
        <template v-for="(subscription, id) in subscriptions">
          <SubscriptionItem :subscription="subscription" :key="id"></SubscriptionItem>
        </template>
      </v-list>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import SubscriptionItem from '~/components/SubscriptionItem.vue'

export default {
  components: {
    SubscriptionItem
  },
  data() {
    return {
      pubsub: true,
      notification: true,
      timeoutMs: 60000,
      timeout: true,
      loop: false,
    }
  },
  computed:{
    ...mapGetters({
      subscriptions: 'subscription/subscriptions'
    }),
    patchBaseUrl: {
      set(patchBaseUrl) {
        this.$store.dispatch('subscription/updatePatchBaseUrl', { patchBaseUrl })
      },
      get() {
        return this.$store.getters['subscription/getPatchBaseUrl']
      }
    },
    patchLink: {
      set(patchLink) {
        this.$store.dispatch('subscription/updatePatchLink', { patchLink })
      },
      get() {
        return this.$store.getters['subscription/getPatchLink']
      }
    }, 
  },
  methods: {
    ...mapActions({
      generate: 'subscription/generateAndUpdatePatchLink'
    }),
    async add() {
      return await this.$store.dispatch('subscription/addSubscription', {
        url: this.patchBaseUrl,
        path: this.patchLink,
        notification: this.notification,
        pubsub: this.pubsub,
        timeout: this.timeout ? this.timeoutMs : 0, // axios default is 0
        loop: this.loop // axios default is 0
      })
    },
    sync(){
      this.$store.dispatch('publisher/updatePatchBaseUrl', {
        patchBaseUrl: this.patchBaseUrl
      })
      this.$store.dispatch('publisher/updatePatchLink', {
        patchLink: this.patchLink
      })
    }
  }
}
</script>
