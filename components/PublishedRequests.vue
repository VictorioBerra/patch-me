<template>
    <v-list>
        <v-subheader>Published Request History</v-subheader>
        <v-list-item  
            v-for="(publishedRequest, id) in allPublishedRequests"
            :key="id"
            :title="publishedRequest.url"
            subheader two-line>
        <v-list-item-content>
            <v-list-item-title>{{publishedRequest.url}}</v-list-item-title>
            <v-list-item-subtitle>
                {{publishedRequest.payload}}
            </v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PublishedRequests from '~/components/PublishedRequests.vue'
import buildUrl from 'build-url';

export default {
  data() {
    return {

    }
  },
  computed: {
      ...mapState('publisher', {
          allPublishedRequests: state => state.publishedRequests,
      })
  },
  created: function(){
  },
  methods: {
  }
}
</script>
