<template>
  <div class="about row">
    <router-link :to="{name:'home'}"> HOME PAGE </router-link>
    <router-link :to="{name:'order'}"> Orders PAGE </router-link>
    <div class="col-lg-12">
        <h1>This is an about page</h1>
    </div>
    <div v-for="order in orders" :key="order.id" class="col-lg-12">
        {{ order.paymentStatus }} <br> {{ order.guid }} <br> {{ order.totalPrice }} <br> {{ order.currency }} <br> {{ order.reference_number }} 
        <router-link :to="{name: 'orderId', params: {id: order.guid}}" class="btn btn-info btn-sm">
          view order
        </router-link>
        <hr>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'OrdersView',
  data () {
    return {
      orders: {},
      api: {},
      actionResponse: null
    }
  },
  mounted () {
    this.api = axios.create({
        baseURL: 'http://alov2.test/api/v1/',
        timeout: 60000,
        headers: {
          'lang': 'ar',
          'applicationToken' : '2a6e67fc-26bc-440e-b0e8-34599aab75a7',
          'accept' : 'application/json',
          'device-token' : "example_token_from_device_with_very_long_data",
          'Authorization': "Bearer 21|6iyEWMw77uKBAI5txawIH1bAXzxAIVFzwjoQWf69"
        }
    })
    this.getOrdres()
  },
  methods: {
    getOrdres () {
      this.api.get('client/orders').then((response) => {
        this.orders = response.data.result.data
      })
    },
  }
}
</script>
