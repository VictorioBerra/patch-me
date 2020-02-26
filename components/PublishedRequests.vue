<template>
    <v-list>
        <v-subheader>Published Request History</v-subheader>
        
        <v-list-item  
            v-for="publishedRequest in allPublishedRequests"
            :key="publishedRequest.id"
            :title="publishedRequest.id"
            subheader two-line>
        <v-list-item-content>
            <v-list-item-title>{{publishedRequest.url}}{{`?pubsub=${publishedRequest.pubsub}`}}</v-list-item-title>
            <v-list-item-subtitle>
                {{publishedRequest.payload}}
            </v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script>

import { mapGetters, mapActions } from "vuex";

export default {
    computed: mapGetters({
        allPublishedRequests: "publisher/allPublishedRequests"
    })
}
</script>
