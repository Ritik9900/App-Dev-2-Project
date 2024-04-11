const Searchcategory = Vue.component("Searchcategory", {
    template: `
    <div class="text-center mt-5">
      <!-- "Go back" router link with a go symbol -->
      <router-link to="/" class="go-back-link">
        <i class="fas fa-arrow-left"></i> Go Back
      </router-link>
      <div class="container">
        <div v-if="Object.keys(categ).length === 0">
          <p>No Categories found</p>
        </div>
        <div v-else>
          <div v-for="cat in categ" :key="cat.category_id" class="categ-name p-3 mb-3">
            <h4>{{ cat.category_name }}</h4>
            <div class="row">
              <div v-for="prod in cat.products" :key="prod.product_id" class="col-md-4 mb-4">
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
    </div>
  `,
    data() {
      return {
        query: "",
        categ: {}, 
      };
    },
    created() {
      this.query = this.$route.params.category_name;
    },
    mounted() {
      this.fetchCategData();
    },
    methods: {
      convertprodtodict(data) {
        const result = {};
        for (const product of data) {
          result[product.product_id] = {
            product_id: product.product_id,
            product_name: product.product_name,
            unit_price: product.unit_price,
            expiry_date: product.expiry_date,
            quantity: product.quantity,
            manufacturing_date: product.manufacturing_date,
          };
        }
        return result;
      },
      async convertKeysToDict(data) {
        const result = {};
        for (const key in data) {
          const categories = data[key];
          const prods = await this.fetchproducts(categories.category_id);
          result[categories.category_id] = {
            category_id: categories.category_id,
            category_name: categories.category_name,
            products: prods,
          };
        }
        return result;
      },
      addcart(pid) {
        this.$router.push({
          name: "addcart",
          params: {
            pid: pid
          }
        });
      },
      async fetchCategData() {
        const payload = {
          query: this.query,
        };
        const token = localStorage.getItem("auth_token");
        try {
          const response = await fetch(`http://127.0.0.1:5000/user/searchcat/${this.query}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": token,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch categories.");
          }
          const data = await response.json();
          this.categ = await this.convertKeysToDict(data);
        } catch (error) {
          console.error(error);
        }
      },
      async fetchproducts(categoryId) {
        try {
          const response = await fetch(`http://127.0.0.1:5000/products/${categoryId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch products.");
          }
          const data = await response.json();
          return await this.convertprodtodict(data);
        } catch (error) {
          console.error(error);
          return {};
        }
      },
      goback() {
        this.$router.push({
          name: "User"
        });
      }
    },
  });
  
  export default Searchcategory;
  