<template>
  <div class="about row">
    <router-link :to="{name:'home'}"> HOME PAGE </router-link>
    <router-link :to="{name:'order'}"> Orders PAGE </router-link>
    <div class="alert alert-danger" v-if="actionResponse">
      {{ actionResponse }} 
    </div>
    <input type="checkbox" name="test" id="test" v-model="isLoading">
    <div class="col-lg-12">
       <h3> Order : #{{ orders.guid }} </h3>
       <h3> total : {{ orders.totalPrice }} {{ orders.currency }} </h3>
       <h3> status : {{ orders.paymentStatus }} </h3>
       <h3> reference number : {{ orders.paymentReference }} </h3>
       <h3> last update : {{ orders.lastUpdate ? orders.lastUpdate.human : null }} </h3>
       <h3> 
            <div>
              <select v-model="paymentMethod">
                <option value="0">Card</option>
                <option value="1">ApplePay</option>
                <option value="2">Mada</option>
              </select>
            </div>
            <button class="btn btn-success btn-xl" @click="payNow">
                Pay now
            </button>
            <button class="btn btn-success btn-xl" @click="sendAck">
                send ack
            </button>
        </h3>
    </div>
    <div v-if="!isLoading">
      <div v-for="item in orders.items" :key="item.guid"> 
          <img :src="item.itemDetails.image" class="w-200 img-thumbnail" style="max-width: 200px;">
          {{ item.quantity }} * {{ item.itemDetails.name }}
      </div>
    </div>
    <div v-else>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- <div v-for="order in orders" :key="order.id" class="col-lg-12">
        {{ order.paymentStatus }} <br> {{ order.guid }} <br> {{ order.totalPrice }} <br> {{ order.currency }} <br> {{ order.reference_number }} 
        <router-link :to="{name: 'orderId', params: {id: order.guid}}" class="btn btn-info btn-sm">
          view order
        </router-link>
        <hr>
    </div> -->
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
      isLoading: false,
      actionResponse: null,
      paymentMethod: 0
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
      this.api.get('client/orders/' + this.$route.params.id ).then((response) => {
        this.orders = response.data.result
      })
    },
    payNow() {
      this.isLoading = true
      this.api.post('client/orders/pay/' + this.$route.params.id, {payment_method: this.paymentMethod})
      .then((response) => {
        window.location = 'http://localhost/checkout/' + response.data.result.checkout_id
      })
      .catch((err) => {
          this.actionResponse = err.response.data
      })
      .finally(() => {
        this.isLoading = false;
      })
    },
    sendAck () {
        this.isLoading = true
        this.api.get('client/orders/' + this.$route.params.id + '/ack' ).then((response) => {
          this.orders = response.data.result
        }).finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
