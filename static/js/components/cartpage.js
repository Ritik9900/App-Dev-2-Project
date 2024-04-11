const Cartpage = Vue.component("Cartpage", {
    template: `
    <div class="text-center mt-5">
      <h1>Your Cart</h1>
      <h2 v-show="showmessage" class="text-success">{{ message }} and total price paid = ₹{{ total }}</h2>
      <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.cart_item_id">
              <td>{{ item.product_name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.total }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-primary me-2" @click="addtocartagain(item.product_id)">Add Quantity</button>
                  <button class="btn btn-danger" @click="removefromcart(item.cart_item_id)">Remove</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-success" @click="checkout" :disabled="cartItems.length === 0">Checkout</button>
    </div>
  `,
  
    data() {
      return {
        showmessage: false,
        message: "",
        total: 0,
        cartItems: {},
      };
    },
    mounted() {
      this.fetchdata();
    },
    methods: {
      addtocartagain(pid) {
        this.$router.push({
          name: "addcart",
          params: {
            pid: pid,
          },
        });
      },
      fetchdata() {
        const authtoken = localStorage.getItem("auth_token");
        fetch(`http://127.0.0.1:5000/user/cartpage/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": authtoken,
          },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => {
            console.log(data);
            this.cartItems = data;
          });
      },
      removefromcart(id) {
        const authtoken = localStorage.getItem("auth_token");
        fetch(`http://127.0.0.1:5000/user/cartpage/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": authtoken,
          },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => {
            console.log(data);
            this.fetchdata();
          });
      },
      checkout() {
        const authtoken = localStorage.getItem("auth_token");
        fetch(`http://127.0.0.1:5000/user/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": authtoken,
          },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => {
            console.log(data);
            this.showmessage = true;
            this.message = data.message;
            this.total = data.total_price;
            setTimeout(() => {
              this.showmessage = false;
              this.message = "";
              this.total = 0;
              this.fetchdata();
              this.$router.push("/")
            }, 5000);
          });
      },
    },
  });
  export default Cartpage;
  