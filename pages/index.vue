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
        <v-text-field v-model="PatchLink" label="Patch Link"></v-text-field>
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
          :disabled="PatchLink.length <= 6"
          class="deep-purple accent-4"
        >
          Add
        </v-btn>
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
import uuidv4 from 'uuid/v4'

import SubscriptionItem from '~/components/SubscriptionItem.vue'

export default {
  components: {
    SubscriptionItem
  },
  data() {
    return {
      PatchBaseUrl: 'https://patchbay.pub/',
      PatchLink: uuidv4(),
      pubSub: true,
      notification: true,
      timeoutMs: 60000,
      timeout: true,
      PatchSubscriptions: []
    }
  },
  computed: {},
  methods: {
    add() {
      this.PatchSubscriptions.push({
        id: this.PatchSubscriptions.length + 1,
        patchBaseUrl: this.PatchBaseUrl,
        linkCode: this.PatchLink,
        notification: this.notification,
        pubSub: this.pubSub,
        timeout: this.timeout ? this.timeoutMs : null
      })
    },
    generate(){
      this.PatchLink = uuidv4()
    }
  }
}
</script>
