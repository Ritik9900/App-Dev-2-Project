const Summarypage = Vue.component("Summarypage", {
    template: `
    <div class="text-center mt-5">
      <div v-if="showMessage">
        <h1 style="color: red;">{{ errorMessage }}</h1>
      </div>
      <div v-else>
        <h1>Summary Page</h1>
        <div class="image-grid d-flex justify-content-center align-items-center flex-wrap">
          <div v-for="imageName in imageNames" :key="imageName" class="image-container m-3">
            <img :src="'/static/js/' + imageName + '.png'" class="img-fluid" alt="Summary Image" />
          </div>
        </div>
      </div>
    </div>
  `,
    data() {
      return {
        imageNames: [],
        errorMessage: "",
        showMessage: false,
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        const token = localStorage.getItem("auth_token");
        fetch("http://127.0.0.1:5000/summarypage", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": token,
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else if (response.status === 401) {
              throw new Error("Not Authorized to access this page!!!");
            } else {
              throw new Error("Summary data not available");
            }
          })
          .then((data) => {
            this.imageNames = data;
          })
          .catch((error) => {
            this.showMessage = true;
            this.errorMessage = error.message;
            console.error(error);
          });
      },
    },
  });
  
  export default Summarypage;
  