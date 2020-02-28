import Vue from 'vue'
import VuetifyConfirm from 'vuetify-confirm'
 
export default ({ app }) => {
  Vue.use(VuetifyConfirm, { vuetify: app.vuetify })
}