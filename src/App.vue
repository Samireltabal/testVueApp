<template>
  <div>
   <router-view></router-view>
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
      services: {},
      services2: {},
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
        timeout: 60000,
        headers: {
          'lang': 'ar',
          'applicationToken' : '2a6e67fc-26bc-440e-b0e8-34599aab75a7',
          'accept' : 'application/json',
          'device-token' : "example_token_from_device_with_very_long_data",
          'Authorization': "Bearer 21|6iyEWMw77uKBAI5txawIH1bAXzxAIVFzwjoQWf69"
        }
    })

    this.getCart();
    this.getServices();
    this.getServices2();
  },
  computed: {
      cartUri () {
        return this.guest ? '/client/cart/guest' : '/client/cart'
      },
      emptyUri () {
        return this.guest ? '/client/cart/guest/empty' : '/client/cart/empty'
      },
      servicesUri () {
        return 'client/services?page=1&per_page=20&category_id=21';
      },
      servicesUri2 () {
        return 'client/services?page=1&per_page=20&category_id=10';
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
    checkout () {
        this.api.get('/client/checkout').then((response) => {
          console.log(response.data)
          this.getCart()
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
    addItemById (id) {
      this.itemid = id
      this.itemCountAdd = 1
      this.addCart()
    },
    removeCart (itemGuid) {
        let uri = `${this.cartUri}/${itemGuid}`
        this.api.delete(uri).then((response) => {
          this.cartItem = response.data
          this.cartTotal = response.data.result.totalPrice
          this.cartItemsCount = response.data.result.totalCount ?? 0
          this.cartPieces = response.data.result.itemsCount ?? 0
          this.currency = response.data.result.currency ?? 'n/a'
        })
    },
    getServices () {
        let uri = `${this.servicesUri}`
        this.api.get(uri).then((response) => {
          this.services = response.data.result.data
        })
    },
    getServices2 () {
        let uri = `${this.servicesUri2}`
        this.api.get(uri).then((response) => {
          this.services2 = response.data.result.data
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
