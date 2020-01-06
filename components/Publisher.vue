<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model="PatchUrl"
          label="Patch Base Url"
        ></v-text-field>
      </v-col>
    </v-row>
        <v-row>
      <v-col>
        <v-text-field
          v-model="PatchPayload"
          label="Payload"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-switch v-model="pubSub" class="ma-2" label="PubSub"></v-switch>
        </v-col>
    </v-row>
        <v-row>
        <v-col>
          <v-btn block color="secondary" dark @click="post">POST</v-btn>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>

// Todo: would be dope if I could get the last URL generated on the index page

export default {
  data() {
    return {
      PatchUrl: 'https://patchbay.pub/',
      PatchPayload: '',
      pubSub: true
    }
  },
  computed: {},
  methods: {
    async post() {

      if(this.pubSub) {
          this.PatchUrl += '?pubsub=true'
      }

      try
      {
        const response = await fetch(this.PatchUrl, {
          method: 'post',
          body: this.PatchPayload
        })
         this.PatchPayload = '';
      } catch {
        // TODO Vue toast/notifications
      }

    }
  }
}
</script>
