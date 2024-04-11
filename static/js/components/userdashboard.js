const UserDashboard = Vue.component("userdashboard", {
  template: `
    <div class="mt-4">
      <nav class="navbar1 navbar-expand-lg navbar-light">
        <div class="container">
          <div class="input-group">
            <input
              type="text"
              class="form-control rounded-pill border-0 py-2"
              v-model="searchQuery"
              placeholder="Search category and products"
            />
            <div class="input-group-append">
              <button class="btn btn-sm btn-success rounded-pill" @click="performSearch">
                🔍
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div
        v-for="cat in categories"
        :key="cat.category_id"
        class="cat-box p-3 mb-3 border rounded shadow-lg bg-light"
      >
        <b><h3 class="cat-name text-center text-white bg-success p-2 rounded">{{ cat.category_name }}</h3></b>
        <!-- Display products within the category -->
        <div class="box d-flex flex-wrap">
          <div
            v-for="prod in cat.products"
            :key="prod.product_id"
            class="prod-details p-3 m-3 border rounded shadow-lg bg-light"
          >
            <h4 class="mb-3">{{ prod.product_name }}</h4>
            <div class="product-info">
              <div class="product-info-item">
                <span class="info-label">Unit Price:</span>
                <span class="info-value">{{ prod.unit_price }}</span>
              </div>
              <div class="product-info-item">
                <span class="info-label">Stock:</span>
                <span class="info-value">{{ prod.quantity }}</span>
              </div>
              <div class="product-info-item">
                <span class="info-label">Manufacturing Date:</span>
                <span class="info-value">{{ prod.manufacturing_date }}</span>
              </div>
              <div class="product-info-item">
                <span class="info-label">Expiry Date:</span>
                <span class="info-value">{{ prod.expiry_date }}</span>
              </div>
            </div>
            <button
              class="btn btn-block mt-3"
              :class="{
                'btn-success': prod.quantity > 0,
                'btn-danger': prod.quantity === 0
              }"
              @click="prod.quantity > 0 ? addcart(prod.product_id) : null"
              :disabled="prod.quantity === 0"
            >
              {{ prod.quantity > 0 ? 'addcart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      categories: [],
      catshow: {},
      searchQuery: "",
      productQuantities: {}, // Maintain quantities for each product
    };
  },
  mounted() {
    this.fetchCategoriesData();
  },


  methods: {
    async fetchCategoriesData() {
      try {
        const response = await fetch("http://127.0.0.1:5000/categories");
        const data = await response.json();
        this.categories = await this.convertKeysToDict(data);
      } catch (err) {
        console.error(err);
      }
    },
    async fetchproducts(categoryId) {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/products/${categoryId}`
        );
        const data = await response.json();
        return this.convertprodtodict(data);
      } catch (err) {
        console.error(err);
        return {};
      }
    },
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
      console.log(result);
      return result;
    },
    async convertKeysToDict(data) {
      const result = {};
      for (const key in data) {
        const categories = data[key];
        const products = await this.fetchproducts(categories.category_id);
        result[categories.category_id] = {
          category_id: categories.category_id,
          category_name: categories.category_name,
          products: products,
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

performSearch() {
  const categoriesMatch = this.findCategoriesByName(this.searchQuery);
  const productsMatch = this.findProductsByName(this.searchQuery);

  if (categoriesMatch) {
    this.$router.push({
      name: "Searchcategory",
      params: {
        category_name: categoriesMatch.category_name,
      },
    });
  } else if (productsMatch) {
    this.$router.push({
      name: "searchbar",
      params: {
        product_name: productsMatch.product_name,
      },
    });
  } else {
    console.log("No results found for the search query.");
  }
},

findCategoriesByName(query) {
  for (const categoryId in this.categories) {
    const categories = this.categories[categoryId];
    if (categories.category_name.toLowerCase() === query.toLowerCase()) {
      return categories;
    }
  }
  return null;
},

findProductsByName(query) {
  for (const categoryId in this.categories) {
    const categories = this.categories[categoryId];
    for (const productId in categories.products) {
      const products = categories.products[productId];
      if (products.product_name.toLowerCase() === query.toLowerCase()) {
        return products;
      }
    }
  }
  return null;
},

  },
});

export default UserDashboard;