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
      <v-col cols="12" md="4">
        <v-btn
          dark
          large
          @click="add"
          :disabled="PatchLink.length <= 6"
          class="primary"
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
        <v-text-field v-model="timeout" label="timeout"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-toolbar dark>
        <v-toolbar-title>Subscriptions</v-toolbar-title>
      </v-toolbar>
      <v-list width="100%">
        <template v-for="patchSub in PatchSubscriptions">
          <PatchCard :patchSub="patchSub" :key="patchSub.id"></PatchCard>
        </template>
      </v-list>
    </v-row>
  </v-container>
</template>

<script>
import uuidv4 from 'uuid/v4'

import PatchCard from '~/components/PatchCard.vue'

export default {
  components: {
    PatchCard
  },
  data() {
    return {
      PatchBaseUrl: 'https://patchbay.pub/',
      PatchLink: uuidv4(),
      pubSub: true,
      notification: true,
      timeout: 60000,
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
        timeout: this.timeout
      })
      this.PatchLink = uuidv4()
    }
  }
}
</script>
