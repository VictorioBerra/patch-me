<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="reset">
          <v-list-item-action>
            <v-icon>mdi-delete-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Reset Local State
            </v-list-item-title>
          </v-list-item-content> 
        </v-list-item>       
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer 
    v-model="rightDrawer" 
    :right="right" 
    width="512"
    temporary 
    fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Publisher</v-list-item-title>
        </v-list-item>

         <v-divider></v-divider>

           <v-list
        dense
        nav
      >
        <v-list-item>
          <v-list-item-content>
            <router-link to="/publisher">Go to Full Publisher</router-link>
            <Publisher />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import Publisher from '~/components/Publisher.vue'

export default {
  components: {
    Publisher
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false, // Footer
      items: [
        {
          icon: 'mdi-apps',
          title: 'Subscriptions',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Publisher',
          to: '/publisher'
        },
        {
          icon: 'mdi-information-variant',
          title: 'About',
          to: '/about'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Patch Me'
    }
  },
  methods: {
    async reset(){
      const res = await this.$confirm(`
      Are you sure you want to reset the environment to defaults?
      </br>
      </br>
      This will delete all histor and reload the page.
      `, { title: 'Clear Everything?', color: "red darken-3" })
      if (res) {
        this.$store.dispatch('reset');
      }
    }
  }
}
</script>
