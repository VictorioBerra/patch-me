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
    <v-row>
      <v-col>
          <PublishedRequests></PublishedRequests>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import PublishedRequests from '~/components/PublishedRequests.vue'
import buildUrl from 'build-url';

export default {
  components: {
    PublishedRequests
  },
  data() {
    return {
      PatchUrl: 'https://patchbay.pub/',
      PatchPayload: '',
      pubSub: true
    }
  },
  created: function(){
    if(this.$store.state.patchLink !== '') {
      this.PatchUrl += this.$store.state.patchLink;
    }
  },
  methods: {
    ...mapActions({
      add: 'publisher/addPublishedRequest'
    }),
    async post() {


      const url = buildUrl(this.PatchUrl, {
        queryParams: {
          pubsub: this.pubSub
        }
      });

      try
      {
        const response = await fetch(url, {
          method: 'post',
          body: this.PatchPayload
        })
        // this.PatchPayload = '';
        this.add({
          patchUrl: this.PatchUrl,
          patchPayload: this.PatchPayload, 
          patchPubSub: this.pubSub
        });
      } catch {
        // TODO Vue toast/notifications
      }
    }
  }
}
</script>
