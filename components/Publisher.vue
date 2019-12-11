<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model="PatchBaseUrl"
          label="Patch Base Url"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="PatchLink"
          label="Patch Link"
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
      PatchBaseUrl: 'https://patchbay.pub/',
      PatchLink: '',
      PatchPayload: '',
      pubSub: true
    }
  },
  computed: {},
  methods: {
    async post() {

      // TODO use URL builder so we dont have to mess with trailing slash
      let URL = this.PatchBaseUrl + this.PatchLink;

      // TODO: Use a URL builder instead of this, fine for MVP.
      if(this.pubSub) {
          URL += '?pubsub=true'
      }

      try
      {
        const response = await fetch(URL, {
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
