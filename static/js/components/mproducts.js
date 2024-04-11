const MProducts = Vue.component("mproducts", {
  template: `
    <div class="container mt-5">
    <h1>Products</h1>
    <h4>{{category_name}}</h4>
    <h4 v-if="show">{{ errormessage }}</h4>
    <h4 v-if="productsdata.length === 0">No products created yet</h4> 
    <table class="table" v-else>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Expiry Date</th>
          <th>Revenue</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prod in productsdata" :key="prod.product_id">
          <td>{{ prod.product_name }}</td>
          <td>{{ prod.unit_price }}</td>
          <td>{{ prod.quantity }}</td>
          <td>{{ prod.expiry_date }}</td>
          <td>{{ prod.revenue }}</td>
          <td>
            <button class="btn btn-primary" @click="uproduct(prod)">Update</button>
            <button class="btn btn-danger" @click="deleteprod(prod.product_id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-success" @click="product">Add product</button>
    <form v-if="showform">
      <label for="product_name">Product Name:</label>
      <input type="text" class="form-control" v-model="product_name" required>
      <label for="price">Price:</label>
      <input type="number" class="form-control" v-model="unit_price" required>
      <label for="quantity">Quantity:</label>
      <input type="number" class="form-control" v-model="quantity" required>
      <label for="manufacturing_date">MFG Date:</label>
      <input type="datetime-local" class="form-control" v-model="manufacturing_date" required>
      <label for="expiry_date">EXP Date:</label>
      <input type="datetime-local" class="form-control" v-model="expiry_date" required>
      <input type="submit" class="btn btn-primary" @click="createprod">
    </form>
    <form v-if="showuform">
      <label for="uproduct_name">Product Name:</label>
      <input type="text" class="form-control" v-model="uprod.product_name" required>
      <label for="uprice">Price:</label>
      <input type="number" class="form-control" v-model="uprod.unit_price" required>
      <label for="uquantity">Quantity:</label>
      <input type="number" class="form-control" v-model="uprod.quantity" required>
      <input type="submit" class="btn btn-primary" @click="updateprod(uprod.product_id)">
    </form>
  </div>
      `,
  data() {
    return {
      productsdata: "",
      show: false,
      category_name: "",
      cid: null,
      product_name: "",
      unit_price: "",
      quantity: "",
      manufacturing_date: "",
      expiry_date: "",
      showform: false,
      showuform: false,
      errormessage: "",
      uprod: {},
    };
  },
  created() {
    this.category_name = this.$route.params.cname;
    this.cid = this.$route.params.cid;
  },
  mounted() {
    this.fetchdata();
  },
  methods: {
    fetchdata() {
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/products/${this.cid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.productsdata = data;
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
          }, 2000);
        });
    },
    product() {
      this.showform = !this.showform;
    },
    uproduct(prod) {
      this.showuform = !this.showuform;
      if (this.showuform) {
        this.uprod = { ...prod };
      } else {
        this.uprod = {};
      }
    },
    createprod() {
      const Data = {
        product_name: this.product_name,
        quantity: this.quantity,
        unit_price: this.unit_price,
        manufacturing_date: this.manufacturing_date,
        expiry_date: this.expiry_date,
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/products/create/${this.cid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(Data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.show = true;
          this.errormessage = "added success!!";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.showform = false;
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
        });
    },
    deleteprod(pid) {
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/products/prod/${pid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.show = true;
          this.errormessage = "Deleted success!!";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.product_name = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
        });
    },
    updateprod(pid) {
      const Data = {
        product_name: this.uprod.product_name,
        quantity: this.uprod.quantity,
        unit_price: this.uprod.unit_price,
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/products/prod/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(Data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.show = true;
          this.errormessage = "Updated success!!";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.product_name = "";
            this.showuform = false;
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
        });
    },
  },
});

export default MProducts;
