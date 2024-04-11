const addcart = Vue.component("addcart", {
    template: `
    <div class="addcart text-center mt-5">
      <h1 class="mb-4">Product Name: {{ pdata.product_name }}</h1>
      <h4>Available Quantity: {{ pdata.quantity }}</h4>
  
      <form @submit.prevent="submitForm" style="max-width: 400px; margin: 0 auto;">
        <div class="mb-3">
          <label for="quantity" class="form-label">Quantity</label>
          <input type="text" id="quantity" class="form-control" v-model="pform.quantity">
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Price: {{ pdata.unit_price }}</label>
        </div>
        <div class="mb-3">
          <label for="total" class="form-label">Total Price: {{ pform.total }}</label>
        </div>
        <button type="submit" class="btn btn-primary" @click="addcart" :disabled="SubmitDisabled">Submit</button>
      </form>
    </div>
  `,
  
    data() {
      return {
        pid: null,
        pdata: {},
        SubmitDisabled: true, 
        pform: {
          pid:0,
          quantity: 0,
          total:0
        },
      };
    },
    created() {
      this.pid = this.$route.params.pid;
    },
    mounted() {
      this.fetchdata();
    },
    methods: {
      
      fetchdata() {
        fetch(`http://127.0.0.1:5000/addcart/${this.pid}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              return "NotFound";
            }
          })
          .then((data) => {
            this.pdata = data;
            // Update values after fetching data
            this.pform.pid=data.product_id;
          })
          .catch((error) => {
            console.error(error);
          });
      },
      addcart(){
          const authtoken = localStorage.getItem("auth_token");
          fetch(`http://127.0.0.1:5000/user/cartpage/`,{
              method: "POST",
              headers: {
              "Content-Type": "application/json",
              "Authentication-Token": authtoken,
              },
              body: JSON.stringify(this.pform)
          })
          .then((res)=>{
              if(res.ok){
                  return res.json()
              }
          }).then((data)=>{
              console.log(data)
              this.$router.push("/")
          })
      }
    },
    watch: {
      'pform.quantity': function (newQuantity) {
        if (newQuantity > this.pdata.quantity) {
          this.pform.total = 0;
          this.SubmitDisabled = true; 
        } else {
          this.pform.total = newQuantity * this.pdata.unit_price;
          this.SubmitDisabled = false; 
        }
      },
    },
  });
  
  export default addcart;
  