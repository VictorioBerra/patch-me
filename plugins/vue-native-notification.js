import Vue from 'vue'
import VueNativeNotification from 'vue-native-notification'

Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})
