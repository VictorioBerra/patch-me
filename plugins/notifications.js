import Vue from 'vue'

Vue.prototype.$localNotificationAPI = () => {} // Intentional noop

if (process.browser) {
  window.onNuxtReady(app => {
    // Some of the Local Notifications Code and comments are from:
    // https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API

    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
        // Browser doesn't support notifications. Just ignore
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
      // If it's okay let's enable the API
      Vue.prototype.$localNotificationAPI = localNotificationAPIWrapper;
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function(permission) {
        // If the user accepts, let's enable the API
        if (permission === 'granted') {
          Vue.prototype.$localNotificationAPI = localNotificationAPIWrapper
        }
      })
    }

    // Finally, if the user has denied notifications and you
    // want to be respectful there is no need to bother them any more.
  })
}

function localNotificationAPIWrapper(message) {
    var notification = new Notification(message)
}