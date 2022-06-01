import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import router from './router'
// import "https://test.oppwa.com/v1/paymentWidgets.js"
createApp(App).use(router).mount('#app')
