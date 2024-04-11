const searchbar = Vue.component("searchbar", {
  template: `
  <div class="text-center mt-5">
    <!-- "Go back" router link with a go symbol -->
    <router-link to="/" class="go-back-link">
      <i class="fas fa-arrow-left"></i> Go Back
    </router-link>
    <div class="container">
      <div v-if="Object.keys(prods).length === 0">
        <p>No Categories found</p>
      </div>
      <div v-else>
        <div class="row">
          <div v-for="(prod, product_id) in prods" :key="product_id" class="col-md-4 mb-4">
            <div class="card prod-details">
              <h6 class="card-title">{{ prod.product_name }}</h6>
              <p class="card-text">Stock: {{ prod.quantity }}</p>
              <p class="card-text">Price: {{ prod.unit_price }}</p>
              <p class="card-text">Manufacturing Date: {{ prod.manufacturing_date }}</p>
              <p class="card-text">Expiry Date: {{ prod.expiry_date }}</p>
              <button
                class="btn btn-block"
                :class="{
                  'btn-primary': prod.quantity > 0,
                  'btn-danger': prod.quantity === 0
                }"
                @click="prod.quantity > 0 ? addcart(prod.product_id) : null"
                :disabled="prod.quantity === 0"
              >
                {{ prod.quantity > 0 ? 'Add to Cart' : 'Out of Stock' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
    data() {
      return {
        query: "",
        prods: {},
      };
    },
    created() {
      this.query = this.$route.params.product_name;
    },
    mounted() {
      this.fetchProdData();
    },
    methods: {
      convertprodtodict(data) {
        const result = {};
        for (const key in data) {
          const products = data[key];
          result[products.product_id] = {
            product_id: products.product_id,
            product_name: products.product_name,
            unit_price: products.unit_price,
            expiry_date: products.expiry_date,
            quantity: products.quantity,
            manufacturing_date: products.manufacturing_date,
          };
        }
        return result;
      },
      addcart(pid) {
        this.$router.push({
          name: "addcart",
          params: {
            pid: pid,
          },
        });
      },
      async fetchProdData() {
        const token = localStorage.getItem("auth_token");
        try {
          const response = await fetch(`http://127.0.0.1:5000/user/searchbar/products/${this.query}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": token,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch the product.");
          }
          const data = await response.json();
          this.prods = await this.convertprodtodict(data);
        } catch (error) {
          console.error(error);
          throw new Error("No results found for the search query");
        }
      },
      goback() {
        this.$router.push({
          name: "User",
        });
      },
    },
  });
  
  export default searchbar;
  