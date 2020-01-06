<template>
  <v-container>

    <v-row>
      <v-col>
        <p>Use this page to send HTTP requests off to the desired publish URL.</p>
      </v-col>
    </v-row>

    <v-row>
      <Publisher />
    </v-row>
  </v-container>
</template>

<script>
import Publisher from '~/components/Publisher.vue'

export default {
  components: {
    Publisher
  }
}
</script>
