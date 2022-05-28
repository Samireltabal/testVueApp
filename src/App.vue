<template>
  <div>
    <div class="row">
      <div class="col-lg-3">1</div>
      <div class="col-lg-3">
          <label for="">item id</label>
          <input type="text" class="form-control" v-model="itemid">
          <label for="">item count</label>
          <input type="text" class="form-control" v-model="itemCountAdd">
          <div class="form-check form-switch">
            <label class="form-check-label" for="">is guest ? </label>
            <input type="checkbox" v-model="guest" class="form-check-input checkbox" name="is guest">
          </div>
      </div>
    </div>
    <button @click="getProfile" class="btn btn-success mx-2">
      show profile
    </button>
    <button @click="addCart(itemid)" class="btn btn-success mx-2">
      add to cart
    </button>
     <button @click="emptyCart" class="btn btn-warning light mx-2">
      empty cart
    </button>
    <button @click="getCart"  class="btn btn-success mx-2">
      get cart
    </button>
    <img alt="Vue logo" src="./assets/logo.png">
    <div class="row">
      <div class="col-lg-12" v-if="cartItem.result">
        <h3>Cart ..</h3>
        <h3>Currency : {{ currency }}</h3>
        <h3>Total money : {{ cartTotal }}</h3>
        <h3>total items count : {{ cartItemsCount }}</h3>
        <h3>different items : {{ cartPieces }}</h3>

        <div v-for="(set, key) in cartItem.result.items" :key="key" class="my-2 mx-2">
         {{ set.itemDetails.name }} | {{ set.original_price }} * {{ set.quantity }} = {{ set.total_price}}
         <button @click="removeCart(set.guid)" class="btn btn-danger mx-2"> x </button> 
        </div>
      </div>
      <div class="col-lg-12">
        <div v-for="(set, key) in addCartItem.result" :key="key">
          <pre> 
              {{ set }}
          </pre>
        </div>
      </div>
      <div class="col-lg-3">
        <div v-for="(set, key) in removeCartItem.result" :key="key">
          <pre>
            {{ key }} : {{ set }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data () {
    return {
      profile: {},
      guest: false,
      cartItem: {},
      cartTotal: 0,
      cartItemsCount: 0,
      itemid: 361,
      itemCountAdd: 1,
      currency: '',
      cartPieces: 0,
      addCartItem: {},
      removeCartItem: {},
      api: {}
    }
  },
  mounted() {
    this.api = axios.create({
        baseURL: 'http://alov2.test/api/v1/',
        timeout: 2000,
        headers: {
          'lang': 'ar',
          'applicationToken' : '2a6e67fc-26bc-440e-b0e8-34599aab75a7',
          'accept' : 'application/json',
          'device-token' : "example_token_from_device_with_very_long_data",
          'Authorization': "Bearer 21|6iyEWMw77uKBAI5txawIH1bAXzxAIVFzwjoQWf69"
        }
    })

    this.getCart();
  },
  computed: {
      cartUri () {
        return this.guest ? '/client/cart/guest' : '/client/cart'
      },
      emptyUri () {
        return this.guest ? '/client/cart/guest/empty' : '/client/cart/empty'
      }
  },
  watch: {
    guest (val) {
      if (val) {
          this.api.defaults.headers['Authorization'] = 'foo bar'; 
      } else {
          this.api.defaults.headers['Authorization'] = "Bearer 21|6iyEWMw77uKBAI5txawIH1bAXzxAIVFzwjoQWf69"
      }
    }
  },
  methods: {
    getProfile () {
        this.api.get(this.cartUri).then((response) => {
          this.profile = response.data
        })
    },
    getCart () {
        this.api.get(this.cartUri).then((response) => {
          this.cartItem = response.data
          this.cartTotal = response.data.result.totalPrice
          this.cartItemsCount = response.data.result.totalCount ?? 0
          this.cartPieces = response.data.result.itemsCount ?? 0
          this.currency = response.data.result.currency ?? 'n/a'
        })
    },
    emptyCart () {
        this.api.post(this.emptyUri, {}).then(() => {
          this.getCart()
        })
    },
    addCart () {
        this.api.post(this.cartUri, {itemId: this.itemid, quantity: this.itemCountAdd}).then((response) => {
          this.cartItem = response.data
          this.cartTotal = response.data.result.totalPrice
          this.cartItemsCount = response.data.result.totalCount ?? 0
          this.cartPieces = response.data.result.itemsCount ?? 0
          this.currency = response.data.result.currency ?? 'n/a'
        })
    },
    removeCart (itemGuid) {
        let uri = `/client/cart/${itemGuid}`
        this.api.delete(uri).then(() => {
          this.getCart()
        })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
