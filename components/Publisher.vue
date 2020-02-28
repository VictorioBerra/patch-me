<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model="patchUrl"
          label="Patch Url"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="patchLink"
          label="Patch Link"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="patchPayload"
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
import { mapState, mapActions } from 'vuex'
import PublishedRequests from '~/components/PublishedRequests.vue'
import buildUrl from 'build-url';

export default {
  components: {
    PublishedRequests
  },
  data() {
    return {
      patchUrl: '',
      patchPayload: '{ "Hello": "World" }',
      pubSub: true
    }
  },
  computed: {
    ...mapState({
      initialPatchUrl: 'patchUrl',
      initialPatchLink: 'patchLink'
    })
  },
  created: function(){
    this.patchUrl = this.initialPatchUrl;
    this.patchLink = this.initialPatchLink;
  },
  methods: {
    ...mapActions({
      add: 'publisher/addPublishedRequest'
    }),
    async post() {

      const url = buildUrl(this.patchUrl, {
        path: this.patchLink,
        queryParams: {
          pubsub: this.pubSub
        }
      });

      try
      {
        const response = await fetch(url, {
          method: 'post',
          body: this.patchPayload
        })

        this.add({
          patchUrl: url,
          patchPayload: this.patchPayload, 
          patchPubSub: this.pubSub
        });
      } catch {
        this.$dialog.notify.error(`POST to url failed. Check your URL and link, verify the patch service is up.`)        
      }
    }
  }
}
</script>
