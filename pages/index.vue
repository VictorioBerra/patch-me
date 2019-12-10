<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="PatchBaseUrl"
          label="Patch Base Url"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11">
        <v-text-field
          v-model="PatchBayLink"
          label="Patch Bay Link"
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <v-btn
          dark
          large
          @click="add"
          :disabled="PatchBayLink.length <= 6"
          class="primary"
        >
          Add
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
          <v-switch v-model="pubSub" class="ma-2" label="PubSub"></v-switch>
          <v-switch v-model="notification" class="ma-2" label="Notification"></v-switch>
      </v-col>
      <v-col>
        <v-text-field
          v-model="timeout"
          label="timeout"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="patchBaySub in PatchPaySubscriptions"
        :key="patchBaySub.id"
        cols="6"
        md="4"
      >
        <PatchBayCard :patchBaySub="patchBaySub"></PatchBayCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import uuidv4 from 'uuid/v4';

import PatchBayCard from "~/components/PatchBayCard.vue";

export default {
 components: {
    PatchBayCard
  },  
  data() {
    return {
      PatchBaseUrl: 'https://patchbay.pub/',
      PatchBayLink: uuidv4(),
      pubSub: true,
      notification: true,
      timeout: 60000,
      PatchPaySubscriptions: []
    }
  },
  computed: {},
  methods: {
    add() {
      this.PatchPaySubscriptions.push({
        id: this.PatchPaySubscriptions.length + 1,
        patchBaseUrl: this.PatchBaseUrl,
        linkCode: this.PatchBayLink,
        pubSub: this.pubSub,
        timeout: this.timeout,
      })
      this.PatchBayLink = uuidv4()
    }
  }
}
</script>
